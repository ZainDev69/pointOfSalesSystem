import { useState } from "react";
import { Section } from "../../../components/ui/Section";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";
import { User, MapPin, Phone } from "lucide-react";
import { useApp } from "../../../components/Context/AppContext";
import { useSelector } from "react-redux";

export function PersonalFormTab({
  setFormData,
  client,
  formData,
  checkingClientId,
  clientIdExists,
}) {
  const [isPvt, setIsPvt] = useState(false);
  const isEditing = !!client;

  const { clientOptionsLoading } = useSelector((state) => state.clients);

  const {
    titleOptions,
    genderOptions,
    statusOptions,
    relationshipStatusOptions,
    ethnicityOptions,
    contactMethodOptions,
  } = useApp();

  // Handle checkbox toggle
  const handlePvtToggle = (checked) => {
    setIsPvt(checked);
    setFormData((prev) => {
      let newId = prev.clientId;
      if (checked && !newId.startsWith("PVT")) {
        newId = "PVT" + newId.replace(/^PVT/, "");
      } else if (!checked && newId.startsWith("PVT")) {
        newId = newId.replace(/^PVT/, "");
      }
      return { ...prev, clientId: newId };
    });
  };

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };
  return (
    <div className="space-y-6">
      <Section
        title="Basic Information"
        icon={<User className="w-5 h-5 text-gray-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <Checkbox
              id="pvt-checkbox"
              checked={isPvt}
              disabled={isEditing}
              label={`Prefix Client ID with PVT ${
                isEditing ? "(cannot be changed when editing)" : ""
              }`}
              onChange={handlePvtToggle}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <Input
              label="Client ID"
              value={formData.clientId}
              required
              disabled={isEditing}
              placeholder={
                isEditing
                  ? "Client ID cannot be changed"
                  : "Leave blank to auto-generate ID"
              }
              onChange={(val) => {
                if (isEditing) return; // Prevent changes when editing
                let newVal = val.replace(/^PVT+/, "");
                if (isPvt) newVal = "PVT" + newVal;
                setFormData((prev) => ({ ...prev, clientId: newVal }));
              }}
            />
            {checkingClientId && !isEditing && (
              <span className="text-xs text-blue-500">
                Checking Client ID...
              </span>
            )}
            {clientIdExists && !isEditing && (
              <span className="text-xs text-red-500">
                This Client ID already exists!
              </span>
            )}
            {isEditing && (
              <span className="text-xs text-gray-500">
                Client ID cannot be modified when editing
              </span>
            )}
          </div>
          <Select
            label="Title"
            value={formData.personalDetails.title}
            onChange={(val) => handleChange("personalDetails", "title", val)}
            options={
              clientOptionsLoading ? ["Loading options..."] : titleOptions
            }
            disabled={clientOptionsLoading}
          />
          <Input
            label="Full Name"
            value={formData.personalDetails.fullName}
            required
            onChange={(val) => handleChange("personalDetails", "fullName", val)}
          />
          <Input
            label="Preferred Name"
            value={formData.personalDetails.preferredName}
            onChange={(val) =>
              handleChange("personalDetails", "preferredName", val)
            }
          />
          <Input
            label="Date of Birth *"
            type="date"
            value={formData.personalDetails.dateOfBirth}
            required
            onChange={(val) =>
              handleChange("personalDetails", "dateOfBirth", val)
            }
          />
          <Input
            label="NHS Number"
            value={formData.personalDetails.nhsNumber}
            required
            onChange={(val) =>
              handleChange("personalDetails", "nhsNumber", val)
            }
          />
          <Select
            label="Gender"
            value={formData.personalDetails.gender}
            onChange={(val) => handleChange("personalDetails", "gender", val)}
            options={
              clientOptionsLoading ? ["Loading options..."] : genderOptions
            }
            disabled={clientOptionsLoading}
          />
          <Select
            label="Relationship Status"
            value={formData.personalDetails.relationshipStatus}
            onChange={(val) =>
              handleChange("personalDetails", "relationshipStatus", val)
            }
            options={
              clientOptionsLoading
                ? ["Loading options..."]
                : relationshipStatusOptions
            }
            disabled={clientOptionsLoading}
          />
          <Select
            label="Ethnicity"
            value={formData.personalDetails.ethnicity}
            onChange={(val) =>
              handleChange("personalDetails", "ethnicity", val)
            }
            options={
              clientOptionsLoading ? ["Loading options..."] : ethnicityOptions
            }
            disabled={clientOptionsLoading}
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, status: val }))
            }
            options={
              clientOptionsLoading ? ["Loading options..."] : statusOptions
            }
            disabled={clientOptionsLoading}
          />
          <Input
            label="History & Background"
            placeholder={"Enter the history and background of the client"}
            value={formData.personalDetails.historyandBackground}
            required
            onChange={(val) =>
              handleChange("personalDetails", "historyandBackground", val)
            }
          />
        </div>
      </Section>

      {/* Address Information */}
      <Section
        title="Address Information"
        icon={<MapPin className="w-5 h-5 text-gray-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Address"
            type="text"
            required
            value={formData.addressInformation.address}
            onChange={(val) =>
              handleChange("addressInformation", "address", val)
            }
            full
          />
          <Input
            label="City"
            type="text"
            value={formData.addressInformation.city}
            required
            onChange={(val) => handleChange("addressInformation", "city", val)}
          />
          <Input
            label="County"
            type="text"
            value={formData.addressInformation.county}
            onChange={(val) =>
              handleChange("addressInformation", "county", val)
            }
          />
          <Input
            label="Post Code"
            type="text"
            value={formData.addressInformation.postCode}
            onChange={(val) =>
              handleChange("addressInformation", "postCode", val)
            }
          />
          <Input
            label="Country"
            placeholder={"Enter the name of your country"}
            value={formData.addressInformation.country}
            onChange={(val) =>
              handleChange("addressInformation", "country", val)
            }
          />

          <Input
            label="Access Instructions"
            type="text"
            placeholder={"Special instructions for accessing the Property"}
            value={formData.addressInformation.accessInstructions}
            onChange={(val) =>
              handleChange("addressInformation", "accessInstructions", val)
            }
          />
        </div>
      </Section>

      {/* Contact Information */}
      <Section
        title="Contact Information"
        icon={<Phone className="w-5 h-5 text-gray-400" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Primary Phone*"
            type="text"
            value={formData.contactInformation.primaryPhone}
            required
            onChange={(val) =>
              handleChange("contactInformation", "primaryPhone", val)
            }
          />
          <Input
            label="Secondary Phone"
            type="text"
            value={formData.contactInformation.secondaryPhone}
            onChange={(val) =>
              handleChange("contactInformation", "secondaryPhone", val)
            }
          />
          <Input
            label="Email"
            type="email"
            value={formData.contactInformation.email}
            onChange={(val) => handleChange("contactInformation", "email", val)}
          />
          <Select
            label="Preferred Contact Method"
            value={formData.contactInformation.preferredContactMethod}
            onChange={(val) =>
              handleChange("contactInformation", "preferredContactMethod", val)
            }
            options={
              clientOptionsLoading
                ? ["Loading options..."]
                : contactMethodOptions
            }
            disabled={clientOptionsLoading}
          />
          <Input
            label="Best Time to Contact"
            type="text"
            placeholder="e.g, Weekday Mornings,Evenings after 6pm"
            value={formData.contactInformation.bestTimeToContact}
            onChange={(val) =>
              handleChange("contactInformation", "bestTimeToContact", val)
            }
          />
        </div>
      </Section>

      {/* Consent & Data Processing */}
      <Section
        title="Consent & Data Processing"
        icon={<User className="w-5 h-5 text-gray-400" />}
      >
        <div className="md:col-span-2 space-y-3">
          <Checkbox
            label="
Consent to photography for care documentation"
            checked={formData.consent.photoConsent}
            onChange={(val) => handleChange("consent", "photoConsent", val)}
          />
          <Checkbox
            label="Consent to data processing for care provision (Required)"
            checked={formData.consent.dataProcessingConsent}
            onChange={(val) =>
              handleChange("consent", "dataProcessingConsent", val)
            }
          />
        </div>
      </Section>
    </div>
  );
}
