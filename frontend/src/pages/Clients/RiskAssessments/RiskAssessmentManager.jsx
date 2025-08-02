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
  Bell,
  Download,
} from "lucide-react";
import { RiskAssessmentDetails } from "./RiskAssessmentDetails";
import { RiskAssessmentForm } from "./RiskAssessmentForm";
import {
  fetchRiskAssessments,
  addRiskAssessment,
  editRiskAssessment,
  deleteRiskAssessment,
} from "../../../components/redux/slice/riskAssessments";
import { downloadRiskAssessmentPDF } from "../../../utils/pdfGenerator";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/Button";

export function RiskAssessmentManager({ clientId, clientName = "Client" }) {
  const [view, setView] = useState("list");
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const { items: assessments, loading } = useSelector(
    (state) => state.riskAssessments
  );

  const { riskAssessmentOptions } = useSelector(
    (state) => state.riskAssessments
  );

  const likelihoodOptions = riskAssessmentOptions.likelihood || [];
  const severityOptions = riskAssessmentOptions.severity || [];
  const assessmentTypes = riskAssessmentOptions.type || [];

  useEffect(() => {
    if (clientId) {
      dispatch(fetchRiskAssessments(clientId));
    }
  }, [clientId, dispatch]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notification-dropdown")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

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

  // Function to handle PDF download
  const handleDownloadPDF = async (assessment = null) => {
    try {
      if (assessment) {
        // Download single assessment
        await downloadRiskAssessmentPDF([assessment], clientName);
        toast.success("PDF downloaded successfully");
      } else {
        // Download all assessments
        await downloadRiskAssessmentPDF(assessments, clientName);
        toast.success("All risk assessments PDF downloaded successfully");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  //   {
  //     id: "environmental",
  //     label: "Environmental Hazards",
  //     icon: AlertTriangle,
  //     color: "bg-blue-500",
  //   },
  //   {
  //     id: "moving-handling",
  //     label: "Moving & Handling",
  //     icon: User,
  //     color: "bg-green-500",
  //   },
  //   {
  //     id: "falls",
  //     label: "Falls Prevention",
  //     icon: AlertTriangle,
  //     color: "bg-yellow-500",
  //   },
  //   {
  //     id: "medication",
  //     label: "Medication Management",
  //     icon: Shield,
  //     color: "bg-purple-500",
  //   },
  //   {
  //     id: "skin-integrity",
  //     label: "Skin Integrity",
  //     icon: Shield,
  //     color: "bg-pink-500",
  //   },
  //   {
  //     id: "nutrition-hydration",
  //     label: "Nutrition & Hydration",
  //     icon: Shield,
  //     color: "bg-cyan-500",
  //   },
  //   {
  //     id: "mental-capacity",
  //     label: "Mental Capacity",
  //     icon: Shield,
  //     color: "bg-indigo-500",
  //   },
  //   {
  //     id: "infection-control",
  //     label: "Infection Control",
  //     icon: Shield,
  //     color: "bg-red-500",
  //   },
  //   {
  //     id: "fire-safety",
  //     label: "Fire Safety",
  //     icon: Shield,
  //     color: "bg-orange-500",
  //   },
  //   {
  //     id: "personal-safety",
  //     label: "Personal Safety",
  //     icon: Shield,
  //     color: "bg-gray-500",
  //   },
  // ];

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

  // Function to calculate risk score
  const calculateRiskScore = (likelihood, severity) => {
    const likelihoodScores = {
      "very-unlikely": 1,
      unlikely: 2,
      possible: 3,
      likely: 4,
      "very-likely": 5,
    };

    const severityScores = {
      negligible: 1,
      minor: 2,
      moderate: 3,
      major: 4,
      catastrophic: 5,
    };

    const likelihoodScore = likelihoodScores[likelihood] || 1;
    const severityScore = severityScores[severity] || 1;

    return likelihoodScore * severityScore;
  };

  // Function to calculate overall risk score for an assessment
  const calculateOverallRiskScore = (assessment) => {
    if (!assessment.risks || assessment.risks.length === 0) {
      return 0;
    }

    const totalScore = assessment.risks.reduce((sum, risk) => {
      return sum + calculateRiskScore(risk.likelihood, risk.severity);
    }, 0);

    return totalScore / assessment.risks.length; // Average risk score
  };

  // Get risk score color based on score value
  const getRiskScoreColor = (score) => {
    if (score >= 16) return "bg-red-800 text-white"; // Dark red for high risk
    if (score >= 12) return "bg-red-600 text-white"; // Red for high risk
    if (score >= 8) return "bg-orange-500 text-white"; // Orange for medium risk
    if (score >= 4) return "bg-yellow-500 text-white"; // Yellow for low risk
    return "bg-green-500 text-white"; // Green for very low risk
  };

  // Sort assessments by risk score in descending order
  const sortedAssessments = [...assessments].sort((a, b) => {
    const scoreA = calculateOverallRiskScore(a);
    const scoreB = calculateOverallRiskScore(b);
    return scoreB - scoreA; // Descending order (highest first)
  });

  const filteredAssessments = sortedAssessments.filter(
    (assessment) => filterType === "all" || assessment.type === filterType
  );

  // Calculate notifications for assessments due within 1 month
  const getDueNotifications = () => {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    return assessments.filter((assessment) => {
      if (!assessment.reviewDate) return false;
      const reviewDate = new Date(assessment.reviewDate);
      return reviewDate >= today && reviewDate <= oneMonthFromNow;
    });
  };

  const dueNotifications = getDueNotifications();

  const assessmentStats = {
    total: assessments.length,
    current: assessments.filter((a) => a.status === "current").length,
    due: assessments.filter((a) => a.status === "due").length,
    overdue: assessments.filter((a) => a.status === "overdue").length,
    highRisk: assessments.filter((a) => calculateOverallRiskScore(a) >= 12)
      .length,
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
        <div className="flex items-center space-x-3">
          {/* Download All Assessments Button */}
          <button
            onClick={() => handleDownloadPDF()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            title="Download All Risk Assessments as PDF"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg transition-colors ${
                dueNotifications.length > 0
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
              title={
                dueNotifications.length > 0
                  ? `${dueNotifications.length} assessment(s) due soon`
                  : "No notifications"
              }
            >
              <Bell className="w-5 h-5" />
              {dueNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {dueNotifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && dueNotifications.length > 0 && (
              <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Assessments Due Soon
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {dueNotifications.map((assessment) => {
                      const typeInfo = assessmentTypes.find(
                        (t) => t.id === assessment.type
                      );
                      const reviewDate = new Date(assessment.reviewDate);
                      const daysUntilDue = Math.ceil(
                        (reviewDate - new Date()) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <div
                          key={assessment._id}
                          className="p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="text-sm font-medium text-red-900">
                                {typeInfo?.label || assessment.type}
                              </h5>
                              <p className="text-xs text-red-700 mt-1">
                                Due: {reviewDate.toLocaleDateString()}
                                {daysUntilDue === 0 && " (Today)"}
                                {daysUntilDue === 1 && " (Tomorrow)"}
                                {daysUntilDue > 1 &&
                                  ` (in ${daysUntilDue} days)`}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedAssessment(assessment);
                                setView("form");
                              }}
                              className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => {
              setSelectedAssessment(null);
              setView("form");
            }}
            variant="default"
            icon={Plus}
            style={{ minWidth: 180 }}
          >
            New Assessment
          </Button>
        </div>
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-900">
                {assessmentStats.total}
              </p>
              <p className="text-sm text-blue-700 font-medium">Total</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-900">
                {assessmentStats.current}
              </p>
              <p className="text-sm text-green-700 font-medium">Current</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-900">
                {assessmentStats.due}
              </p>
              <p className="text-sm text-yellow-700 font-medium">Due</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-900">
                {assessmentStats.overdue}
              </p>
              <p className="text-sm text-red-700 font-medium">Overdue</p>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-900">
                {assessmentStats.highRisk}
              </p>
              <p className="text-sm text-orange-700 font-medium">High Risk</p>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

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
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center py-12">
            {/* Animated Shield Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full animate-ping opacity-20"></div>
            </div>

            {/* Loading Text */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2 animate-pulse">
              Loading Risk Assessments
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Analyzing safety protocols and risk factors...
            </p>

            {/* Animated Loading Bars */}
            <div className="w-64 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">Environmental</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full animate-pulse"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">Moving & Handling</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full animate-pulse"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">Falls Prevention</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full animate-pulse"
                    style={{ width: "90%" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">Medication</span>
              </div>
            </div>

            {/* Spinning Loader */}
            <div className="mt-6">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      ) : (
        /* Assessment List */
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
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskScoreColor(
                              calculateOverallRiskScore(assessment)
                            )}`}
                          >
                            {Math.round(calculateOverallRiskScore(assessment))}{" "}
                            risk score
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

                        {/* Risk Metrics Display */}
                        {assessment.risks && assessment.risks.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-medium text-gray-700 mb-2">
                              Risk Metrics:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {[...assessment.risks]
                                .sort((a, b) => {
                                  const scoreA = calculateRiskScore(
                                    a.likelihood,
                                    a.severity
                                  );
                                  const scoreB = calculateRiskScore(
                                    b.likelihood,
                                    b.severity
                                  );
                                  return scoreB - scoreA; // Sort by high risk score first
                                })
                                .map((risk, idx) => {
                                  const riskScore = calculateRiskScore(
                                    risk.likelihood,
                                    risk.severity
                                  );
                                  const getLikelihoodDisplay = (likelihood) => {
                                    const option = likelihoodOptions.find(
                                      (opt) => opt.value === likelihood
                                    );
                                    return option
                                      ? `${option.label} (${option.score})`
                                      : likelihood;
                                  };
                                  const getSeverityDisplay = (severity) => {
                                    const option = severityOptions.find(
                                      (opt) => opt.value === severity
                                    );
                                    return option
                                      ? `${option.label} (${option.score})`
                                      : severity;
                                  };

                                  return (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="text-xs font-medium text-gray-600">
                                        Risk {idx + 1}:
                                      </span>
                                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                        {getLikelihoodDisplay(risk.likelihood)}
                                      </span>
                                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                        {getSeverityDisplay(risk.severity)}
                                      </span>
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                                        Risk Score: {riskScore}
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
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

                      <button
                        onClick={() => handleDownloadPDF(assessment)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
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
      )}
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
