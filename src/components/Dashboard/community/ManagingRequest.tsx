import { Clock } from "lucide-react";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { useState } from "react";
import { GroupRequest } from "./Community";

export function ManagementModal({ 
    requests,
    onClose, 
    onApproveRequest,
    onRejectRequest
  }: { 
    requests: GroupRequest[],
    onClose: () => void,
    onApproveRequest: (id: number) => void,
    onRejectRequest: (id: number) => void
  }) {
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    
    const filteredRequests = requests.filter(request => request.status === activeTab);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-8 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Requests</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {(['pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition capitalize ${
                  activeTab === tab 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab} ({requests.filter(r => r.status === tab).length})
              </button>
            ))}
          </div>
  
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="mx-auto w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No {activeTab} requests</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.requestType === 'create' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {request.requestType === 'create' ? 'Create Group' : 'Become Moderator'}
                        </span>
                        <span className="text-sm text-gray-500">{request.createdAt}</span>
                      </div>
                      <h4 className="font-semibold text-gray-800">{request.userName}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {request.requestType === 'create' 
                          ? `Wants to create: "${request.groupName}"` 
                          : `Wants to moderate: "${request.groupName}"`
                        }
                      </p>
                      {request.description && (
                        <p className="text-sm text-gray-500">{request.description}</p>
                      )}
                    </div>
                    
                    {activeTab === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => onApproveRequest(request.id)}
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          <Check size={16} className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => onRejectRequest(request.id)}
                          className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                        >
                          <X size={16} className="mr-1" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }