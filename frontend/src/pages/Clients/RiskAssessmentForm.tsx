import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Shield,
} from "lucide-react";

export function RiskAssessmentForm({ assessment, onBack, onSave }) {
  const isEditing = !!assessment;

  const [formData, setFormData] = useState({
    type: assessment?.type || "environmental",
    assessmentDate:
      assessment?.assessmentDate || new Date().toISOString().split("T")[0],
    assessedBy: assessment?.assessedBy || "",
    reviewDate: assessment?.reviewDate || "",
    status: assessment?.status || "current",
    overallRisk: assessment?.overallRisk || "low",
    risks: assessment?.risks || [],
    controlMeasures: assessment?.controlMeasures || [],
    monitoringPlan: {
      frequency: assessment?.monitoringPlan?.frequency || "",
      methods: assessment?.monitoringPlan?.methods || [],
      indicators: assessment?.monitoringPlan?.indicators || [],
      responsibility: assessment?.monitoringPlan?.responsibility || "",
      reportingProcess: assessment?.monitoringPlan?.reportingProcess || [],
    },
    version: assessment?.version || 1,
  });

  const assessmentTypes = [
    { id: "environmental", label: "Environmental Hazards" },
    { id: "moving-handling", label: "Moving & Handling" },
    { id: "falls", label: "Falls Prevention" },
    { id: "medication", label: "Medication Management" },
    { id: "skin-integrity", label: "Skin Integrity" },
    { id: "nutrition-hydration", label: "Nutrition & Hydration" },
    { id: "mental-capacity", label: "Mental Capacity" },
    { id: "infection-control", label: "Infection Control" },
    { id: "fire-safety", label: "Fire Safety" },
    { id: "personal-safety", label: "Personal Safety" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const assessmentData = {
      ...formData,
      id: assessment?.id || Date.now().toString(),
    };

    onSave(assessmentData);
  };

  const addRisk = () => {
    const newRisk = {
      id: Date.now().toString(),
      hazard: "",
      whoAtRisk: [],
      likelihood: "unlikely",
      severity: "minor",
      riskLevel: "low",
      existingControls: [],
      residualRisk: "low",
    };

    setFormData((prev) => ({
      ...prev,
      risks: [...prev.risks, newRisk],
    }));
  };

  const updateRisk = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      risks: prev.risks.map((risk, i) =>
        i === index ? { ...risk, [field]: value } : risk
      ),
    }));
  };

  const removeRisk = (index) => {
    setFormData((prev) => ({
      ...prev,
      risks: prev.risks.filter((_, i) => i !== index),
    }));
  };

  const addControlMeasure = () => {
    const newMeasure = {
      id: Date.now().toString(),
      riskId: "",
      measure: "",
      type: "control",
      responsibility: "",
      implementationDate: "",
      reviewDate: "",
      status: "planned",
      effectiveness: "not-assessed",
    };

    setFormData((prev) => ({
      ...prev,
      controlMeasures: [...prev.controlMeasures, newMeasure],
    }));
  };

  const updateControlMeasure = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      controlMeasures: prev.controlMeasures.map((measure, i) =>
        i === index ? { ...measure, [field]: value } : measure
      ),
    }));
  };

  const removeControlMeasure = (index) => {
    setFormData((prev) => ({
      ...prev,
      controlMeasures: prev.controlMeasures.filter((_, i) => i !== index),
    }));
  };

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
            {isEditing ? "Edit Risk Assessment" : "Create Risk Assessment"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update risk assessment details"
              : "Create a comprehensive risk assessment"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              Assessment Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assessment Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {assessmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

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
                Overall Risk Level
              </label>
              <select
                value={formData.overallRisk}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    overallRisk: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very-high">Very High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current">Current</option>
                <option value="due">Due for Review</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Risks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Identified Risks
              </h3>
            </div>
            <button
              type="button"
              onClick={addRisk}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Risk</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.risks.map((risk, index) => (
              <div
                key={risk.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hazard Description
                    </label>
                    <input
                      type="text"
                      value={risk.hazard}
                      onChange={(e) =>
                        updateRisk(index, "hazard", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the hazard or risk..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Who is at Risk
                    </label>
                    <input
                      type="text"
                      value={risk.whoAtRisk.join(", ")}
                      onChange={(e) =>
                        updateRisk(
                          index,
                          "whoAtRisk",
                          e.target.value.split(", ")
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Client, carers, visitors, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Likelihood
                    </label>
                    <select
                      value={risk.likelihood}
                      onChange={(e) =>
                        updateRisk(index, "likelihood", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="very-unlikely">Very Unlikely</option>
                      <option value="unlikely">Unlikely</option>
                      <option value="possible">Possible</option>
                      <option value="likely">Likely</option>
                      <option value="very-likely">Very Likely</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity
                    </label>
                    <select
                      value={risk.severity}
                      onChange={(e) =>
                        updateRisk(index, "severity", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="negligible">Negligible</option>
                      <option value="minor">Minor</option>
                      <option value="moderate">Moderate</option>
                      <option value="major">Major</option>
                      <option value="catastrophic">Catastrophic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Level
                    </label>
                    <select
                      value={risk.riskLevel}
                      onChange={(e) =>
                        updateRisk(index, "riskLevel", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="very-high">Very High</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Existing Controls
                    </label>
                    <textarea
                      value={risk.existingControls.join(", ")}
                      onChange={(e) =>
                        updateRisk(
                          index,
                          "existingControls",
                          e.target.value.split(", ")
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="List existing control measures..."
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(
                      risk.riskLevel
                    )}`}
                  >
                    {risk.riskLevel.replace("-", " ")} risk
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRisk(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {formData.risks.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No risks identified yet. Click "Add Risk" to get started.
              </p>
            )}
          </div>
        </div>

        {/* Control Measures */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Control Measures
            </h3>
            <button
              type="button"
              onClick={addControlMeasure}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Control</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.controlMeasures.map((measure, index) => (
              <div
                key={measure.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Control Measure
                    </label>
                    <textarea
                      value={measure.measure}
                      onChange={(e) =>
                        updateControlMeasure(index, "measure", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the control measure..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={measure.type}
                      onChange={(e) =>
                        updateControlMeasure(index, "type", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="eliminate">Eliminate</option>
                      <option value="reduce">Reduce</option>
                      <option value="control">Control</option>
                      <option value="monitor">Monitor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsibility
                    </label>
                    <input
                      type="text"
                      value={measure.responsibility}
                      onChange={(e) =>
                        updateControlMeasure(
                          index,
                          "responsibility",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Implementation Date
                    </label>
                    <input
                      type="date"
                      value={measure.implementationDate}
                      onChange={(e) =>
                        updateControlMeasure(
                          index,
                          "implementationDate",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Review Date
                    </label>
                    <input
                      type="date"
                      value={measure.reviewDate}
                      onChange={(e) =>
                        updateControlMeasure(
                          index,
                          "reviewDate",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={measure.status}
                      onChange={(e) =>
                        updateControlMeasure(index, "status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="planned">Planned</option>
                      <option value="implemented">Implemented</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="updated">Updated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Effectiveness
                    </label>
                    <select
                      value={measure.effectiveness}
                      onChange={(e) =>
                        updateControlMeasure(
                          index,
                          "effectiveness",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="not-assessed">Not Assessed</option>
                      <option value="effective">Effective</option>
                      <option value="partially-effective">
                        Partially Effective
                      </option>
                      <option value="ineffective">Ineffective</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={() => removeControlMeasure(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {formData.controlMeasures.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No control measures added yet. Click "Add Control" to get
                started.
              </p>
            )}
          </div>
        </div>

        {/* Monitoring Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monitoring Plan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monitoring Frequency
              </label>
              <input
                type="text"
                value={formData.monitoringPlan.frequency}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    monitoringPlan: {
                      ...prev.monitoringPlan,
                      frequency: e.target.value,
                    },
                  }))
                }
                placeholder="e.g., Weekly, Monthly, Quarterly"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsibility
              </label>
              <input
                type="text"
                value={formData.monitoringPlan.responsibility}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    monitoringPlan: {
                      ...prev.monitoringPlan,
                      responsibility: e.target.value,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monitoring Methods
              </label>
              <textarea
                value={formData.monitoringPlan.methods.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    monitoringPlan: {
                      ...prev.monitoringPlan,
                      methods: e.target.value.split(", "),
                    },
                  }))
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observation, documentation, testing, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Indicators
              </label>
              <textarea
                value={formData.monitoringPlan.indicators.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    monitoringPlan: {
                      ...prev.monitoringPlan,
                      indicators: e.target.value.split(", "),
                    },
                  }))
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What to look for or measure..."
              />
            </div>
          </div>
        </div>

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
            <span>{isEditing ? "Update Assessment" : "Save Assessment"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
