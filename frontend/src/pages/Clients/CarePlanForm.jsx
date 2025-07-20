import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Shield,
  Target,
  User,
  Heart,
} from "lucide-react";

export function CarePlanForm({ carePlan, onBack, onSave }) {
  const isEditing = !!carePlan;
  const [activeTab, setActiveTab] = useState("overview");

  // Helper function to format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  const [formData, setFormData] = useState({
    assessmentDate: formatDateForInput(carePlan?.assessmentDate),
    assessedBy: carePlan?.assessedBy || "",
    approvedBy: carePlan?.approvedBy || "",
    startDate: formatDateForInput(carePlan?.startDate),
    reviewDate: formatDateForInput(carePlan?.reviewDate),
    status: carePlan?.status || "draft",
    personalCare: {
      washing: {
        required: carePlan?.personalCare?.washing?.required || false,
        frequency: carePlan?.personalCare?.washing?.frequency || "",
        assistanceLevel:
          carePlan?.personalCare?.washing?.assistanceLevel || "independent",
        equipment: carePlan?.personalCare?.washing?.equipment || [],
        techniques: carePlan?.personalCare?.washing?.techniques || [],
        preferences: carePlan?.personalCare?.washing?.preferences || [],
        risks: carePlan?.personalCare?.washing?.risks || [],
        notes: carePlan?.personalCare?.washing?.notes || "",
      },
      bathing: {
        required: carePlan?.personalCare?.bathing?.required || false,
        frequency: carePlan?.personalCare?.bathing?.frequency || "",
        assistanceLevel:
          carePlan?.personalCare?.bathing?.assistanceLevel || "independent",
        equipment: carePlan?.personalCare?.bathing?.equipment || [],
        techniques: carePlan?.personalCare?.bathing?.techniques || [],
        preferences: carePlan?.personalCare?.bathing?.preferences || [],
        risks: carePlan?.personalCare?.bathing?.risks || [],
        notes: carePlan?.personalCare?.bathing?.notes || "",
      },
      dressing: {
        required: carePlan?.personalCare?.dressing?.required || false,
        frequency: carePlan?.personalCare?.dressing?.frequency || "",
        assistanceLevel:
          carePlan?.personalCare?.dressing?.assistanceLevel || "independent",
        equipment: carePlan?.personalCare?.dressing?.equipment || [],
        techniques: carePlan?.personalCare?.dressing?.techniques || [],
        preferences: carePlan?.personalCare?.dressing?.preferences || [],
        risks: carePlan?.personalCare?.dressing?.risks || [],
        notes: carePlan?.personalCare?.dressing?.notes || "",
      },
    },
    dailyLiving: {
      housework: {
        required: carePlan?.dailyLiving?.housework?.required || false,
        frequency: carePlan?.dailyLiving?.housework?.frequency || "",
        assistanceLevel:
          carePlan?.dailyLiving?.housework?.assistanceLevel || "independent",
        equipment: carePlan?.dailyLiving?.housework?.equipment || [],
        techniques: carePlan?.dailyLiving?.housework?.techniques || [],
        preferences: carePlan?.dailyLiving?.housework?.preferences || [],
        risks: carePlan?.dailyLiving?.housework?.risks || [],
        notes: carePlan?.dailyLiving?.housework?.notes || "",
      },
      shopping: {
        required: carePlan?.dailyLiving?.shopping?.required || false,
        frequency: carePlan?.dailyLiving?.shopping?.frequency || "",
        assistanceLevel:
          carePlan?.dailyLiving?.shopping?.assistanceLevel || "independent",
        equipment: carePlan?.dailyLiving?.shopping?.equipment || [],
        techniques: carePlan?.dailyLiving?.shopping?.techniques || [],
        preferences: carePlan?.dailyLiving?.shopping?.preferences || [],
        risks: carePlan?.dailyLiving?.shopping?.risks || [],
        notes: carePlan?.dailyLiving?.shopping?.notes || "",
      },
      cooking: {
        required: carePlan?.dailyLiving?.cooking?.required || false,
        frequency: carePlan?.dailyLiving?.cooking?.frequency || "",
        assistanceLevel:
          carePlan?.dailyLiving?.cooking?.assistanceLevel || "independent",
        equipment: carePlan?.dailyLiving?.cooking?.equipment || [],
        techniques: carePlan?.dailyLiving?.cooking?.techniques || [],
        preferences: carePlan?.dailyLiving?.cooking?.preferences || [],
        risks: carePlan?.dailyLiving?.cooking?.risks || [],
        notes: carePlan?.dailyLiving?.cooking?.notes || "",
      },
    },
    outcomes: carePlan?.outcomes || [],
    version: carePlan?.version || 1,
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "personal-care", label: "Personal Care", icon: User },
    { id: "daily-living", label: "Daily Living", icon: Heart },
    { id: "outcomes", label: "Outcomes", icon: Target },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const carePlanData = {
      ...formData,
      id: carePlan?.id || Date.now().toString(),
    };

    onSave(carePlanData);
  };

  const addOutcome = () => {
    const newOutcome = {
      id: Date.now().toString(),
      goal: "",
      measurable: "",
      achievable: true,
      timeframe: "",
      progress: [],
      status: "not-started",
    };

    setFormData((prev) => ({
      ...prev,
      outcomes: [...prev.outcomes, newOutcome],
    }));
  };

  const updateOutcome = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      outcomes: prev.outcomes.map((outcome, i) =>
        i === index ? { ...outcome, [field]: value } : outcome
      ),
    }));
  };

  const removeOutcome = (index) => {
    setFormData((prev) => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index),
    }));
  };

  const updateCareTask = (section, task, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [task]: {
          ...prev[section][task],
          [field]: value,
        },
      },
    }));
  };

  const renderCareTaskForm = (section, taskKey, taskLabel) => {
    const task = formData[section][taskKey];

    return (
      <div key={taskKey} className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">{taskLabel}</h4>
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`${section}-${taskKey}-required`}
              checked={task.required}
              onChange={(e) =>
                updateCareTask(section, taskKey, "required", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`${section}-${taskKey}-required`}
              className="ml-2 block text-sm text-gray-900"
            >
              Required
            </label>
          </div>
        </div>

        {task.required && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={task.frequency}
                onChange={(e) =>
                  updateCareTask(section, taskKey, "frequency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="Daily">Daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Twice weekly">Twice weekly</option>
                <option value="As needed">As needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assistance Level
              </label>
              <select
                value={task.assistanceLevel}
                onChange={(e) =>
                  updateCareTask(
                    section,
                    taskKey,
                    "assistanceLevel",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="independent">Independent</option>
                <option value="supervision">Supervision</option>
                <option value="partial-assistance">Partial Assistance</option>
                <option value="full-assistance">Full Assistance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Required
              </label>
              <input
                type="text"
                value={task.equipment.join(", ")}
                onChange={(e) =>
                  updateCareTask(
                    section,
                    taskKey,
                    "equipment",
                    e.target.value.split(", ").filter((item) => item.trim())
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List equipment needed..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Techniques
              </label>
              <input
                type="text"
                value={task.techniques.join(", ")}
                onChange={(e) =>
                  updateCareTask(
                    section,
                    taskKey,
                    "techniques",
                    e.target.value.split(", ").filter((item) => item.trim())
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Special techniques or methods..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Preferences
              </label>
              <textarea
                value={task.preferences.join(", ")}
                onChange={(e) =>
                  updateCareTask(
                    section,
                    taskKey,
                    "preferences",
                    e.target.value.split(", ").filter((item) => item.trim())
                  )
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Client preferences and choices..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={task.notes}
                onChange={(e) =>
                  updateCareTask(section, taskKey, "notes", e.target.value)
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes or instructions..."
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Care Plan" : "Create Care Plan"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update comprehensive care plan"
              : "Create a detailed care plan following CQC guidelines"}
          </p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Care Plan Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.assessmentDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        assessmentDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessed By *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.assessedBy}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        assessedBy: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approved By
                  </label>
                  <input
                    type="text"
                    value={formData.approvedBy}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        approvedBy: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.reviewDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reviewDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="under-review">Under Review</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personal Care Tab */}
        {activeTab === "personal-care" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Care Needs
                </h3>
              </div>

              <div className="space-y-6">
                {renderCareTaskForm(
                  "personalCare",
                  "washing",
                  "Washing & Hygiene"
                )}
                {renderCareTaskForm(
                  "personalCare",
                  "bathing",
                  "Bathing & Showering"
                )}
                {renderCareTaskForm(
                  "personalCare",
                  "dressing",
                  "Dressing & Undressing"
                )}
              </div>
            </div>
          </div>
        )}

        {/* Daily Living Tab */}
        {activeTab === "daily-living" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Daily Living Support
                </h3>
              </div>

              <div className="space-y-6">
                {renderCareTaskForm(
                  "dailyLiving",
                  "housework",
                  "Housework & Cleaning"
                )}
                {renderCareTaskForm(
                  "dailyLiving",
                  "shopping",
                  "Shopping & Errands"
                )}
                {renderCareTaskForm(
                  "dailyLiving",
                  "cooking",
                  "Cooking & Meal Preparation"
                )}
              </div>
            </div>
          </div>
        )}

        {/* Outcomes Tab */}
        {activeTab === "outcomes" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Care Outcomes
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addOutcome}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Outcome</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.outcomes.map((outcome, index) => (
                  <div
                    key={outcome.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Goal
                        </label>
                        <input
                          type="text"
                          value={outcome.goal}
                          onChange={(e) =>
                            updateOutcome(index, "goal", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="What do we want to achieve?"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Measurable Outcome
                        </label>
                        <textarea
                          value={outcome.measurable}
                          onChange={(e) =>
                            updateOutcome(index, "measurable", e.target.value)
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="How will we measure success?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timeframe
                        </label>
                        <input
                          type="text"
                          value={outcome.timeframe}
                          onChange={(e) =>
                            updateOutcome(index, "timeframe", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 3 months, 6 weeks"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={outcome.status}
                          onChange={(e) =>
                            updateOutcome(index, "status", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="achieved">Achieved</option>
                          <option value="not-achieved">Not Achieved</option>
                          <option value="modified">Modified</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 flex items-center">
                        <input
                          type="checkbox"
                          id={`outcome-${index}-achievable`}
                          checked={outcome.achievable}
                          onChange={(e) =>
                            updateOutcome(index, "achievable", e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`outcome-${index}-achievable`}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          This outcome is achievable and realistic
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <button
                        type="button"
                        onClick={() => removeOutcome(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}

                {formData.outcomes.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No outcomes defined yet. Click "Add Outcome" to get started.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? "Update Care Plan" : "Save Care Plan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
