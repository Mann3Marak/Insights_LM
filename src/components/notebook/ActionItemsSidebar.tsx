import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useActionItems } from '../../hooks/useActionItems';

interface ActionItem {
  id: string;
  action_text: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface ActionItemsSidebarProps {
  notebookId?: string;
  onActionItemClick?: (actionItem: ActionItem) => void;
  onCreateActionItem?: () => void;
}

const ActionItemsSidebar = ({
  notebookId,
  onActionItemClick,
  onCreateActionItem
}: ActionItemsSidebarProps) => {
  const {
    actionItems,
    isLoading,
    updateActionItem
  } = useActionItems(notebookId);

  const renderCompletionStatus = (isCompleted: boolean) => {
    return isCompleted ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    );
  };

  const handleToggleComplete = (e: React.ChangeEvent<HTMLInputElement>, item: ActionItem) => {
    e.stopPropagation(); // Prevent triggering the card click
    updateActionItem({
      id: item.id,
      updates: { is_completed: !item.is_completed }
    });
  };

  const handleActionItemClick = (actionItem: ActionItem) => {
    if (onActionItemClick) {
      onActionItemClick(actionItem);
    }
  };

  const handleCreateClick = () => {
    if (onCreateActionItem) {
      onCreateActionItem();
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Action Item
          </Button>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-600">Loading action items...</p>
          </div>
        ) : actionItems && actionItems.length > 0 ? (
          <div className="space-y-4">
            {actionItems.map((item: ActionItem) => (
              <Card 
                key={item.id} 
                className="p-3 border border-gray-200 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                onClick={() => handleActionItemClick(item)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={item.is_completed}
                    onChange={(e) => handleToggleComplete(e, item)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking checkbox
                  />
                  <span className={`text-sm text-gray-900 flex-1 min-w-0 ${item.is_completed ? 'line-through text-gray-500' : ''}`}>
                    {item.action_text}
                  </span>
                </div>
                <div className="flex-shrink-0 py-[4px]">
                  {renderCompletionStatus(item.is_completed)}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">✅</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No action items yet</h3>
            <p className="text-sm text-gray-600 mb-4">Action items from your conversations will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionItemsSidebar;
