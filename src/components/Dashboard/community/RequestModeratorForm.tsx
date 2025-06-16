import showToast from "@/utils/showToast";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export function RequestModal({ 
    onClose, 
    onRequestSent 
  }: { 
    onClose: () => void, 
    onRequestSent: () => void 
  }) {
    const [requestType, setRequestType] = useState<'create' | 'moderator'>('create');
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleSubmit = async () => {
      if (requestType === 'create' && !groupName.trim()) {
        showToast('Group name is required', 'error');
        return;
      }
      if (requestType === 'moderator' && !selectedGroupId) {
        showToast('Please select a group', 'error');
        return;
      }
      
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        onRequestSent();
      }, 1000);
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Request</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setRequestType('create')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    requestType === 'create' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Create Group
                </button>
                <button
                  onClick={() => setRequestType('moderator')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    requestType === 'moderator' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Become Moderator
                </button>
              </div>
            </div>
  
            {requestType === 'create' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter proposed group name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Explain why this group should be created"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Group</label>
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Choose a group...</option>
                    <option value="1">Fitness Community</option>
                    <option value="2">Tech Enthusiasts</option>
                    <option value="3">Book Club</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to be a moderator?</label>
                  <textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Explain your motivation and qualifications"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </>
            )}
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
              Send Request
            </button>
          </div>
        </div>
      </div>
    );
  }