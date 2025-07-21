import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Trash,
} from "lucide-react";
import { RiskAssessmentForm } from "./RiskAssessmentForm";
import {
  fetchRiskAssessments,
  addRiskAssessment,
  editRiskAssessment,
  deleteRiskAssessment,
} from "../../components/redux/slice/riskAssessments";

export function RiskAssessmentManager({ clientId }) {
  const [view, setView] = useState("list");
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const dispatch = useDispatch();
  const { items: assessments } = useSelector((state) => state.riskAssessments);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchRiskAssessments(clientId));
    }
  }, [clientId, dispatch]);

  const handleAddAssessment = async (assessment) => {
    console.log("Inside Add Risk Assessment");
    await dispatch(addRiskAssessment({ ...assessment, clientId }));
  };

  const handleUpdateAssessment = async (id, assessment) => {
    console.log("Inside Edit Risk Assessment");
    await dispatch(editRiskAssessment({ id, assessment }));
  };

  const handleDeleteAssessment = async (id) => {
    console.log("Inside Delete Risk Assessment");
    await dispatch(deleteRiskAssessment(id));
  };

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

  const filteredAssessments = assessments.filter(
    (assessment) => filterType === "all" || assessment.type === filterType
  );

  const assessmentStats = {
    total: assessments.length,
    current: assessments.filter((a) => a.status === "current").length,
    due: assessments.filter((a) => a.status === "due").length,
    overdue: assessments.filter((a) => a.status === "overdue").length,
    highRisk: assessments.filter(
      (a) => a.overallRisk === "high" || a.overallRisk === "very-high"
    ).length,
  };

  if (view === "form") {
    return (
      <RiskAssessmentForm
        assessment={selectedAssessment}
        onBack={() => setView("list")}
        onSave={(assessment) => {
          if (assessment._id) {
            handleUpdateAssessment(assessment._id, assessment);
          } else {
            handleAddAssessment(assessment);
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
                key={assessment._id}
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

                    <button
                      onClick={() => handleDeleteAssessment(assessment._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Assessment"
                    >
                      <Trash className="w-4 h-4" />
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

function RiskAssessmentDetails({ assessment, onBack }) {
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
