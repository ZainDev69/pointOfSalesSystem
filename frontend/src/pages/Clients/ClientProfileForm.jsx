import React, { useState } from "react";
import { ArrowLeft, Save, X, User, Phone } from "lucide-react";

export function ClientProfileForm({ client, onBack, onSave }) {
  const isEditing = !!client;
  const toInputDate = (val) => (val ? val.slice(0, 10) : "");

  const [formData, setFormData] = useState({
    personalDetails: {
      clientId: client?.clientId || "",
      fullName: client?.fullName || "",
      preferredName: client?.preferredName || "",
      dateOfBirth: toInputDate(client?.dateOfBirth),
      gender: client?.gender || "",
      pronouns: client?.pronouns || "",
    },
    contactInformation: {
      address: client?.address || "",
      phoneNumber: client?.phoneNumber || "",
      email: client?.emailAddress || "",
      nhsNumber: client?.nhsNumber || "",
    },
    additionalInformation: {
      ethnicity: client?.ethnicity || "",
      religion: client?.religion || "",
      relationshipStatus: client?.relationshipStatus || "",
      sexualOrientation: client?.sexualOrientation || "",
    },
    serviceInformation: {
      serviceStatus: client?.serviceStatus || "",
      startDate: toInputDate(client?.startDate),
      notes: client?.notes || "",
    },
  });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const clientData = {
      ...formData.personalDetails,
      ...formData.contactInformation,
      ...formData.additionalInformation,
      ...formData.serviceInformation,
      createdAt: client?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(clientData);
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
            {isEditing ? "Edit Client Profile" : "Add New Client"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update comprehensive client information"
              : "Create a new client record"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <Section
          title="Client Information"
          icon={<User className="w-5 h-5 text-gray-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Client ID"
              value={formData.personalDetails.clientId}
              required
              onChange={(val) =>
                handleChange("personalDetails", "clientId", val)
              }
            />
            <Input
              label="Full Name"
              value={formData.personalDetails.fullName}
              required
              onChange={(val) =>
                handleChange("personalDetails", "fullName", val)
              }
            />
            <Input
              label="Preferred Name"
              value={formData.personalDetails.preferredName}
              onChange={(val) =>
                handleChange("personalDetails", "preferredName", val)
              }
            />
            <Input
              type="date"
              label="Date of Birth *"
              value={formData.personalDetails.dateOfBirth}
              required
              onChange={(val) =>
                handleChange("personalDetails", "dateOfBirth", val)
              }
            />
            <Select
              label="Gender"
              value={formData.personalDetails.gender}
              onChange={(val) => handleChange("personalDetails", "gender", val)}
              options={[
                "Male",
                "Female",
                "Non-binary",
                "Other",
                "Prefer not to say",
              ]}
            />
            <Select
              label="Pronouns"
              value={formData.personalDetails.pronouns}
              onChange={(val) =>
                handleChange("personalDetails", "pronouns", val)
              }
              options={["He/Him", "She/Her", "They/Them", "Other"]}
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
              label="Address"
              value={formData.contactInformation.address}
              onChange={(val) =>
                handleChange("contactInformation", "address", val)
              }
              full
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.contactInformation.phoneNumber}
              required
              onChange={(val) =>
                handleChange("contactInformation", "phoneNumber", val)
              }
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.contactInformation.email}
              onChange={(val) =>
                handleChange("contactInformation", "email", val)
              }
            />
            <Input
              label="NHS Number"
              value={formData.contactInformation.nhsNumber}
              required
              onChange={(val) =>
                handleChange("contactInformation", "nhsNumber", val)
              }
            />
          </div>
        </Section>

        {/* Additional Information */}
        <Section
          title="Additional Information"
          icon={<Phone className="w-5 h-5 text-gray-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Ethnicity"
              value={formData.additionalInformation.ethnicity}
              onChange={(val) =>
                handleChange("additionalInformation", "ethnicity", val)
              }
              options={[
                "White British",
                "White Irish",
                "White Other",
                "Black Caribbean",
                "Black African",
                "Black Other",
                "Indian",
                "Pakistani",
                "Bangladeshi",
                "Chinese",
                "Mixed White/Black Caribbean",
                "Mixed White/Asian",
                "Other Mixed",
                "Other Asian",
                "Other",
                "Prefer Not to Say",
              ]}
            />
            <Select
              label="Religion"
              value={formData.additionalInformation.religion}
              onChange={(val) =>
                handleChange("additionalInformation", "religion", val)
              }
              options={[
                "Islam",
                "Christianity",
                "Hinduism",
                "Sikhism",
                "Judaism",
                "Buddhism",
                "No religion",
                "Other",
                "Prefer Not to Say",
              ]}
            />
            <Select
              label="Relationship Status"
              value={formData.additionalInformation.relationshipStatus}
              onChange={(val) =>
                handleChange("additionalInformation", "relationshipStatus", val)
              }
              options={[
                "Single",
                "Married",
                "Civil Partnership",
                "Divorced",
                "Widowed",
                "Separated",
                "Other",
                "Prefer Not to Say",
              ]}
            />
            <Select
              label="Sexual Orientation"
              value={formData.additionalInformation.sexualOrientation}
              onChange={(val) =>
                handleChange("additionalInformation", "sexualOrientation", val)
              }
              options={[
                "Heterosexual",
                "Gay",
                "Lesbian",
                "Bisexual",
                "Other",
                "Prefer Not to Say",
              ]}
            />
          </div>
        </Section>

        {/* Service Information */}
        <Section
          title="Service Information"
          icon={<Phone className="w-5 h-5 text-gray-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formData.serviceInformation.serviceStatus}
              onChange={(val) =>
                handleChange("serviceInformation", "serviceStatus", val)
              }
              options={["Active", "Inactive", "Hospitalized", "Carehome"]}
            />
            <Input
              type="date"
              label="Start Date"
              value={formData.serviceInformation.startDate}
              required
              onChange={(val) =>
                handleChange("serviceInformation", "startDate", val)
              }
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                rows={3}
                value={formData.serviceInformation.notes}
                onChange={(e) =>
                  handleChange("serviceInformation", "notes", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Section>

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
            <span>{isEditing ? "Update Profile" : "Create Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable UI Components
const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center space-x-2 mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  full = false,
}) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
