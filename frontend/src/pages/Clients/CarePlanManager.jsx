import React, { useState, useEffect } from "react";
import {
  Plus,
  Shield,
  Edit3,
  Eye,
  Calendar,
  User,
  Clock,
  Target,
  FileText,
  History,
  Trash,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { CarePlanForm } from "./CarePlanForm";
import { OutcomeForm } from "./OutcomeForm";
import { OutcomeDetails } from "./OutcomeDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActiveCarePlan,
  fetchCarePlanHistory,
  createCarePlan,
  updateCarePlan,
  deleteCarePlan,
} from "../../components/redux/slice/carePlans";
import {
  fetchCarePlanOutcomes,
  createOutcome,
  updateOutcome,
  deleteOutcome,
  addOutcomeProgress,
} from "../../components/redux/slice/outcomes";
import toast from "react-hot-toast";

export function CarePlanManager({ clientId }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [view, setView] = useState("view");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [outcomeView, setOutcomeView] = useState("list");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOutcomeDetails, setShowOutcomeDetails] = useState(false);

  const dispatch = useDispatch();

  const { activeCarePlan, history } = useSelector((state) => state.carePlans);
  const { items: outcomes } = useSelector((state) => state.outcomes);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchActiveCarePlan(clientId));
      dispatch(fetchCarePlanHistory(clientId));
    }
  }, [clientId, dispatch]);

  useEffect(() => {
    if (activeCarePlan?._id) {
      dispatch(fetchCarePlanOutcomes(activeCarePlan._id));
    }
  }, [activeCarePlan, dispatch]);

  const handleCreateCarePlan = async (carePlanData) => {
    try {
      await dispatch(createCarePlan({ clientId, carePlanData })).unwrap();
      toast.success("Care plan created successfully");
      setView("view");
      // Refresh the active care plan to ensure it's loaded
      dispatch(fetchActiveCarePlan(clientId));
    } catch {
      toast.error("Failed to create care plan");
    }
  };

  const handleUpdateCarePlan = async (carePlanData) => {
    try {
      console.log("carePlanData", carePlanData);
      // Ensure clientId is included in the care plan data
      const updatedCarePlanData = {
        ...carePlanData,
        clientId: clientId,
      };

      await dispatch(
        updateCarePlan({
          carePlanId: activeCarePlan._id,
          carePlanData: updatedCarePlanData,
        })
      ).unwrap();
      toast.success("Care plan updated successfully");
      setView("view");
      // Refresh the active care plan and outcomes to get the new version with copied outcomes
      dispatch(fetchActiveCarePlan(clientId));
    } catch (error) {
      console.error("Error updating care plan:", error);
      toast.error("Failed to update care plan");
    }
  };

  const handleDeleteCarePlan = async () => {
    try {
      await dispatch(deleteCarePlan(activeCarePlan._id)).unwrap();
      toast.success("Care plan deleted successfully");
      setShowDeleteModal(false);
    } catch {
      toast.error("Failed to delete care plan");
    }
  };

  const handleCreateOutcome = async (outcomeData) => {
    try {
      await dispatch(
        createOutcome({ carePlanId: activeCarePlan._id, outcomeData })
      ).unwrap();
      toast.success("Outcome created successfully");
      setOutcomeView("list");
    } catch {
      toast.error("Failed to create outcome");
    }
  };

  const handleUpdateOutcome = async (outcomeData) => {
    try {
      if (!selectedOutcome?._id) return;
      await dispatch(
        updateOutcome({ outcomeId: selectedOutcome._id, outcomeData })
      ).unwrap();
      toast.success("Outcome updated successfully");
      setOutcomeView("list");
      setSelectedOutcome(null);
    } catch {
      toast.error("Failed to update outcome");
    }
  };

  const handleDeleteOutcome = async (outcomeId) => {
    try {
      await dispatch(deleteOutcome(outcomeId)).unwrap();
      toast.success("Outcome deleted successfully");
    } catch {
      toast.error("Failed to delete outcome");
    }
  };

  const handleAddOutcomeProgress = async (progressData) => {
    try {
      if (!selectedOutcome?._id) return;
      await dispatch(
        addOutcomeProgress({
          outcomeId: selectedOutcome._id,
          progressData,
        })
      ).unwrap();
      toast.success("Progress added successfully");
    } catch {
      toast.error("Failed to add progress");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "personal-care", label: "Personal Care", icon: User },
    { id: "daily-living", label: "Daily Living", icon: FileText },
    { id: "outcomes", label: "Outcomes", icon: Target },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOutcomeStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "achieved":
        return "bg-green-100 text-green-800";
      case "not-achieved":
        return "bg-red-100 text-red-800";
      case "modified":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (view === "edit") {
    return (
      <CarePlanForm
        carePlan={activeCarePlan}
        onBack={() => setView("view")}
        onSave={activeCarePlan ? handleUpdateCarePlan : handleCreateCarePlan}
      />
    );
  }

  if (outcomeView === "form") {
    return (
      <OutcomeForm
        outcome={selectedOutcome}
        onBack={() => {
          setOutcomeView("list");
          setSelectedOutcome(null);
        }}
        onSave={selectedOutcome ? handleUpdateOutcome : handleCreateOutcome}
      />
    );
  }

  if (!activeCarePlan) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Care Plan
          </h3>
          <p className="text-gray-600 mb-4">
            No care plan has been created for this client yet.
          </p>
          <button
            onClick={() => setView("edit")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Care Plan</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Care Plan</h2>
          <p className="text-gray-600 mt-1">
            Comprehensive care planning and outcome tracking
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              activeCarePlan.status
            )}`}
          >
            {activeCarePlan.status?.toUpperCase()}
          </span>
          <button
            onClick={() => setShowHistory(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-full flex items-center space-x-3 shadow-md transition-all duration-200 transform hover:scale-105 border border-blue-200"
            style={{ fontWeight: 600, letterSpacing: "0.03em" }}
          >
            <History className="w-5 h-5 mr-1 text-white drop-shadow" />
            <span className="tracking-wide text-base">History</span>
          </button>
          <button
            onClick={() => setView("edit")}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-3 shadow-md transition-all duration-200 transform hover:scale-105 border border-green-200"
            style={{ fontWeight: 600, letterSpacing: "0.03em" }}
          >
            <Edit3 className="w-5 h-5 mr-1 text-white drop-shadow" />
            <span className="tracking-wide text-base">Edit Plan</span>
          </button>
        </div>
      </div>

      {/* Care Plan Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {/* Version Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
          <div>
            <p className="text-lg font-bold text-blue-900 mb-0.5">
              v{activeCarePlan.version}
            </p>
            <p className="text-xs text-blue-700 font-medium">Version</p>
          </div>
          <FileText className="w-5 h-5 text-blue-500" />
        </div>
        {/* Assessed By Card */}
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
          <div>
            <p className="text-lg font-bold text-cyan-900 mb-0.5">
              {activeCarePlan.assessedBy || "-"}
            </p>
            <p className="text-xs text-cyan-700 font-medium">Assessed By</p>
          </div>
          <User className="w-5 h-5 text-cyan-500" />
        </div>
        {/* Assessment Date Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
          <div>
            <p className="text-lg font-bold text-green-900 mb-0.5">
              {new Date(activeCarePlan.assessmentDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-green-700 font-medium">
              Assessment Date
            </p>
          </div>
          <Calendar className="w-5 h-5 text-green-500" />
        </div>
        {/* Review Due Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
          <div>
            <p className="text-lg font-bold text-purple-900 mb-0.5">
              {new Date(activeCarePlan.reviewDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-purple-700 font-medium">Review Due</p>
          </div>
          <Clock className="w-5 h-5 text-purple-500" />
        </div>
        {/* Outcomes Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 px-3 py-2 hover:shadow-md transition-all duration-200 flex items-center justify-between min-h-[60px]">
          <div>
            <p className="text-lg font-bold text-amber-900 mb-0.5">
              {outcomes.length}
            </p>
            <p className="text-xs text-amber-700 font-medium">Outcomes</p>
          </div>
          <Target className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
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
      )}

      {activeTab === "outcomes" && (
        <div className="space-y-6">
          {/* Outcomes Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-900">
                  {outcomes.length}
                </p>
                <p className="text-sm text-blue-700 font-medium">
                  Total Outcomes
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-900">
                  {outcomes.filter((o) => o.status === "achieved").length}
                </p>
                <p className="text-sm text-green-700 font-medium">Achieved</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-900">
                  {outcomes.filter((o) => o.status === "not-achieved").length}
                </p>
                <p className="text-sm text-red-700 font-medium">Not Achieved</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {outcomes.filter((o) => o.status === "draft").length}
                </p>
                <p className="text-sm text-gray-700 font-medium">Draft</p>
              </div>
            </div>
          </div>

          {/* Outcomes List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Care Outcomes
                </h3>
                <button
                  onClick={() => {
                    setSelectedOutcome(null);
                    setOutcomeView("form");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Outcome</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {outcomes.map((outcome) => (
                <div
                  key={outcome._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {outcome.goal}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeStatusColor(
                            outcome.status
                          )}`}
                        >
                          {outcome.status.replace("-", " ")}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${getPriorityColor(
                            outcome.priority
                          )}`}
                        >
                          {outcome.priority} Priority
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {outcome.measurable}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Timeframe: {outcome.timeframe}</span>
                        <span>
                          Category: {outcome.category.replace("-", " ")}
                        </span>
                        <span>
                          Progress entries: {outcome.progress?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOutcome(outcome);
                          setShowOutcomeDetails(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOutcome(outcome);
                          setOutcomeView("form");
                        }}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit Outcome"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOutcome(outcome._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Outcome"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {outcomes.length === 0 && (
                <div className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No outcomes defined
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add measurable outcomes to track care plan effectiveness.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedOutcome(null);
                      setOutcomeView("form");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Outcome</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Personal Care Tab */}
      {activeTab === "personal-care" && (
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
      )}

      {/* Daily Living Tab */}
      {activeTab === "daily-living" && (
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
                    No daily living support needs are currently marked as
                    required.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Other tab content placeholders */}
      {activeTab !== "overview" &&
        activeTab !== "outcomes" &&
        activeTab !== "personal-care" &&
        activeTab !== "daily-living" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tabs.find((tab) => tab.id === activeTab)?.label} Section
              </h3>
              <p className="text-gray-600">
                This section shows detailed{" "}
                {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}{" "}
                information from the care plan.
              </p>
            </div>
          </div>
        )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <History className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Care Plan History
                  </h2>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {history.map((plan) => (
                  <div key={plan._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold text-gray-900">
                          Version {plan.version}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            plan.status
                          )}`}
                        >
                          {plan.status}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          Creation Date:{" "}
                          {new Date(plan.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Assessed By:</span>{" "}
                        {plan.assessedBy}
                      </div>
                      <div>
                        <span className="font-medium">Assessment Date:</span>{" "}
                        {new Date(plan.assessmentDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Review Date:</span>{" "}
                        {new Date(plan.reviewDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Care Plan?
            </h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this care plan? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCarePlan}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Outcome Details Modal */}
      {showOutcomeDetails && selectedOutcome && (
        <OutcomeDetails
          outcome={selectedOutcome}
          onClose={() => {
            setShowOutcomeDetails(false);
            setSelectedOutcome(null);
          }}
          onAddProgress={handleAddOutcomeProgress}
        />
      )}
    </div>
  );
}
