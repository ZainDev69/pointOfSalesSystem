export function OverviewTab({ activeCarePlan }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Care Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Care Needs
        </h3>
        <div className="space-y-3">
          {Object.entries(activeCarePlan.personalCare || {}).map(
            ([key, care]) => (
              <div
                key={key}
                className="mb-2 p-2 rounded border border-gray-100 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      care &&
                      typeof care === "object" &&
                      "required" in care &&
                      care.required
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {care &&
                    typeof care === "object" &&
                    "required" in care &&
                    care.required
                      ? "Required"
                      : "Not Required"}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Daily Living Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Daily Living Support
        </h3>
        <div className="space-y-3">
          {Object.entries(activeCarePlan.dailyLiving || {}).map(
            ([key, support]) => (
              <div
                key={key}
                className="mb-2 p-2 rounded border border-gray-100 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      support?.required
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {support?.required ? "Required" : "Not Required"}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
