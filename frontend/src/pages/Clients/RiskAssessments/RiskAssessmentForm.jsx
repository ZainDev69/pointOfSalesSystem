import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Shield,
} from "lucide-react";
import {
  fetchRiskAssessmentTypes,
  fetchLikelihoodOptions,
  fetchSeverityOptions,
  fetchAssessmentStatusOptions,
} from "../../../components/redux/slice/riskAssessments";
import { Button } from "../../../components/ui/Button";

export function RiskAssessmentForm({ assessment, onBack, onSave }) {
  const isEditing = !!assessment;
  const dispatch = useDispatch();
  const riskAssessmentTypes = useSelector(
    (state) => state.riskAssessments.riskAssessmentTypes
  );
  const riskAssessmentTypesLoading = useSelector(
    (state) => state.riskAssessments.riskAssessmentTypesLoading
  );
  const likelihoodOptions = useSelector(
    (state) => state.riskAssessments.likelihoodOptions
  );
  const severityOptions = useSelector(
    (state) => state.riskAssessments.severityOptions
  );
  const assessmentStatusOptions = useSelector(
    (state) => state.riskAssessments.assessmentStatusOptions
  );

  useEffect(() => {
    if (!riskAssessmentTypes || riskAssessmentTypes.length === 0) {
      dispatch(fetchRiskAssessmentTypes());
    }
    if (!likelihoodOptions || likelihoodOptions.length === 0) {
      dispatch(fetchLikelihoodOptions());
    }
    if (!severityOptions || severityOptions.length === 0) {
      dispatch(fetchSeverityOptions());
    }

    if (!assessmentStatusOptions || assessmentStatusOptions.length === 0) {
      dispatch(fetchAssessmentStatusOptions());
    }
  }, [
    dispatch,
    riskAssessmentTypes,
    likelihoodOptions,
    severityOptions,
    assessmentStatusOptions,
  ]);

  // Calculate review date (1 year from assessment date)
  const calculateReviewDate = (assessmentDate) => {
    if (!assessmentDate) return "";
    const date = new Date(assessmentDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split("T")[0];
  };

  // Calculate risk score based on likelihood and severity
  const calculateRiskScore = (likelihood, severity) => {
    const likelihoodOption = likelihoodOptions.find(
      (option) => option.value === likelihood
    );
    const severityOption = severityOptions.find(
      (option) => option.value === severity
    );

    const likelihoodScore = likelihoodOption?.score || 1;
    const severityScore = severityOption?.score || 1;

    return likelihoodScore * severityScore;
  };

  // Get risk score color based on score value
  const getRiskScoreColor = (score) => {
    if (score >= 16) return "bg-red-800 text-white"; // Dark red for high risk
    if (score >= 12) return "bg-red-600 text-white"; // Red for high risk
    if (score >= 8) return "bg-orange-500 text-white"; // Orange for medium risk
    if (score >= 4) return "bg-yellow-500 text-white"; // Yellow for low risk
    return "bg-green-500 text-white"; // Green for very low risk
  };

  // Calculate initial review date
  const getInitialReviewDate = () => {
    if (assessment?.reviewDate) {
      return assessment.reviewDate;
    }
    const today = new Date().toISOString().split("T")[0];
    return calculateReviewDate(today);
  };

  const [formData, setFormData] = useState({
    type: assessment?.type || "other/general",
    assessmentDate:
      assessment?.assessmentDate || new Date().toISOString().split("T")[0],
    assessedBy: assessment?.assessedBy || "",
    reviewDate: getInitialReviewDate(),
    status: assessment?.status || "current",
    risks: assessment?.risks || [],
    version: assessment?.version || 1,
  });

  // Update review date when assessment date changes (only for new assessments)
  useEffect(() => {
    if (!isEditing && formData.assessmentDate) {
      setFormData((prev) => ({
        ...prev,
        reviewDate: calculateReviewDate(formData.assessmentDate),
      }));
    }
  }, [formData.assessmentDate, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const assessmentData = { ...formData };
    // Ensure _id is included for editing
    if (assessment?._id) {
      assessmentData._id = assessment._id;
    }
    // Remove local id for new assessments
    if (!assessment?._id && !assessment?.id) {
      delete assessmentData.id;
      delete assessmentData._id;
    }
    onSave(assessmentData);
  };

  const addRisk = () => {
    const newRisk = {
      id: Date.now().toString(),
      hazard: "",
      whoAtRisk: [],
      likelihood: "unlikely",
      severity: "minor",
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
                {riskAssessmentTypesLoading ? (
                  <option disabled>Loading...</option>
                ) : riskAssessmentTypes && riskAssessmentTypes.length > 0 ? (
                  riskAssessmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))
                ) : (
                  <option value="other/general">Other/General</option>
                )}
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
                placeholder="Assessed by Staff"
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
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {assessmentStatusOptions &&
                assessmentStatusOptions.length > 0 ? (
                  assessmentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                ) : (
                  <option value="current">Current</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Risks Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Identified Risks
              </h3>
            </div>
            <Button
              type="button"
              onClick={addRisk}
              variant="default"
              icon={Plus}
              style={{ minWidth: 180 }}
            >
              Add Risk
            </Button>
          </div>

          <div className="space-y-4">
            {formData.risks.map((risk, index) => (
              <div
                key={`risk-${index}`}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={risk.hazard}
                      onChange={(e) =>
                        updateRisk(index, "hazard", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the hazard or risk..."
                      rows={4}
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
                      {likelihoodOptions && likelihoodOptions.length > 0 ? (
                        likelihoodOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} ({option.score})
                          </option>
                        ))
                      ) : (
                        <option value="unlikely">Unlikely</option>
                      )}
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
                      {severityOptions && severityOptions.length > 0 ? (
                        severityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label} ({option.score})
                          </option>
                        ))
                      ) : (
                        <option value="minor">Minor</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Score
                    </label>
                    <div
                      className={`w-full px-3 py-2 rounded-lg text-center ${getRiskScoreColor(
                        calculateRiskScore(risk.likelihood, risk.severity)
                      )}`}
                    >
                      <span className="text-lg font-bold">
                        {Math.round(
                          calculateRiskScore(risk.likelihood, risk.severity)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-3">
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
                No risks added yet. Click "Add Risk" to get started.
              </p>
            )}
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

          <Button
            type="submit"
            variant="default"
            icon={Save}
            style={{ minWidth: 180 }}
          >
            {isEditing ? "Update Assessment" : "Save Assessment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
