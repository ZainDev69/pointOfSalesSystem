import React, { useState, useEffect } from "react";
import { Plus, Shield, Edit3, History } from "lucide-react";
import { CarePlanForm } from "./CarePlanForm";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchActiveCarePlan,
  fetchCarePlanHistory,
  createCarePlan,
  updateCarePlan,
  deleteCarePlan,
} from "../../../components/redux/slice/carePlans";
import { fetchCarePlanOutcomes } from "../../../components/redux/slice/outcomes";
import toast from "react-hot-toast";
import { CarePlanDocumentManager } from "./CarePlanDocumentManager";
import { DailyLivingTab } from "./DailyLiving/DailyLiving";
import { OutcomesTab } from "./Outcomes/OutcomesTab";
import { OverviewTab } from "./Overview/OverviewTab";
import { HistoryTab } from "./CareComponents/HistoryTab";
import { CareNavTab } from "./CareComponents/CareNavTab";
import { getStatusColor } from "./CareComponents/StatusColor";
import { CardsTab } from "./Cards/Cards";

export function CarePlanManager({ client }) {
  const [view, setView] = useState("view");
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useDispatch();

  const { activeCarePlan } = useSelector((state) => state.carePlans);
  const { items: outcomes } = useSelector((state) => state.outcomes);

  useEffect(() => {
    if (client._id) {
      dispatch(fetchActiveCarePlan(client._id));
      dispatch(fetchCarePlanHistory(client._id));
    }
  }, [client._id, dispatch]);

  useEffect(() => {
    if (activeCarePlan?._id) {
      dispatch(fetchCarePlanOutcomes(activeCarePlan._id));
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
      <CardsTab activeCarePlan={activeCarePlan} outcomes={outcomes} />

      {/* Navigation Tabs */}
      <CareNavTab activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <OverviewTab activeCarePlan={activeCarePlan} />
      )}

      {activeTab === "outcomes" && (
        <OutcomesTab outcomes={outcomes} activeCarePlan={activeCarePlan} />
      )}

      {activeTab === "documents" && (
        <CarePlanDocumentManager
          carePlanId={activeCarePlan._id}
          clientId={client._id}
        />
      )}

      {/* Personal Care Tab */}
      {activeTab === "personal-care" && (
        <PersonalCareTab activeCarePlan={activeCarePlan} />
      )}

      {/* Daily Living Tab */}
      {activeTab === "daily-living" && (
        <DailyLivingTab activeCarePlan={activeCarePlan} />
      )}

      {/* History Modal */}
      {showHistory && <HistoryTab setShowHistory={setShowHistory} />}

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
