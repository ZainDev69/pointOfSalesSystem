import React, { useState, useEffect } from "react";
import { Plus, Shield, Edit3, History, Bell } from "lucide-react";
import { CarePlanForm } from "./CarePlanForm";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchActiveCarePlan,
  fetchCarePlanHistory,
  createCarePlan,
  updateCarePlan,
  deleteCarePlan,
} from "../../../components/redux/slice/carePlans";
import { fetchClientOutcomes } from "../../../components/redux/slice/outcomes";
import toast from "react-hot-toast";
import { CarePlanDocumentManager } from "./CarePlanDocumentation/CarePlanDocumentManager";
import { DailyLivingTab } from "./DailyLiving/DailyLiving";
import { OutcomesTab } from "./Outcomes/OutcomesTab";
import { OverviewTab } from "./Overview/OverviewTab";
import { HistoryTab } from "./CareComponents/HistoryTab";
import { CareNavTab } from "./CareComponents/CareNavTab";
import { getStatusColor } from "./CareComponents/StatusColor";
import { CardsTab } from "./Cards/Cards";
import { PersonalTab } from "../Personal/PersonalTab";
import { Button } from "../../../components/ui/Button";
import { PersonalCareTab } from "./PersonalCare/PersonalCare";
import { VisitTypeManager } from "./VisitTypes/VisitTypeManager";

export function CarePlanManager({ client }) {
  const [view, setView] = useState("view");
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dispatch = useDispatch();
  const { items: outcomes } = useSelector((state) => state.outcomes);

  const { activeCarePlan, loading } = useSelector((state) => state.carePlans);

  useEffect(() => {
    if (client._id) {
      dispatch(fetchActiveCarePlan(client._id));
      dispatch(fetchCarePlanHistory(client._id));
    }
  }, [client._id, dispatch]);

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

  // Calculate notifications for care plans due within 1 month
  const getDueNotifications = () => {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const notifications = [];

    // Check active care plan
    if (activeCarePlan?.reviewDate) {
      const reviewDate = new Date(activeCarePlan.reviewDate);
      if (reviewDate >= today && reviewDate <= oneMonthFromNow) {
        notifications.push({
          id: activeCarePlan._id,
          type: "Active Care Plan",
          reviewDate: activeCarePlan.reviewDate,
          status: activeCarePlan.status,
        });
      }
    }

    return notifications;
  };

  const dueNotifications = getDueNotifications();

  useEffect(() => {
    if (activeCarePlan?._id) {
      dispatch(fetchClientOutcomes(client._id));
    }
  }, [activeCarePlan, dispatch]);

  const handleCreateCarePlan = async (carePlanData) => {
    try {
      await dispatch(
        createCarePlan({ clientId: client._id, carePlanData })
      ).unwrap();
      toast.success("Care plan created successfully");
      setView("view");
      // Refresh the active care plan to ensure it's loaded
      dispatch(fetchActiveCarePlan(client._id));
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
        clientId: client._id,
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
      dispatch(fetchActiveCarePlan(client._id));
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

  if (view === "edit") {
    return (
      <CarePlanForm
        carePlan={activeCarePlan}
        onBack={() => setView("view")}
        onSave={activeCarePlan ? handleUpdateCarePlan : handleCreateCarePlan}
      />
    );
  }

  // Show loading before showing createCarePlan card
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center text-blue-600 font-medium text-lg">
          Loading...
        </div>
      </div>
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
          <div className="flex items-center justify-center space-x-3">
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
                    ? `${dueNotifications.length} care plan(s) due soon`
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
                      Care Plans Due Soon
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {dueNotifications.map((notification) => {
                        const reviewDate = new Date(notification.reviewDate);
                        const daysUntilDue = Math.ceil(
                          (reviewDate - new Date()) / (1000 * 60 * 60 * 24)
                        );

                        return (
                          <div
                            key={notification.id}
                            className="p-3 bg-red-50 rounded-lg border border-red-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-red-900">
                                  {notification.type}
                                </h5>
                                <p className="text-xs text-red-700 mt-1">
                                  Due: {reviewDate.toLocaleDateString()}
                                  {daysUntilDue === 0 && " (Today)"}
                                  {daysUntilDue === 1 && " (Tomorrow)"}
                                  {daysUntilDue > 1 &&
                                    ` (in ${daysUntilDue} days)`}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Status: {notification.status}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  setShowNotifications(false);
                                  setView("edit");
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
              onClick={() => setView("edit")}
              variant="default"
              style={{ minWidth: 180 }}
            >
              Create Care Plan
            </Button>
          </div>
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
                  ? `${dueNotifications.length} care plan(s) due soon`
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
                    Care Plans Due Soon
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {dueNotifications.map((notification) => {
                      const reviewDate = new Date(notification.reviewDate);
                      const daysUntilDue = Math.ceil(
                        (reviewDate - new Date()) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <div
                          key={notification.id}
                          className="p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="text-sm font-medium text-red-900">
                                {notification.type}
                              </h5>
                              <p className="text-xs text-red-700 mt-1">
                                Due: {reviewDate.toLocaleDateString()}
                                {daysUntilDue === 0 && " (Today)"}
                                {daysUntilDue === 1 && " (Tomorrow)"}
                                {daysUntilDue > 1 &&
                                  ` (in ${daysUntilDue} days)`}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Status: {notification.status}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setShowNotifications(false);
                                setView("edit");
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

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              activeCarePlan.status
            )}`}
          >
            {activeCarePlan.status?.toUpperCase()}
          </span>
          <Button
            onClick={() => setShowHistory(true)}
            variant="default"
            style={{ minWidth: 180 }}
          >
            History
          </Button>
          <Button
            onClick={() => setView("edit")}
            variant="default"
            style={{ minWidth: 180 }}
          >
            Edit Plan
          </Button>
        </div>
      </div>

      {/* Care Plan Summary Cards */}
      <CardsTab activeCarePlan={activeCarePlan} outcomes={outcomes} />

      {/* Navigation Tabs */}
      <CareNavTab activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab activeCarePlan={activeCarePlan} />
      )}

      {activeTab === "outcomes" && <OutcomesTab clientId={client._id} />}

      {activeTab === "documents" && (
        <CarePlanDocumentManager clientId={client._id} />
      )}

      {/* Personal Care Tab */}
      {activeTab === "personal-care" && (
        <PersonalCareTab activeCarePlan={activeCarePlan} />
      )}

      {/* Daily Living Tab */}
      {activeTab === "daily-living" && (
        <DailyLivingTab activeCarePlan={activeCarePlan} />
      )}

      {/* Visit Types Tab */}
      {activeTab === "visit-types" && (
        <VisitTypeManager clientId={client._id} />
      )}

      {/* History Modal */}
      {showHistory && (
        <HistoryTab setShowHistory={setShowHistory} client={client} />
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
    </div>
  );
}
