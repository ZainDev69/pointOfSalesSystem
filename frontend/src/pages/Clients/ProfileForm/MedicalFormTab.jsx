import { Button } from "../../../components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import { Section } from "../../../components/ui/Section";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { useSelector } from "react-redux";
import { useApp } from "../../../components/Context/AppContext";

export function MedicalFormTab({ formData, setFormData }) {
  const { clientOptionsLoading } = useSelector((state) => state.clients);

  const {
    conditionSeverityOptions,
    conditionStatusOptions,
    allergySeverityOptions,
    medicationRouteOptions,
  } = useApp();

  const addItem = (type, item) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [type]: [...prev.medicalInformation[type], item],
      },
    }));
  };

  const updateItem = (type, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [type]: prev.medicalInformation[type].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const removeItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [type]: prev.medicalInformation[type].filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <Section
        icon={<Plus className="w-5 h-5 text-blue-500" />}
        title="Medical Conditions"
      >
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            onClick={() =>
              addItem("conditions", {
                id: Date.now().toString(),
                condition: "",
                diagnosisDate: "",
                severity: "mild",
                status: "active",
                notes: "",
              })
            }
            variant="default"
            icon={Plus}
            style={{ minWidth: 180 }}
          >
            Add Condition
          </Button>
        </div>
        {formData.medicalInformation.conditions.map((item, i) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Condition"
                value={item.condition}
                onChange={(val) =>
                  updateItem("conditions", i, "condition", val)
                }
              />

              <Select
                label="Severity"
                value={item.severity}
                onChange={(val) => updateItem("conditions", i, "severity", val)}
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
                onChange={(val) => updateItem("conditions", i, "status", val)}
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
                onChange={(val) =>
                  updateItem("conditions", i, "diagnosisDate", val)
                }
              />
              <Input
                label="Notes"
                value={item.notes}
                onChange={(val) => updateItem("conditions", i, "notes", val)}
                full
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeItem("conditions", i)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
        {formData.medicalInformation.conditions.length === 0 && (
          <p className="text-center text-gray-500">
            No medical conditions added yet.
          </p>
        )}
      </Section>

      <Section
        icon={<Plus className="w-5 h-5 text-blue-500" />}
        title="Allergies"
      >
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            onClick={() =>
              addItem("allergies", {
                id: Date.now().toString(),
                allergen: "",
                reaction: "",
                severity: "mild",
                treatment: "",
                notes: "",
              })
            }
            variant="default"
            icon={Plus}
            style={{ minWidth: 180 }}
          >
            Add Allergy
          </Button>
        </div>
        {formData.medicalInformation.allergies.map((item, i) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Allergen"
                value={item.allergen}
                onChange={(val) => updateItem("allergies", i, "allergen", val)}
              />
              <Input
                label="Reaction"
                value={item.reaction}
                onChange={(val) => updateItem("allergies", i, "reaction", val)}
              />
              <Select
                label="Severity"
                value={item.severity}
                onChange={(val) => updateItem("allergies", i, "severity", val)}
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
                onChange={(val) => updateItem("allergies", i, "treatment", val)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeItem("allergies", i)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
        {formData.medicalInformation.allergies.length === 0 && (
          <p className="text-center text-gray-500">No allergies added yet.</p>
        )}
      </Section>

      <Section
        icon={<Plus className="w-5 h-5 text-blue-500" />}
        title="Medications"
      >
        <div className="flex justify-end mb-4">
          <Button
            type="button"
            onClick={() =>
              addItem("medications", {
                id: Date.now().toString(),
                name: "",
                dosage: "",
                frequency: "",
                route: "",
                prescribedBy: "",
                startDate: "",
                indication: "",
                status: "active",
              })
            }
            variant="default"
            icon={Plus}
          >
            Add Medication
          </Button>
        </div>
        {formData.medicalInformation.medications.map((item, i) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Medication Name"
                value={item.name}
                onChange={(val) => updateItem("medications", i, "name", val)}
              />
              <Input
                label="Dosage"
                value={item.dosage}
                onChange={(val) => updateItem("medications", i, "dosage", val)}
              />
              <Input
                label="Frequency"
                value={item.frequency}
                onChange={(val) =>
                  updateItem("medications", i, "frequency", val)
                }
              />
              <Select
                label="Route"
                value={item.route}
                onChange={(val) => updateItem("medications", i, "route", val)}
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
                onChange={(val) =>
                  updateItem("medications", i, "prescribedBy", val)
                }
              />
              <Input
                type="date"
                label="Start Date"
                value={item.startDate}
                onChange={(val) =>
                  updateItem("medications", i, "startDate", val)
                }
              />
              <Input
                label="Indication"
                value={item.indication}
                onChange={(val) =>
                  updateItem("medications", i, "indication", val)
                }
                full
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeItem("medications", i)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
        {formData.medicalInformation.medications.length === 0 && (
          <p className="text-center text-gray-500">No medications added yet.</p>
        )}
      </Section>
    </div>
  );
}
