import { useSelector } from "react-redux";
import { getStatusColor } from "./StatusColor";
import { History, X } from "lucide-react";

export function HistoryTab({ setShowHistory }) {
  const { history } = useSelector((state) => state.carePlans);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <History className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Care Plan History
              </h2>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {history.map((plan) => (
              <div key={plan._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-gray-900">
                      Version {plan.version}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        plan.status
                      )}`}
                    >
                      {plan.status}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      Creation Date:{" "}
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Assessed By:</span>{" "}
                    {plan.assessedBy}
                  </div>
                  <div>
                    <span className="font-medium">Assessment Date:</span>{" "}
                    {new Date(plan.assessmentDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Review Date:</span>{" "}
                    {new Date(plan.reviewDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
