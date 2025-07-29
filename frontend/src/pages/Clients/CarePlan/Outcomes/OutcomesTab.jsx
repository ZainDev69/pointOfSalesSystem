import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Target, Filter, X } from "lucide-react";
import {
  createOutcome,
  updateOutcome,
  deleteOutcome,
  addOutcomeProgress,
  fetchOutcomeOptions,
  filterOutcomes,
  setFilter,
  clearFilters,
  resetToOriginalItems,
  fetchClientOutcomes,
} from "../../../../components/redux/slice/outcomes";

import toast from "react-hot-toast";
import { Eye, Plus, Edit3, Trash } from "lucide-react";
import { OutcomeForm } from "./OutcomeForm";
import { OutcomeDetails } from "./OutcomeDetails";
import { Button } from "../../../../components/ui/Button";

export function OutcomesTab({ clientId }) {
  const dispatch = useDispatch();
  const {
    items: outcomes,
    options,
    optionsLoading,
    filters,
    filteredItems,
    isFiltered,
    loading,
  } = useSelector((state) => state.outcomes);

  // Debug logging
  useEffect(() => {
    console.log("Outcomes state:", {
      options,
      optionsLoading,
      outcomes,
      loading,
    });
    console.log("Options data:", options);
    console.log("Options loading:", optionsLoading);
  }, [options, optionsLoading, outcomes, loading]);

  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [outcomeView, setOutcomeView] = useState("list");
  const [showOutcomeDetails, setShowOutcomeDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch outcome options on component mount
  useEffect(() => {
    if (
      !options ||
      Object.keys(options).length === 0 ||
      !options.status ||
      options.status.length === 0
    ) {
      dispatch(fetchOutcomeOptions());
    }
  }, [dispatch, options]);

  // Fetch client outcomes on component mount
  useEffect(() => {
    if (clientId) {
      dispatch(fetchClientOutcomes(clientId));
    }
  }, [dispatch, clientId]);

  // Helper function to format option labels
  const formatOptionLabel = (value) => {
    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getOutcomeStatusColor = (status) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "achieved":
        return "bg-green-100 text-green-800";
      case "unachieved":
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
      console.log("handleCreateOutcome called with:", outcomeData);
      console.log("clientId:", clientId);
      // Add required fields for outcome creation
      const outcomeWithRequiredFields = {
        ...outcomeData,
        clientId: clientId,
      };
      console.log("Outcome with required fields:", outcomeWithRequiredFields);

      await dispatch(
        createOutcome({ outcomeData: outcomeWithRequiredFields })
      ).unwrap();
      toast.success("Outcome created successfully");
      await dispatch(fetchClientOutcomes(clientId));
      setOutcomeView("list");
    } catch (error) {
      console.error("Error in handleCreateOutcome:", error);
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
      await dispatch(fetchClientOutcomes(clientId));
      setOutcomeView("list");
      setSelectedOutcome(null);
    } catch {
      toast.error("Failed to update outcome");
    }
  };

  const handleDeleteOutcome = async (outcomeId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this outcome? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deleteOutcome(outcomeId)).unwrap();
        toast.success("Outcome deleted successfully");
        await dispatch(fetchClientOutcomes(clientId));
      } catch {
        toast.error("Failed to delete outcome");
      }
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

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ filterType, value }));
  };

  const handleApplyFilters = async () => {
    const activeFilters = {};
    if (filters.category) activeFilters.category = filters.category;
    if (filters.status) activeFilters.status = filters.status;
    if (filters.priority) activeFilters.priority = filters.priority;

    if (Object.keys(activeFilters).length === 0) {
      dispatch(resetToOriginalItems());
      return;
    }

    try {
      await dispatch(
        filterOutcomes({
          carePlanId: "all", // Use a default value or get from context/props
          filters: activeFilters,
        })
      ).unwrap();
    } catch {
      toast.error("Failed to apply filters");
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(resetToOriginalItems());
  };

  // Determine which outcomes to display
  const displayOutcomes = isFiltered ? filteredItems : outcomes;

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
      {optionsLoading && (
        <div className="col-span-full text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading outcome options...</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900">
              {displayOutcomes.length}
            </p>
            <p className="text-sm text-blue-700 font-medium">Total Outcomes</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-900">
              {displayOutcomes.filter((o) => o.status === "achieved").length}
            </p>
            <p className="text-sm text-green-700 font-medium">Achieved</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-900">
              {displayOutcomes.filter((o) => o.status === "unachieved").length}
            </p>
            <p className="text-sm text-red-700 font-medium">Unachieved</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-900">
              {displayOutcomes.filter((o) => o.status === "in-progress").length}
            </p>
            <p className="text-sm text-blue-700 font-medium">In Progress</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-900">
              {displayOutcomes.filter((o) => o.status === "modified").length}
            </p>
            <p className="text-sm text-yellow-700 font-medium">Modified</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? "Hide" : "Show"} Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="px-6 py-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {options.category?.map((category) => (
                    <option key={category} value={category}>
                      {formatOptionLabel(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  {options.status?.map((status) => (
                    <option key={status} value={status}>
                      {formatOptionLabel(status)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Priorities</option>
                  {options.priority?.map((priority) => (
                    <option key={priority} value={priority}>
                      {formatOptionLabel(priority)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleApplyFilters}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-1"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Filter className="w-4 h-4" />
                  )}
                  <span>Apply Filters</span>
                </button>
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>

              {isFiltered && (
                <div className="text-sm text-gray-600">
                  Showing {filteredItems.length} of {outcomes.length} outcomes
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Outcomes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Care Outcomes
            </h3>
            <Button
              onClick={() => {
                setSelectedOutcome(null);
                setOutcomeView("form");
              }}
              variant="default"
              style={{ minWidth: 180 }}
              icon={Plus}
            >
              Add Outcome
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {displayOutcomes.map((outcome) => (
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

          {displayOutcomes.length === 0 && (
            <div className="p-8 text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No outcomes defined
              </h3>
              <p className="text-gray-600 mb-4">
                Add measurable outcomes to track care plan effectiveness.
              </p>
              <Button
                onClick={() => {
                  setSelectedOutcome(null);
                  setOutcomeView("form");
                }}
                variant="default"
                style={{ minWidth: 180 }}
              >
                Add First Outcome
              </Button>
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
