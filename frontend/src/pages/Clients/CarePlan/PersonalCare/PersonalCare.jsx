import { User } from "lucide-react";

export function PersonalCareTab({ activeCarePlan }) {
  const personalCareSections = [
    { key: "washing", label: "Washing" },
    { key: "bathing", label: "Bathing" },
    { key: "oralCare", label: "Oral Care" },
    { key: "hairCare", label: "Hair Care" },
    { key: "nailCare", label: "Nail Care" },
    { key: "skinCare", label: "Skin Care" },
    { key: "continence", label: "Continence" },
    { key: "dressing", label: "Dressing" },
  ];

  const renderCareSection = (section) => {
    const care = activeCarePlan.personalCare?.[section.key];

    // Only show if required is true
    if (!care || typeof care !== "object" || !care.required) {
      return null;
    }

    return (
      <div key={section.key} className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">{section.label}</h4>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              care.required
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {care.required ? "Required" : "Not Required"}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {care.frequency && (
            <p>
              <strong>Frequency:</strong> {care.frequency}
            </p>
          )}
          {care.assistanceLevel && (
            <p>
              <strong>Assistance Level:</strong> {care.assistanceLevel}
            </p>
          )}
          {care.equipment && care.equipment.length > 0 && (
            <p>
              <strong>Equipment:</strong> {care.equipment.join(", ")}
            </p>
          )}
          {care.techniques && care.techniques.length > 0 && (
            <p>
              <strong>Techniques:</strong> {care.techniques.join(", ")}
            </p>
          )}
          {care.preferences && care.preferences.length > 0 && (
            <p>
              <strong>Preferences:</strong> {care.preferences.join(", ")}
            </p>
          )}
          {care.risks && care.risks.length > 0 && (
            <p>
              <strong>Risks:</strong> {care.risks.join(", ")}
            </p>
          )}
          {care.notes && (
            <p>
              <strong>Notes:</strong> {care.notes}
            </p>
          )}
        </div>

        {/* Special handling for continence */}
        {section.key === "continence" && care.assessment && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h5 className="font-medium text-gray-800 mb-2">Assessment</h5>
            <div className="space-y-1 text-sm text-gray-600">
              {care.assessment.bladderControl && (
                <p>
                  <strong>Bladder Control:</strong>{" "}
                  {care.assessment.bladderControl}
                </p>
              )}
              {care.assessment.bowelControl && (
                <p>
                  <strong>Bowel Control:</strong> {care.assessment.bowelControl}
                </p>
              )}
              {care.assessment.causes && care.assessment.causes.length > 0 && (
                <p>
                  <strong>Causes:</strong> {care.assessment.causes.join(", ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Special handling for continence management */}
        {section.key === "continence" && care.management && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h5 className="font-medium text-gray-800 mb-2">Management</h5>
            <div className="space-y-1 text-sm text-gray-600">
              {care.management.strategy &&
                care.management.strategy.length > 0 && (
                  <p>
                    <strong>Strategy:</strong>{" "}
                    {care.management.strategy.join(", ")}
                  </p>
                )}
              {care.management.schedule &&
                care.management.schedule.length > 0 && (
                  <p>
                    <strong>Schedule:</strong>{" "}
                    {care.management.schedule.join(", ")}
                  </p>
                )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>Personal Care Needs Assessment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {personalCareSections.map(renderCareSection).filter(Boolean)}

          {(!activeCarePlan.personalCare ||
            Object.keys(activeCarePlan.personalCare).length === 0 ||
            !personalCareSections.some(
              (section) =>
                activeCarePlan.personalCare[section.key] &&
                typeof activeCarePlan.personalCare[section.key] === "object"
            )) && (
            <div className="col-span-full text-center py-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Personal Care Information
              </h4>
              <p className="text-gray-600">
                No personal care information has been recorded for this care
                plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
