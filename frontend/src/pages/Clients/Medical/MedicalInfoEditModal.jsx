import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Heart,
  AlertTriangle,
  Pill,
  Brain,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Section } from "../../../components/ui/Section";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { TextArea } from "../../../components/ui/TextArea";
import { Checkbox } from "../../../components/ui/Checkbox";
import { useSelector } from "react-redux";
import { useApp } from "../../../components/Context/AppContext";

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
    medicalInformation: {
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
    },
  });

  const { clientOptionsLoading } = useSelector((state) => state.clients);
  const {
    conditionSeverityOptions,
    conditionStatusOptions,
    allergySeverityOptions,
    medicationRouteOptions,
  } = useApp();

  useEffect(() => {
    if (medicalInfo) {
      setFormData({
        medicalInformation: {
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
        },
      });
    }
  }, [medicalInfo]);

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [section]: {
          ...prev.medicalInformation[section],
          [field]: value,
        },
      },
    }));
  };

  // -------- Conditions Logic --------
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
      medicalInformation: {
        ...prev.medicalInformation,
        conditions: [...prev.medicalInformation.conditions, newCondition],
      },
    }));
  };

  const updateCondition = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        conditions: prev.medicalInformation.conditions.map((condition, i) =>
          i === index ? { ...condition, [field]: value } : condition
        ),
      },
    }));
  };

  const removeCondition = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        conditions: prev.medicalInformation.conditions.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  // -------- Allergy Logic --------
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
      medicalInformation: {
        ...prev.medicalInformation,
        allergies: [...prev.medicalInformation.allergies, newAllergy],
      },
    }));
  };

  const updateAllergy = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        allergies: prev.medicalInformation.allergies.map((allergy, i) =>
          i === index ? { ...allergy, [field]: value } : allergy
        ),
      },
    }));
  };

  const removeAllergy = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        allergies: prev.medicalInformation.allergies.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  // -------- Medications Logic --------
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
      medicalInformation: {
        ...prev.medicalInformation,
        medications: [...prev.medicalInformation.medications, newMedication],
      },
    }));
  };

  const updateMedication = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        medications: prev.medicalInformation.medications.map((med, i) =>
          i === index ? { ...med, [field]: value } : med
        ),
      },
    }));
  };

  const removeMedication = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        medications: prev.medicalInformation.medications.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleSave = async () => {
    if (isLoading) return;
    await onSave(formData.medicalInformation);
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
          <Section
            icon={<Heart className="w-5 h-5 text-red-500" />}
            title="Medical Conditions"
          >
            <div className="flex justify-end mb-4">
              <Button
                onClick={addCondition}
                variant="default"
                style={{ minWidth: 180 }}
              >
                Add Condition
              </Button>
            </div>

            <div className="space-y-4">
              {formData.medicalInformation.conditions.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Condition"
                      value={item.condition}
                      onChange={(v) => updateCondition(index, "condition", v)}
                    />

                    <Select
                      label="Severity"
                      value={item.severity}
                      onChange={(v) => updateCondition(index, "severity", v)}
                      options={
                        clientOptionsLoading
                          ? ["Loading options..."]
                          : conditionSeverityOptions
                      }
                      disabled={clientOptionsLoading}
                    />

                    <Select
                      label="Status"
                      value={item.status}
                      onChange={(v) => updateCondition(index, "status", v)}
                      options={
                        clientOptionsLoading
                          ? ["Loading options..."]
                          : conditionStatusOptions
                      }
                      disabled={clientOptionsLoading}
                    />
                    <Input
                      type="date"
                      label="Diagnosis Date"
                      value={item.diagnosisDate}
                      onChange={(v) =>
                        updateCondition(index, "diagnosisDate", v)
                      }
                    />
                    <Input
                      label="Notes"
                      value={item.notes}
                      onChange={(v) => updateCondition(index, "notes", v)}
                      full
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => removeCondition(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Allergies */}
          <Section
            icon={<AlertTriangle className="w-5 h-5 text-yellow-500" />}
            title="Allergies"
          >
            <div className="flex justify-end mb-4">
              <Button
                onClick={addAllergy}
                variant="default"
                style={{ minWidth: 180 }}
              >
                Add Allergy
              </Button>
            </div>

            <div className="space-y-4">
              {formData.medicalInformation.allergies.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Allergen"
                      value={item.allergen}
                      onChange={(v) => updateAllergy(index, "allergen", v)}
                    />
                    <Input
                      label="Reaction"
                      value={item.reaction}
                      onChange={(v) => updateAllergy(index, "reaction", v)}
                    />

                    <Select
                      label="Severity"
                      value={item.severity}
                      onChange={(v) => updateAllergy(index, "severity", v)}
                      options={
                        clientOptionsLoading
                          ? ["Loading options..."]
                          : allergySeverityOptions
                      }
                      disabled={clientOptionsLoading}
                    />
                    <Input
                      label="Treatment"
                      value={item.treatment}
                      onChange={(v) => updateAllergy(index, "treatment", v)}
                    />
                    <Input
                      label="Notes"
                      value={item.notes}
                      onChange={(v) => updateAllergy(index, "notes", v)}
                      full
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => removeAllergy(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Medications */}
          <Section
            icon={<Pill className="w-5 h-5 text-purple-500" />}
            title="Medications"
          >
            <div className="flex justify-end mb-4">
              <Button
                onClick={addMedication}
                variant="default"
                style={{ minWidth: 180 }}
              >
                Add Medication
              </Button>
            </div>

            <div className="space-y-4">
              {formData.medicalInformation.medications.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Name"
                      value={item.name}
                      onChange={(v) => updateMedication(index, "name", v)}
                    />
                    <Input
                      label="Dosage"
                      value={item.dosage}
                      onChange={(v) => updateMedication(index, "dosage", v)}
                    />
                    <Input
                      label="Frequency"
                      value={item.frequency}
                      onChange={(v) => updateMedication(index, "frequency", v)}
                    />

                    <Select
                      label="Route"
                      value={item.route}
                      onChange={(v) => updateMedication(index, "route", v)}
                      options={
                        clientOptionsLoading
                          ? ["Loading options..."]
                          : medicationRouteOptions
                      }
                      disabled={clientOptionsLoading}
                    />
                    <Input
                      label="Prescribed By"
                      value={item.prescribedBy}
                      onChange={(v) =>
                        updateMedication(index, "prescribedBy", v)
                      }
                    />
                    <Input
                      type="date"
                      label="Start Date"
                      value={item.startDate}
                      onChange={(v) => updateMedication(index, "startDate", v)}
                    />
                    <Input
                      label="Indication"
                      value={item.indication}
                      onChange={(v) => updateMedication(index, "indication", v)}
                      full
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Mental Capacity */}
          <Section
            icon={<Brain className="w-5 h-5 text-blue-500" />}
            title="Mental Capacity"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Assessment Date"
                value={
                  formData.medicalInformation.mentalCapacity.assessmentDate
                }
                onChange={(v) =>
                  handleNestedChange("mentalCapacity", "assessmentDate", v)
                }
              />
              <Input
                label="Assessed By"
                value={formData.medicalInformation.mentalCapacity.assessedBy}
                onChange={(v) =>
                  handleNestedChange("mentalCapacity", "assessedBy", v)
                }
              />
              <Input
                type="date"
                label="Review Date"
                value={formData.medicalInformation.mentalCapacity.reviewDate}
                onChange={(v) =>
                  handleNestedChange("mentalCapacity", "reviewDate", v)
                }
              />
              <Checkbox
                id="hasCapacity"
                label="Client has mental capacity"
                checked={formData.medicalInformation.mentalCapacity.hasCapacity}
                onChange={(v) =>
                  handleNestedChange("mentalCapacity", "hasCapacity", v)
                }
              />
              <TextArea
                label="Notes"
                value={formData.medicalInformation.mentalCapacity.notes}
                onChange={(v) =>
                  handleNestedChange("mentalCapacity", "notes", v)
                }
                full
              />
            </div>
          </Section>

          {/* DNR */}
          <Section
            icon={<ShieldCheck className="w-5 h-5 text-gray-700" />}
            title="DNR (Do Not Resuscitate)"
          >
            <Checkbox
              id="hasDNR"
              label="Client has a Do Not Resuscitate order"
              checked={formData.medicalInformation.dnr.hasDNR}
              onChange={(v) => handleNestedChange("dnr", "hasDNR", v)}
            />

            {formData.medicalInformation.dnr.hasDNR && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  type="date"
                  label="Date Issued"
                  value={toInputDate(
                    formData.medicalInformation.dnr.dateIssued
                  )}
                  onChange={(v) => handleNestedChange("dnr", "dateIssued", v)}
                />
                <Input
                  label="Issued By"
                  value={formData.medicalInformation.dnr.issuedBy}
                  onChange={(v) => handleNestedChange("dnr", "issuedBy", v)}
                />
                <Input
                  type="date"
                  label="Review Date"
                  value={toInputDate(
                    formData.medicalInformation.dnr.reviewDate
                  )}
                  onChange={(v) => handleNestedChange("dnr", "reviewDate", v)}
                />
                <Input
                  label="Location"
                  value={formData.medicalInformation.dnr.location}
                  onChange={(v) => handleNestedChange("dnr", "location", v)}
                />
                <Checkbox
                  id="familyAware"
                  label="Family is aware of DNR"
                  checked={formData.medicalInformation.dnr.familyAware}
                  onChange={(v) => handleNestedChange("dnr", "familyAware", v)}
                />
                <TextArea
                  label="Notes"
                  value={formData.medicalInformation.dnr.notes}
                  onChange={(v) => handleNestedChange("dnr", "notes", v)}
                  full
                />
              </div>
            )}
          </Section>
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
          <Button onClick={handleSave} disabled={isLoading} variant="default">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
