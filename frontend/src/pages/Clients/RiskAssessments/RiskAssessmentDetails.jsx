import { Shield, Calendar, AlertTriangle } from "lucide-react";
export function RiskAssessmentDetails({ assessment, onBack }) {
  if (!assessment) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-7 h-7 text-blue-500 mr-2" />
          Risk Assessment Details
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Back to List
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="mb-2 text-lg font-semibold text-blue-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" /> Assessment Info
          </div>
          <div className="space-y-1 text-blue-900">
            <div>
              <strong>Type:</strong> {assessment.type}
            </div>
            <div>
              <strong>Assessment Date:</strong> {assessment.assessmentDate}
            </div>
            <div>
              <strong>Assessed By:</strong> {assessment.assessedBy}
            </div>
            <div>
              <strong>Review Date:</strong> {assessment.reviewDate}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  assessment.status === "current"
                    ? "bg-green-100 text-green-800"
                    : assessment.status === "due"
                    ? "bg-yellow-100 text-yellow-800"
                    : assessment.status === "overdue"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {assessment.status.charAt(0).toUpperCase() +
                  assessment.status.slice(1).toLowerCase()}
              </span>
            </div>
            <div>
              <strong>Overall Risk:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  assessment.overallRisk === "high" ||
                  assessment.overallRisk === "very-high"
                    ? "bg-red-100 text-red-800"
                    : assessment.overallRisk === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {assessment.overallRisk.charAt(0).toUpperCase() +
                  assessment.overallRisk
                    .slice(1)
                    .toLowerCase()
                    .replace("-", " ")}
              </span>
            </div>
            <div>
              <strong>Version:</strong> {assessment.version}
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="mb-2 text-lg font-semibold text-purple-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" /> Monitoring Plan
          </div>
          {assessment.monitoringPlan ? (
            <ul className="space-y-1 text-purple-900">
              <li>
                <strong>Frequency:</strong>{" "}
                {assessment.monitoringPlan.frequency}
              </li>
              <li>
                <strong>Methods:</strong>{" "}
                {assessment.monitoringPlan.methods?.join(", ")}
              </li>
              <li>
                <strong>Indicators:</strong>{" "}
                {assessment.monitoringPlan.indicators?.join(", ")}
              </li>
              <li>
                <strong>Responsibility:</strong>{" "}
                {assessment.monitoringPlan.responsibility}
              </li>
              <li>
                <strong>Reporting Process:</strong>{" "}
                {assessment.monitoringPlan.reportingProcess?.join(", ")}
              </li>
            </ul>
          ) : (
            <div className="text-gray-500">No monitoring plan recorded.</div>
          )}
        </div>
      </div>
      <div className="mb-8">
        <div className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" /> Risks
        </div>
        {assessment.risks && assessment.risks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.risks.map((risk, idx) => (
              <div
                key={risk.id || idx}
                className="bg-white border border-red-100 rounded-lg p-4 shadow-sm"
              >
                <div className="font-semibold text-red-800 mb-1">
                  Hazard: {risk.hazard}
                </div>
                <div className="text-sm text-gray-700">
                  <div>
                    <strong>Who at Risk:</strong> {risk.whoAtRisk?.join(", ")}
                  </div>
                  <div>
                    <strong>Likelihood:</strong> {risk.likelihood}
                  </div>
                  <div>
                    <strong>Severity:</strong> {risk.severity}
                  </div>
                  <div>
                    <strong>Risk Level:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        risk.riskLevel === "high" ||
                        risk.riskLevel === "very-high"
                          ? "bg-red-100 text-red-800"
                          : risk.riskLevel === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {risk.riskLevel.charAt(0).toUpperCase() +
                        risk.riskLevel.slice(1).toLowerCase().replace("-", " ")}
                    </span>
                  </div>
                  <div>
                    <strong>Existing Controls:</strong>{" "}
                    {risk.existingControls?.join(", ")}
                  </div>
                  <div>
                    <strong>Residual Risk:</strong> {risk.residualRisk}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No risks recorded.</div>
        )}
      </div>
      <div>
        <div className="text-lg font-semibold text-indigo-700 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" /> Control Measures
        </div>
        {assessment.controlMeasures && assessment.controlMeasures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessment.controlMeasures.map((cm, idx) => (
              <div
                key={cm.id || idx}
                className="bg-white border border-indigo-100 rounded-lg p-4 shadow-sm"
              >
                <div className="font-semibold text-indigo-800 mb-1">
                  Measure: {cm.measure}
                </div>
                <div className="text-sm text-gray-700">
                  <div>
                    <strong>Type:</strong> {cm.type}
                  </div>
                  <div>
                    <strong>Responsibility:</strong> {cm.responsibility}
                  </div>
                  <div>
                    <strong>Implementation Date:</strong>{" "}
                    {cm.implementationDate}
                  </div>
                  <div>
                    <strong>Review Date:</strong> {cm.reviewDate}
                  </div>
                  <div>
                    <strong>Status:</strong> {cm.status}
                  </div>
                  <div>
                    <strong>Effectiveness:</strong> {cm.effectiveness}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No control measures recorded.</div>
        )}
      </div>
    </div>
  );
}
