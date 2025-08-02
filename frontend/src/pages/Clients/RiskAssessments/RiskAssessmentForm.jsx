import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Shield,
} from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { TextArea } from "../../../components/ui/TextArea";
import { Section } from "../../../components/ui/Section";

export function RiskAssessmentForm({ assessment, onBack, onSave }) {
  const isEditing = !!assessment;

  const { riskAssessmentOptions, riskAssessmentOptionsLoading } = useSelector(
    (state) => state.riskAssessments
  );

  //In App context, inko dalo aur phr yahan use kro
  const likelihoodOptions = riskAssessmentOptions?.likelihood || [];
  const severityOptions = riskAssessmentOptions?.severity || [];
  const riskAssessmentTypes = riskAssessmentOptions?.type || [];
  const assessmentStatusOptions = riskAssessmentOptions?.status || [];

  const calculateReviewDate = (assessmentDate) => {
    if (!assessmentDate) return "";
    const date = new Date(assessmentDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split("T")[0];
  };

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

  const getRiskScoreColor = (score) => {
    if (score >= 16) return "bg-red-800 text-white";
    if (score >= 12) return "bg-red-600 text-white";
    if (score >= 8) return "bg-orange-500 text-white";
    if (score >= 4) return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
  };

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
    if (assessment?._id) {
      assessmentData._id = assessment._id;
    }
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
        <Section
          icon={<Shield className="w-5 h-5 text-gray-400" />}
          title="Assessment Details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risk Assessment Type *
              </label>
              <select
                value={formData.type}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, type: val }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={riskAssessmentOptionsLoading}
              >
                {riskAssessmentOptionsLoading ? (
                  <option>Loading options...</option>
                ) : (
                  riskAssessmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))
                )}
              </select>
            </div>

            <Input
              type="date"
              label="Assessment Date *"
              value={formData.assessmentDate}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, assessmentDate: val }))
              }
              required
            />
            <Input
              label="Assessed By *"
              value={formData.assessedBy}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, assessedBy: val }))
              }
              placeholder="Assessed by Staff"
              required
            />
            <Input
              type="date"
              label="Review Date *"
              value={formData.reviewDate}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, reviewDate: val }))
              }
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={riskAssessmentOptionsLoading}
              >
                {riskAssessmentOptionsLoading ? (
                  <option>Loading options...</option>
                ) : (
                  assessmentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </Section>

        <Section
          icon={<AlertTriangle className="w-5 h-5 text-gray-400" />}
          title="Identified Risks"
        >
          <div className="flex justify-end mb-4">
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
                  <TextArea
                    label="Description"
                    value={risk.hazard}
                    onChange={(val) => updateRisk(index, "hazard", val)}
                    placeholder="Describe the hazard or risk..."
                    rows={4}
                    full
                  />
                  <Input
                    label="Who is at Risk"
                    value={risk.whoAtRisk.join(", ")}
                    onChange={(val) =>
                      updateRisk(index, "whoAtRisk", val.split(", "))
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Likelihood
                    </label>
                    <select
                      value={risk.likelihood}
                      onChange={(val) => updateRisk(index, "likelihood", val)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={riskAssessmentOptionsLoading}
                    >
                      {riskAssessmentOptionsLoading ? (
                        <option>Loading options...</option>
                      ) : (
                        likelihoodOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severity
                    </label>
                    <select
                      value={risk.severity}
                      onChange={(val) => updateRisk(index, "severity", val)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={riskAssessmentOptionsLoading}
                    >
                      {riskAssessmentOptionsLoading ? (
                        <option>Loading options...</option>
                      ) : (
                        severityOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))
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
        </Section>

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
