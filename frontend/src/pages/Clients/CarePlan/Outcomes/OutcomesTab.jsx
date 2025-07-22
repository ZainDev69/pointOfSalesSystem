import { useState } from "react";
import { useDispatch } from "react-redux";
import { Target } from "lucide-react";
import {
  createOutcome,
  updateOutcome,
  deleteOutcome,
  addOutcomeProgress,
} from "../../../../components/redux/slice/outcomes";

import toast from "react-hot-toast";
import { Eye, Plus, Edit3, Trash } from "lucide-react";
import { OutcomeForm } from "../OutcomeForm";

export function OutcomesTab({ outcomes, activeCarePlan }) {
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [outcomeView, setOutcomeView] = useState("list");
  const [showOutcomeDetails, setShowOutcomeDetails] = useState(false);

  const dispatch = useDispatch();

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
  return (
    <div className="space-y-6">
      {/* Outcomes Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900">
              {outcomes.length}
            </p>
            <p className="text-sm text-blue-700 font-medium">Total Outcomes</p>
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
                    <span>Category: {outcome.category.replace("-", " ")}</span>
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
