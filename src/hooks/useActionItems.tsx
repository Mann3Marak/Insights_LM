import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ActionItem {
  id: string;
  notebook_id: string;
  user_id: string;
  action_text: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useActionItems = (notebookId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: actionItems, isLoading } = useQuery<ActionItem[]>({
    queryKey: ['actionItems', notebookId],
    queryFn: async () => {
      if (!notebookId || !user) return [];
      
      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('notebook_id', notebookId)
        .eq('user_id', user.id) // Ensure only current user's action items are fetched
        .order('created_at', { ascending: false }); // Order by creation date, newest first
      
      if (error) throw error;
      return data as ActionItem[];
    },
    enabled: !!notebookId && !!user, // Only run query if notebookId and user are available
  });

  const addActionItemMutation = useMutation({
    mutationFn: async ({ 
      action_text,
      notebook_id,
      user_id
    }: { 
      action_text: string; 
      notebook_id: string;
      user_id: string;
    }) => {
      if (!notebook_id || !user_id) throw new Error('Notebook ID and User ID are required');
      
      const { data, error } = await supabase
        .from('action_items')
        .insert([{
          notebook_id,
          user_id,
          action_text,
          is_completed: false // Default to not completed
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems', notebookId] });
    },
  });

  const updateActionItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ActionItem> }) => {
      const { data, error } = await supabase
        .from('action_items')
        .update({ ...updates, updated_at: new Date().toISOString() }) // Ensure updated_at is set
        .eq('id', id)
        .eq('user_id', user?.id) // Ensure user can only update their own
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems', notebookId] });
    },
  });

  const deleteActionItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('action_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id); // Ensure user can only delete their own
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems', notebookId] });
    },
  });

  return {
    actionItems,
    isLoading,
    addActionItem: addActionItemMutation.mutate,
    isAdding: addActionItemMutation.isPending,
    updateActionItem: updateActionItemMutation.mutate,
    isUpdating: updateActionItemMutation.isPending,
    deleteActionItem: deleteActionItemMutation.mutate,
    isDeleting: deleteActionItemMutation.isPending,
  };
};
