import React, { useState } from "react";
import {
  X,
  Target,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  User,
  Plus,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";

export function OutcomeDetails({ outcome, onClose, onAddProgress }) {
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [progressData, setProgressData] = useState({
    progress: "",
    evidence: "",
    nextSteps: [""],
    recordedBy: "",
    percentageComplete: 0,
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "achieved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "unachieved":
        return <X className="w-5 h-5 text-red-500" />;
      case "modified":
        return <FileText className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
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

  const handleAddProgress = () => {
    if (progressData.progress.trim() && progressData.recordedBy.trim()) {
      onAddProgress({
        ...progressData,
        nextSteps: progressData.nextSteps.filter((step) => step.trim()),
        date: new Date().toISOString(),
      });
      setProgressData({
        progress: "",
        evidence: "",
        nextSteps: [""],
        recordedBy: "",
        percentageComplete: 0,
      });
      setShowProgressForm(false);
    }
  };

  const addNextStep = () => {
    setProgressData((prev) => ({
      ...prev,
      nextSteps: [...prev.nextSteps, ""],
    }));
  };

  const updateNextStep = (index, value) => {
    setProgressData((prev) => ({
      ...prev,
      nextSteps: prev.nextSteps.map((step, i) => (i === index ? value : step)),
    }));
  };

  const removeNextStep = (index) => {
    setProgressData((prev) => ({
      ...prev,
      nextSteps: prev.nextSteps.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Outcome Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Outcome Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {outcome.goal}
                </h3>
                <p className="text-gray-600 mb-3">{outcome.measurable}</p>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      outcome.status
                    )}`}
                  >
                    {outcome.status.replace("-", " ")}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 ${getPriorityColor(
                      outcome.priority
                    )}`}
                  >
                    {outcome.priority} Priority
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {outcome.category.replace("-", " ")}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(outcome.status)}
              </div>
            </div>
          </div>

          {/* Outcome Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Timeframe
                </h4>
                <p className="text-gray-900">{outcome.timeframe}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Achievable
                </h4>
                <p className="text-gray-900">
                  {outcome.achievable ? "Yes" : "No"}
                </p>
              </div>

              {outcome.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Notes
                  </h4>
                  <p className="text-gray-900">{outcome.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Created
                </h4>
                <p className="text-gray-900">
                  {new Date(outcome.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Last Updated
                </h4>
                <p className="text-gray-900">
                  {new Date(outcome.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Progress Entries
                </h4>
                <p className="text-gray-900">{outcome.progress?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Progress Tracking</span>
              </h4>
              <button
                onClick={() => setShowProgressForm(!showProgressForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Progress</span>
              </button>
            </div>

            {/* Progress Form */}
            {showProgressForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress Update *
                  </label>
                  <textarea
                    value={progressData.progress}
                    onChange={(e) =>
                      setProgressData((prev) => ({
                        ...prev,
                        progress: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the progress made..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evidence
                  </label>
                  <textarea
                    value={progressData.evidence}
                    onChange={(e) =>
                      setProgressData((prev) => ({
                        ...prev,
                        evidence: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="What evidence supports this progress?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recorded By *
                    </label>
                    <input
                      type="text"
                      value={progressData.recordedBy}
                      onChange={(e) =>
                        setProgressData((prev) => ({
                          ...prev,
                          recordedBy: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Percentage Complete
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={progressData.percentageComplete}
                      onChange={(e) =>
                        setProgressData((prev) => ({
                          ...prev,
                          percentageComplete: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Steps
                  </label>
                  {progressData.nextSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => updateNextStep(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Next step..."
                      />
                      <button
                        type="button"
                        onClick={() => removeNextStep(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addNextStep}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Next Step
                  </button>
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowProgressForm(false)}
                    className="px-3 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    type="button"
                    onClick={handleAddProgress}
                    variant="default"
                    style={{ minWidth: 180 }}
                  >
                    Add Progress
                  </Button>
                </div>
              </div>
            )}

            {/* Progress History */}
            <div className="space-y-3">
              {outcome.progress && outcome.progress.length > 0 ? (
                outcome.progress.map((entry, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {entry.recordedBy}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        {entry.percentageComplete > 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {entry.percentageComplete}%
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-900 mb-2">{entry.progress}</p>

                    {entry.evidence && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Evidence:</strong> {entry.evidence}
                      </p>
                    )}

                    {entry.nextSteps && entry.nextSteps.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Next Steps:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {entry.nextSteps.map((step, stepIndex) => (
                            <li
                              key={stepIndex}
                              className="flex items-center space-x-2"
                            >
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No progress entries yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
