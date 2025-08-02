import React from "react";
import { ArrowLeft, AlertTriangle, Shield } from "lucide-react";

export function RiskAssessmentDetails({ assessment, onBack }) {
  const getLikelihoodDisplay = (likelihood) => {
    const likelihoodMap = {
      "very-unlikely": "Very Unlikely",
      unlikely: "Unlikely",
      possible: "Possible",
      likely: "Likely",
      "very-likely": "Very Likely",
    };
    return likelihoodMap[likelihood] || likelihood;
  };

  const getSeverityDisplay = (severity) => {
    const severityMap = {
      negligible: "Negligible",
      minor: "Minor",
      moderate: "Moderate",
      major: "Major",
      catastrophic: "Catastrophic",
    };
    return severityMap[severity] || severity;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Risk Assessment Details
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive risk assessment information
          </p>
        </div>
      </div>

      {/* Assessment Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            Assessment Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <strong>Type:</strong>{" "}
            <span className="capitalize">
              {assessment.type.replace(/-/g, " ")}
            </span>
          </div>
          <div>
            <strong>Assessment Date:</strong>{" "}
            {new Date(assessment.assessmentDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Assessed By:</strong> {assessment.assessedBy}
          </div>
          <div>
            <strong>Review Date:</strong>{" "}
            {new Date(assessment.reviewDate).toLocaleDateString()}
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
          <div className="text-sm text-gray-600">
            <strong>Version:</strong> {assessment.version}
          </div>
        </div>
      </div>
      {/* Risks */}
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
                  Description: {risk.hazard}
                </div>
                <div className="text-sm text-gray-700">
                  <div>
                    <strong>Who at Risk:</strong> {risk.whoAtRisk?.join(", ")}
                  </div>
                  <div>
                    <strong>Likelihood:</strong>{" "}
                    {getLikelihoodDisplay(risk.likelihood)}
                  </div>
                  <div>
                    <strong>Severity:</strong>{" "}
                    {getSeverityDisplay(risk.severity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No risks recorded.</div>
        )}
      </div>
    </div>
  );
}
