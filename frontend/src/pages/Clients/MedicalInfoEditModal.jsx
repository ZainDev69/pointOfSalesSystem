import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Heart,
  AlertTriangle,
  Pill,
  Brain,
  ShieldCheck,
  Save,
} from "lucide-react";

const toInputDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

export function MedicalInfoEditModal({
  isOpen,
  onClose,
  medicalInfo,
  onSave,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    conditions: [],
    allergies: [],
    medications: [],
    mentalCapacity: {
      hasCapacity: true,
      assessmentDate: "",
      assessedBy: "",
      specificDecisions: [],
      supportNeeds: [],
      reviewDate: "",
      notes: "",
    },
    dnr: {
      hasDNR: false,
      dateIssued: "",
      issuedBy: "",
      reviewDate: "",
      location: "",
      familyAware: false,
      notes: "",
    },
  });

  useEffect(() => {
    if (medicalInfo) {
      setFormData({
        conditions: medicalInfo.conditions || [],
        allergies: medicalInfo.allergies || [],
        medications: medicalInfo.medications || [],
        mentalCapacity: {
          hasCapacity: medicalInfo.mentalCapacity?.hasCapacity ?? true,
          assessmentDate: medicalInfo.mentalCapacity?.assessmentDate || "",
          assessedBy: medicalInfo.mentalCapacity?.assessedBy || "",
          specificDecisions:
            medicalInfo.mentalCapacity?.specificDecisions || [],
          supportNeeds: medicalInfo.mentalCapacity?.supportNeeds || [],
          reviewDate: medicalInfo.mentalCapacity?.reviewDate || "",
          notes: medicalInfo.mentalCapacity?.notes || "",
        },
        dnr: {
          hasDNR: medicalInfo.dnr?.hasDNR ?? false,
          dateIssued: medicalInfo.dnr?.dateIssued || "",
          issuedBy: medicalInfo.dnr?.issuedBy || "",
          reviewDate: medicalInfo.dnr?.reviewDate || "",
          location: medicalInfo.dnr?.location || "",
          familyAware: medicalInfo.dnr?.familyAware ?? false,
          notes: medicalInfo.dnr?.notes || "",
        },
      });
    }
  }, [medicalInfo]);

  const handleNestedChange = (section, subsection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  // Medical Conditions
  const addCondition = () => {
    const newCondition = {
      id: Date.now().toString(),
      condition: "",
      diagnosisDate: "",
      severity: "mild",
      status: "active",
      notes: "",
    };
    setFormData((prev) => ({
      ...prev,
      conditions: [...prev.conditions, newCondition],
    }));
  };

  const updateCondition = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition
      ),
    }));
  };

  const removeCondition = (index) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
  };

  // Allergies
  const addAllergy = () => {
    const newAllergy = {
      id: Date.now().toString(),
      allergen: "",
      reaction: "",
      severity: "mild",
      treatment: "",
      notes: "",
    };
    setFormData((prev) => ({
      ...prev,
      allergies: [...prev.allergies, newAllergy],
    }));
  };

  const updateAllergy = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.map((allergy, i) =>
        i === index ? { ...allergy, [field]: value } : allergy
      ),
    }));
  };

  const removeAllergy = (index) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  // Medications
  const addMedication = () => {
    const newMedication = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      route: "",
      prescribedBy: "",
      startDate: "",
      indication: "",
      status: "active",
    };
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, newMedication],
    }));
  };

  const updateMedication = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((medication, i) =>
        i === index ? { ...medication, [field]: value } : medication
      ),
    }));
  };

  const removeMedication = (index) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (isLoading) return;
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Medical Information
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Medical Conditions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Medical Conditions
                </h3>
              </div>
              <button
                type="button"
                onClick={addCondition}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Condition</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.conditions.map((condition, index) => (
                <div
                  key={condition.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition
                      </label>
                      <input
                        type="text"
                        value={condition.condition}
                        onChange={(e) =>
                          updateCondition(index, "condition", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity
                      </label>
                      <select
                        value={condition.severity}
                        onChange={(e) =>
                          updateCondition(index, "severity", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={condition.status}
                        onChange={(e) =>
                          updateCondition(index, "status", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="resolved">Resolved</option>
                        <option value="monitoring">Monitoring</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diagnosis Date
                      </label>
                      <input
                        type="date"
                        value={condition.diagnosisDate}
                        onChange={(e) =>
                          updateCondition(
                            index,
                            "diagnosisDate",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={condition.notes}
                        onChange={(e) =>
                          updateCondition(index, "notes", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}

              {formData.conditions.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No medical conditions added yet. Click "Add Condition" to get
                  started.
                </p>
              )}
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Allergies
                </h3>
              </div>
              <button
                type="button"
                onClick={addAllergy}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Allergy</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.allergies.map((allergy, index) => (
                <div
                  key={allergy.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Allergen
                      </label>
                      <input
                        type="text"
                        value={allergy.allergen}
                        onChange={(e) =>
                          updateAllergy(index, "allergen", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reaction
                      </label>
                      <input
                        type="text"
                        value={allergy.reaction}
                        onChange={(e) =>
                          updateAllergy(index, "reaction", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity
                      </label>
                      <select
                        value={allergy.severity}
                        onChange={(e) =>
                          updateAllergy(index, "severity", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Treatment
                      </label>
                      <input
                        type="text"
                        value={allergy.treatment}
                        onChange={(e) =>
                          updateAllergy(index, "treatment", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={allergy.notes}
                        onChange={(e) =>
                          updateAllergy(index, "notes", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}

              {formData.allergies.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No allergies added yet. Click "Add Allergy" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Current Medications
                </h3>
              </div>
              <button
                type="button"
                onClick={addMedication}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.medications.map((medication, index) => (
                <div
                  key={medication.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medication Name
                      </label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) =>
                          updateMedication(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) =>
                          updateMedication(index, "dosage", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) =>
                          updateMedication(index, "frequency", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Route
                      </label>
                      <input
                        type="text"
                        value={medication.route}
                        onChange={(e) =>
                          updateMedication(index, "route", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prescribed By
                      </label>
                      <input
                        type="text"
                        value={medication.prescribedBy}
                        onChange={(e) =>
                          updateMedication(
                            index,
                            "prescribedBy",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={medication.startDate}
                        onChange={(e) =>
                          updateMedication(index, "startDate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Indication
                      </label>
                      <input
                        type="text"
                        value={medication.indication}
                        onChange={(e) =>
                          updateMedication(index, "indication", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}

              {formData.medications.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No medications added yet. Click "Add Medication" to get
                  started.
                </p>
              )}
            </div>
          </div>

          {/* Mental Capacity */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Mental Capacity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Date
                </label>
                <input
                  type="date"
                  value={formData.mentalCapacity.assessmentDate}
                  onChange={(e) =>
                    handleNestedChange(
                      "mentalCapacity",
                      "assessmentDate",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assessed By
                </label>
                <input
                  type="text"
                  value={formData.mentalCapacity.assessedBy}
                  onChange={(e) =>
                    handleNestedChange(
                      "mentalCapacity",
                      "assessedBy",
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
                  value={formData.mentalCapacity.reviewDate}
                  onChange={(e) =>
                    handleNestedChange(
                      "mentalCapacity",
                      "reviewDate",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasCapacity"
                  checked={formData.mentalCapacity.hasCapacity}
                  onChange={(e) =>
                    handleNestedChange(
                      "mentalCapacity",
                      "hasCapacity",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="hasCapacity"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Client has mental capacity
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.mentalCapacity.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "mentalCapacity",
                      "notes",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* DNR */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                DNR (Do Not Resuscitate)
              </h3>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="hasDNR"
                checked={formData.dnr.hasDNR}
                onChange={(e) =>
                  handleNestedChange("dnr", "hasDNR", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="hasDNR"
                className="ml-2 block text-sm text-gray-900"
              >
                Client has a Do Not Resuscitate order
              </label>
            </div>

            {formData.dnr.hasDNR && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Issued
                  </label>
                  <input
                    type="date"
                    value={toInputDate(formData.dnr.dateIssued)}
                    onChange={(e) =>
                      handleNestedChange("dnr", "dateIssued", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issued By
                  </label>
                  <input
                    type="text"
                    value={formData.dnr.issuedBy}
                    onChange={(e) =>
                      handleNestedChange("dnr", "issuedBy", e.target.value)
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
                    value={toInputDate(formData.dnr.reviewDate) || ""}
                    onChange={(e) =>
                      handleNestedChange("dnr", "reviewDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.dnr.location}
                    onChange={(e) =>
                      handleNestedChange("dnr", "location", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="familyAware"
                    checked={formData.dnr.familyAware}
                    onChange={(e) =>
                      handleNestedChange("dnr", "familyAware", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="familyAware"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Family is aware of DNR
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.dnr.notes}
                    onChange={(e) =>
                      handleNestedChange("dnr", "notes", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
