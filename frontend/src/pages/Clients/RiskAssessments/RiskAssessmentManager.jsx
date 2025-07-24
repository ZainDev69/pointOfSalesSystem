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
import { RiskAssessmentDetails } from "./RiskAssessmentDetails";
import { RiskAssessmentForm } from "./RiskAssessmentForm";
import {
  fetchRiskAssessments,
  addRiskAssessment,
  editRiskAssessment,
  deleteRiskAssessment,
} from "../../../components/redux/slice/riskAssessments";
import toast from "react-hot-toast";

export function RiskAssessmentManager({ clientId }) {
  const [view, setView] = useState("list");
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);
  const dispatch = useDispatch();
  const { items: assessments } = useSelector((state) => state.riskAssessments);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchRiskAssessments(clientId));
    }
  }, [clientId, dispatch]);

  const handleAddAssessment = async (assessment) => {
    try {
      await dispatch(addRiskAssessment({ ...assessment, clientId })).unwrap();
      toast.success("Risk assessment added successfully");
    } catch {
      toast.error("Failed to add risk assessment");
    }
  };

  const handleUpdateAssessment = async (id, assessment) => {
    try {
      await dispatch(editRiskAssessment({ id, assessment })).unwrap();
      toast.success("Risk assessment updated successfully");
    } catch {
      toast.error("Failed to update risk assessment");
    }
  };

  const handleDeleteAssessment = async (id) => {
    setAssessmentToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteAssessment = async () => {
    try {
      await dispatch(deleteRiskAssessment(assessmentToDelete)).unwrap();
      toast.success("Risk assessment deleted");
    } catch {
      toast.error("Failed to delete risk assessment");
    } finally {
      setShowDeleteModal(false);
      setAssessmentToDelete(null);
    }
  };

  const cancelDeleteAssessment = () => {
    setShowDeleteModal(false);
    setAssessmentToDelete(null);
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
      <div className="flex items-center justify-between mb-6">
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
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2 text-base font-semibold transition-all duration-200"
          style={{ minWidth: 180 }}
        >
          <Plus className="w-5 h-5" />
          <span>New Assessment</span>
        </button>
      </div>
      <div className="mb-6" />

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Risk Assessment?
            </h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this risk assessment? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDeleteAssessment}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAssessment}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
