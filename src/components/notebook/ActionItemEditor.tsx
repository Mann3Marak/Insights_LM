import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ActionItem {
  id: string;
  action_text: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface ActionItemEditorProps {
  actionItem?: ActionItem;
  onSave: (text: string, isCompleted: boolean) => void;
  onDelete?: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ActionItemEditor = ({
  actionItem,
  onSave,
  onDelete,
  onCancel,
  isLoading = false
}: ActionItemEditorProps) => {
  const [text, setText] = useState(actionItem?.action_text || '');
  const [isCompleted, setIsCompleted] = useState(actionItem?.is_completed || false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (actionItem) {
      setText(actionItem.action_text);
      setIsCompleted(actionItem.is_completed);
    }
  }, [actionItem]);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim(), isCompleted);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteDialog(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  return (
    <div className="w-full bg-gray-50 border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium text-gray-900">
              {actionItem ? 'Edit Action Item' : 'New Action Item'}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            {actionItem && onDelete && (
              <Button variant="outline" size="sm" onClick={handleDelete} disabled={isLoading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={isLoading || !text.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Completion Status Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="completed"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
          />
          <label htmlFor="completed" className="text-sm font-medium text-gray-700">
            Mark as completed
          </label>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <Card className="h-full border border-gray-200">
          <div className="p-4 h-full flex flex-col">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the action item..."
              className="flex-1 resize-none border-none focus:ring-0 focus:outline-none text-sm"
              disabled={isLoading}
              autoFocus
            />
          </div>
        </Card>
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-500">
          <span className="mr-4">Press Ctrl+Enter to save</span>
          <span>Press Escape to cancel</span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Action Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The action item will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionItemEditor;
