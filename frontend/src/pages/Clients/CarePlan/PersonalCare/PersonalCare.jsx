export function PersonalCareTab({ activeCarePlan }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>Personal Care Needs Assessment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(activeCarePlan.personalCare || {})
            .filter(
              ([, care]) =>
                care &&
                typeof care === "object" &&
                "required" in care &&
                care.required
            )
            .map(([key, care]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h4>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Required
                  </span>
                </div>

                {care && typeof care === "object" && care.notes && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Notes:</strong> {care.notes}
                  </p>
                )}

                {care && typeof care === "object" && care.frequency && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Frequency:</strong> {care.frequency}
                  </p>
                )}

                {care && typeof care === "object" && care.level && (
                  <p className="text-sm text-gray-600">
                    <strong>Level:</strong> {care.level}
                  </p>
                )}
              </div>
            ))}

          {(!activeCarePlan.personalCare ||
            Object.keys(activeCarePlan.personalCare).length === 0 ||
            !Object.entries(activeCarePlan.personalCare).some(
              ([, care]) =>
                care &&
                typeof care === "object" &&
                "required" in care &&
                care.required
            )) && (
            <div className="col-span-full text-center py-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Required Personal Care Needs
              </h4>
              <p className="text-gray-600">
                No personal care needs are currently marked as required.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
