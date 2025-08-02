import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Target, X, Clock, FileText } from "lucide-react";
import { fetchOutcomeOptions } from "../../../../components/redux/slice/outcomes";
import { Button } from "../../../../components/ui/Button";
import { useApp } from "../../../../components/Context/AppContext";

export function OutcomeForm({ outcome, onBack, onSave }) {
  const dispatch = useDispatch();
  const { optionsLoading } = useSelector((state) => state.outcomes);
  const {
    OutcomestatusOptions,
    OutcomecategoryOptions,
    OutcomepriorityOptions,
  } = useApp();

  const [formData, setFormData] = useState({
    goal: "",
    measurable: "",
    achievable: true,
    timeframe: "",
    status: "in-progress",
    priority: "medium",
    category: "personal-care",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch outcome options on component mount
  useEffect(() => {
    dispatch(fetchOutcomeOptions());
  }, [dispatch]);

  useEffect(() => {
    if (outcome) {
      setFormData({
        goal: outcome.goal || "",
        measurable: outcome.measurable || "",
        achievable:
          outcome.achievable !== undefined ? outcome.achievable : true,
        timeframe: outcome.timeframe || "",
        status: outcome.status || "in-progress",
        priority: outcome.priority || "medium",
        category: outcome.category || "personal-care",
        notes: outcome.notes || "",
      });
    }
  }, [outcome]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.goal.trim()) {
      newErrors.goal = "Goal is required";
    }

    if (!formData.measurable.trim()) {
      newErrors.measurable = "Measurable criteria is required";
    }

    if (!formData.timeframe.trim()) {
      newErrors.timeframe = "Timeframe is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {outcome ? "Edit Outcome" : "Add New Outcome"}
              </h2>
              <p className="text-sm text-gray-600">
                Define measurable care outcomes for the client
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal *
          </label>
          <textarea
            value={formData.goal}
            onChange={(e) => handleInputChange("goal", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.goal ? "border-red-300" : "border-gray-300"
            }`}
            rows={3}
            placeholder="Describe the specific goal for this outcome..."
          />
          {errors.goal && (
            <p className="mt-1 text-sm text-red-600">{errors.goal}</p>
          )}
        </div>

        {/* Measurable Criteria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Measurable Criteria *
          </label>
          <textarea
            value={formData.measurable}
            onChange={(e) => handleInputChange("measurable", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.measurable ? "border-red-300" : "border-gray-300"
            }`}
            rows={3}
            placeholder="How will you measure progress towards this goal?"
          />
          {errors.measurable && (
            <p className="mt-1 text-sm text-red-600">{errors.measurable}</p>
          )}
        </div>

        {/* Timeframe and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeframe *
            </label>
            <input
              type="text"
              value={formData.timeframe}
              onChange={(e) => handleInputChange("timeframe", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.timeframe ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="e.g., 3 months, 6 weeks, 1 year"
            />
            {errors.timeframe && (
              <p className="mt-1 text-sm text-red-600">{errors.timeframe}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={optionsLoading}
            >
              {optionsLoading ? (
                <option>Loading options...</option>
              ) : (
                OutcomepriorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={optionsLoading}
            >
              {optionsLoading ? (
                <option>Loading options...</option>
              ) : (
                OutcomecategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={optionsLoading}
            >
              {optionsLoading ? (
                <option>Loading options...</option>
              ) : (
                OutcomestatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Achievable */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.achievable}
              onChange={(e) =>
                handleInputChange("achievable", e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              This goal is achievable
            </span>
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Any additional notes or considerations..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" variant="default" style={{ minWidth: 180 }}>
            {outcome ? "Update Outcome" : "Create Outcome"}
          </Button>
        </div>
      </form>
    </div>
  );
}
