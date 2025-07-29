import { useSelector, useDispatch } from "react-redux";
import { getStatusColor } from "./StatusColor";
import { History, X, Eye, Calendar, User, FileText } from "lucide-react";
import {
  fetchCarePlanById,
  clearSelectedCarePlan,
  restoreCarePlan,
} from "../../../../components/redux/slice/carePlans";
import { OverviewTab } from "../Overview/OverviewTab";
import { DailyLivingTab } from "../DailyLiving/DailyLiving";
import { PersonalCareTab } from "../PersonalCare/PersonalCare";
import { useState } from "react";
import toast from "react-hot-toast";

export function HistoryTab({ setShowHistory, client }) {
  const dispatch = useDispatch();
  const { history, selectedCarePlan, loading } = useSelector(
    (state) => state.carePlans
  );
  const [activeTab, setActiveTab] = useState("overview");

  const handleViewCarePlan = async (carePlanId) => {
    try {
      await dispatch(fetchCarePlanById(carePlanId)).unwrap();
    } catch (error) {
      console.error("Error fetching care plan:", error);
    }
  };

  const handleCloseView = () => {
    dispatch(clearSelectedCarePlan());
  };

  const handleRestoreCarePlan = async (carePlanId) => {
    try {
      await dispatch(
        restoreCarePlan({ carePlanId, clientId: client._id })
      ).unwrap();
      toast.success("Care plan restored successfully");
      setShowHistory(false);
    } catch (error) {
      console.error("Error restoring care plan:", error);
      toast.error("Failed to restore care plan");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
          {!selectedCarePlan ? (
            <div className="space-y-4">
              {history.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
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
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewCarePlan(plan._id)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleRestoreCarePlan(plan._id)}
                        disabled={plan.status === "active"}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Restore</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>
                        <span className="font-medium">Assessed By:</span>{" "}
                        {plan.assessedBy}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        <span className="font-medium">Assessment:</span>{" "}
                        {new Date(plan.assessmentDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>
                        <span className="font-medium">Review:</span>{" "}
                        {new Date(plan.reviewDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header with version info and close button */}
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-blue-900">
                      Version {selectedCarePlan.version}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedCarePlan.status
                      )}`}
                    >
                      {selectedCarePlan.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Created:{" "}
                    {new Date(selectedCarePlan.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={handleCloseView}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Back to History
                </button>
              </div>

              {/* Care Plan Details */}
              <div className="bg-white border border-gray-200 rounded-lg">
                {/* Navigation Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "personal-care", label: "Personal Care" },
                      { id: "daily-living", label: "Daily Living" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "overview" && (
                    <OverviewTab activeCarePlan={selectedCarePlan} />
                  )}
                  {activeTab === "personal-care" && (
                    <PersonalCareTab activeCarePlan={selectedCarePlan} />
                  )}
                  {activeTab === "daily-living" && (
                    <DailyLivingTab activeCarePlan={selectedCarePlan} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
