import React, { useState } from "react";
import {
  Plus,
  Shield,
  Edit3,
  Eye,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { RiskAssessmentForm } from "./RiskAssessmentForm";

export function RiskAssessmentManager({
  clientId,
  assessments,
  onAddAssessment,
  onUpdateAssessment,
}) {
  const [view, setView] = useState("list");
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const assessmentTypes = [
    {
      id: "environmental",
      label: "Environmental Hazards",
      icon: AlertTriangle,
      color: "bg-blue-500",
    },
    {
      id: "moving-handling",
      label: "Moving & Handling",
      icon: User,
      color: "bg-green-500",
    },
    {
      id: "falls",
      label: "Falls Prevention",
      icon: AlertTriangle,
      color: "bg-yellow-500",
    },
    {
      id: "medication",
      label: "Medication Management",
      icon: Shield,
      color: "bg-purple-500",
    },
    {
      id: "skin-integrity",
      label: "Skin Integrity",
      icon: Shield,
      color: "bg-pink-500",
    },
    {
      id: "nutrition-hydration",
      label: "Nutrition & Hydration",
      icon: Shield,
      color: "bg-cyan-500",
    },
    {
      id: "mental-capacity",
      label: "Mental Capacity",
      icon: Shield,
      color: "bg-indigo-500",
    },
    {
      id: "infection-control",
      label: "Infection Control",
      icon: Shield,
      color: "bg-red-500",
    },
    {
      id: "fire-safety",
      label: "Fire Safety",
      icon: Shield,
      color: "bg-orange-500",
    },
    {
      id: "personal-safety",
      label: "Personal Safety",
      icon: Shield,
      color: "bg-gray-500",
    },
  ];

  // Mock data for demonstration
  const mockAssessments = [
    {
      id: "1",
      type: "environmental",
      assessmentDate: new Date().toISOString().split("T")[0],
      assessedBy: "Sarah Johnson",
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "current",
      overallRisk: "medium",
      risks: [
        {
          id: "1",
          hazard: "Loose carpet in hallway",
          whoAtRisk: ["Client", "Visitors", "Carers"],
          likelihood: "possible",
          severity: "moderate",
          riskLevel: "medium",
          existingControls: ["Warning signs placed"],
          residualRisk: "low",
        },
      ],
      controlMeasures: [
        {
          id: "1",
          riskId: "1",
          measure: "Secure carpet with carpet tape",
          type: "control",
          responsibility: "Maintenance Team",
          implementationDate: new Date().toISOString().split("T")[0],
          reviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          status: "implemented",
          effectiveness: "effective",
        },
      ],
      monitoringPlan: {
        frequency: "Monthly",
        methods: ["Visual inspection", "Incident monitoring"],
        indicators: ["Number of trips/falls", "Carpet condition"],
        responsibility: "Care Manager",
        reportingProcess: ["Monthly safety report", "Incident reports"],
      },
      version: 1,
    },
    {
      id: "2",
      type: "falls",
      assessmentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      assessedBy: "Emma Wilson",
      reviewDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "current",
      overallRisk: "high",
      risks: [
        {
          id: "2",
          hazard: "Client has history of falls and uses walking frame",
          whoAtRisk: ["Client"],
          likelihood: "likely",
          severity: "major",
          riskLevel: "high",
          existingControls: ["Walking frame provided", "Non-slip socks"],
          residualRisk: "medium",
        },
      ],
      controlMeasures: [
        {
          id: "2",
          riskId: "2",
          measure: "Install grab rails in bathroom and hallway",
          type: "control",
          responsibility: "Occupational Therapist",
          implementationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          reviewDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          status: "planned",
          effectiveness: "not-assessed",
        },
      ],
      monitoringPlan: {
        frequency: "Weekly",
        methods: ["Mobility assessment", "Fall incident monitoring"],
        indicators: ["Mobility level", "Fall frequency", "Confidence level"],
        responsibility: "Senior Carer",
        reportingProcess: [
          "Weekly mobility report",
          "Immediate incident reporting",
        ],
      },
      version: 1,
    },
  ];

  const allAssessments = [...assessments, ...mockAssessments];

  const getRiskLevelColor = (level) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "very-high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "current":
        return "bg-green-100 text-green-800";
      case "due":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAssessments = allAssessments.filter(
    (assessment) => filterType === "all" || assessment.type === filterType
  );

  const assessmentStats = {
    total: allAssessments.length,
    current: allAssessments.filter((a) => a.status === "current").length,
    due: allAssessments.filter((a) => a.status === "due").length,
    overdue: allAssessments.filter((a) => a.status === "overdue").length,
    highRisk: allAssessments.filter(
      (a) => a.overallRisk === "high" || a.overallRisk === "very-high"
    ).length,
  };

  if (view === "form") {
    return (
      <RiskAssessmentForm
        assessment={selectedAssessment}
        onBack={() => setView("list")}
        onSave={(assessment) => {
          if ("id" in assessment) {
            onUpdateAssessment(assessment.id, assessment);
          } else {
            onAddAssessment(assessment);
          }
          setView("list");
        }}
      />
    );
  }

  if (view === "details" && selectedAssessment) {
    return (
      <RiskAssessmentDetails
        assessment={selectedAssessment}
        onBack={() => setView("list")}
        onEdit={() => setView("form")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Risk Assessments</h2>
          <p className="text-gray-600 mt-1">
            Comprehensive risk management and safety planning
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedAssessment(null);
            setView("form");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {assessmentStats.total}
              </p>
              <p className="text-sm text-gray-600">Total Assessments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {assessmentStats.current}
              </p>
              <p className="text-sm text-gray-600">Current</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {assessmentStats.due}
              </p>
              <p className="text-sm text-gray-600">Due for Review</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {assessmentStats.overdue}
              </p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {assessmentStats.highRisk}
              </p>
              <p className="text-sm text-gray-600">High Risk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Filter by type:
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {assessmentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assessment List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Risk Assessments ({filteredAssessments.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAssessments.map((assessment) => {
            const typeInfo = assessmentTypes.find(
              (t) => t.id === assessment.type
            );
            const TypeIcon = typeInfo?.icon || Shield;

            return (
              <div
                key={assessment.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${
                        typeInfo?.color || "bg-gray-500"
                      } rounded-full flex items-center justify-center`}
                    >
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">
                          {typeInfo?.label || assessment.type}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            assessment.status
                          )}`}
                        >
                          {assessment.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                            assessment.overallRisk
                          )}`}
                        >
                          {assessment.overallRisk.replace("-", " ")} risk
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            Assessed:{" "}
                            {new Date(
                              assessment.assessmentDate
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>By: {assessment.assessedBy}</span>
                        </div>

                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            Review due:{" "}
                            {new Date(
                              assessment.reviewDate
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span>
                            {assessment.risks.length} risks identified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAssessment(assessment);
                        setView("details");
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAssessment(assessment);
                        setView("form");
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Assessment"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAssessments.length === 0 && (
            <div className="p-8 text-center">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No risk assessments found
              </h3>
              <p className="text-gray-600 mb-4">
                {filterType === "all"
                  ? "No risk assessments have been created yet."
                  : `No ${assessmentTypes
                      .find((t) => t.id === filterType)
                      ?.label.toLowerCase()} assessments found.`}
              </p>
              <button
                onClick={() => {
                  setSelectedAssessment(null);
                  setView("form");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Assessment</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Placeholder component for assessment details view
function RiskAssessmentDetails({ assessment, onBack, onEdit }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Risk Assessment Details
        </h3>
        <p className="text-gray-600 mb-4">
          Detailed risk assessment view coming soon
        </p>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Back to List
          </button>
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Edit Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
