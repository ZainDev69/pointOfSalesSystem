import {
  Plus,
  MessageSquare,
  Edit3,
  Trash,
  CheckCircle,
  History,
} from "lucide-react";
export function ActivityTab({ client }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <History className="w-5 h-5 text-blue-600" />
        <span>Activity Log</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left font-medium text-gray-700">
                Date/Time
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">
                Action
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">
                User
              </th>
            </tr>
          </thead>
          <tbody>
            {(client.activityLog || []).length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No activity recorded yet.
                </td>
              </tr>
            ) : (
              [...client.activityLog].reverse().map((log, idx) => {
                // Zebra striping
                const isEven = idx % 2 === 0;
                // Highlight most recent
                const isMostRecent = idx === 0;
                // User initials
                const getInitials = (name) => {
                  if (!name) return "?";
                  return name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();
                };
                // Action icon (simple mapping)
                const actionIconMap = {
                  Created: (
                    <Plus className="w-4 h-4 text-green-500 mr-1 inline" />
                  ),
                  Updated: (
                    <Edit3 className="w-4 h-4 text-blue-500 mr-1 inline" />
                  ),
                  Deleted: (
                    <Trash className="w-4 h-4 text-red-500 mr-1 inline" />
                  ),
                  Contacted: (
                    <MessageSquare className="w-4 h-4 text-purple-500 mr-1 inline" />
                  ),
                };
                // Try to pick an icon based on action text
                const actionKey = Object.keys(actionIconMap).find((key) =>
                  (log.action || "").toLowerCase().includes(key.toLowerCase())
                );
                const ActionIcon = actionKey ? (
                  actionIconMap[actionKey]
                ) : (
                  <CheckCircle className="w-4 h-4 text-gray-400 mr-1 inline" />
                );
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isEven ? "bg-gray-50" : "bg-white"
                    } ${
                      isMostRecent ? "ring-2 ring-blue-200" : ""
                    } hover:bg-blue-50`}
                  >
                    <td className="px-3 py-2 font-mono text-blue-700 whitespace-nowrap">
                      {log.date ? (
                        <span>
                          {new Date(log.date).toLocaleDateString()}
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(log.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2 flex items-center">
                      {ActionIcon}
                      <span className="ml-1">{log.action}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center">
                        <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-2 border border-blue-200">
                          {getInitials(log.user)}
                        </span>
                        <span className="font-medium text-gray-800">
                          {log.user}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
