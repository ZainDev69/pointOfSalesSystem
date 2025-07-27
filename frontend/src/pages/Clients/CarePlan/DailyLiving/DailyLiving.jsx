import { FileText } from "lucide-react";
export function DailyLivingTab({ activeCarePlan }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-green-600" />
          <span>Daily Living Support Assessment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(activeCarePlan.dailyLiving || {})
            .filter(([, support]) => support?.required)
            .map(([key, support]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </h4>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Required
                  </span>
                </div>

                {support?.notes && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Notes:</strong> {support.notes}
                  </p>
                )}

                {support?.frequency && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Frequency:</strong> {support.frequency}
                  </p>
                )}

                {support?.level && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Level:</strong> {support.level}
                  </p>
                )}

                {support?.assistance && (
                  <p className="text-sm text-gray-600">
                    <strong>Assistance Type:</strong> {support.assistance}
                  </p>
                )}
              </div>
            ))}

          {(!activeCarePlan.dailyLiving ||
            Object.keys(activeCarePlan.dailyLiving).length === 0 ||
            !Object.entries(activeCarePlan.dailyLiving).some(
              ([, support]) => support?.required
            )) && (
            <div className="col-span-full text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Required Daily Living Support
              </h4>
              <p className="text-gray-600">
                No daily living support needs are currently marked as required.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
