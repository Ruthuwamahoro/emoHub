import showToast from "@/utils/showToast";
import { RefreshCw } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export function CreateGroupModal({ 
    onClose, 
    onGroupCreated 
  }: { 
    onClose: () => void, 
    onGroupCreated: () => void 
  }) {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleSubmit = async () => {
      if (!groupName.trim()) {
        showToast('Group name is required', 'error');
        return;
      }
      
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        onGroupCreated();
        showToast('Group created successfully!', 'success');
      }, 1000);
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Group</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Describe the purpose of this group"
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Image</label>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
                <PlusCircle className="mx-auto w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload image</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-70 flex items-center"
            >
              {isSubmitting && <RefreshCw className="animate-spin mr-2" size={18} />}
              Create Group
            </button>
          </div>
        </div>
      </div>
    );
  }