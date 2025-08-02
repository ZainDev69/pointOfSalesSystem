import { useSelector } from "react-redux";
import { useApp } from "../../../components/Context/AppContext";
import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { TextArea } from "../../../components/ui/TextArea";
import { User } from "lucide-react";

export function PersonalInfo({ formData, handleChange }) {
  const {
    titleOptions,
    genderOptions,
    relationshipStatusOptions,
    ethnicityOptions,
  } = useApp();
  const { clientOptionsLoading } = useSelector((state) => state.clients);

  const formatOptions = (arr) =>
    arr.map((opt) => ({ label: opt.label, value: opt.value }));

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <User className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Title"
          value={formData.personalDetails.title}
          onChange={(val) => handleChange("personalDetails", "title", val)}
          options={
            clientOptionsLoading
              ? [{ label: "Loading...", value: "" }]
              : formatOptions(titleOptions)
          }
        />

        <Input
          label="Full Name"
          value={formData.personalDetails.fullName}
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
          label="Date of Birth"
          type="date"
          value={formData.personalDetails.dateOfBirth}
          onChange={(val) =>
            handleChange("personalDetails", "dateOfBirth", val)
          }
        />

        <Select
          label="Gender"
          value={formData.personalDetails.gender}
          onChange={(val) => handleChange("personalDetails", "gender", val)}
          options={
            clientOptionsLoading
              ? [{ label: "Loading...", value: "" }]
              : formatOptions(genderOptions)
          }
        />

        <Input
          label="NHS Number"
          value={formData.personalDetails.nhsNumber}
          onChange={(val) => handleChange("personalDetails", "nhsNumber", val)}
        />

        <Select
          label="Marital Status"
          value={formData.personalDetails.relationshipStatus}
          onChange={(val) =>
            handleChange("personalDetails", "relationshipStatus", val)
          }
          options={
            clientOptionsLoading
              ? [{ label: "Loading...", value: "" }]
              : formatOptions(relationshipStatusOptions)
          }
        />

        <Select
          label="Ethnicity"
          value={formData.personalDetails.ethnicity}
          onChange={(val) => handleChange("personalDetails", "ethnicity", val)}
          options={
            clientOptionsLoading
              ? [{ label: "Loading...", value: "" }]
              : formatOptions(ethnicityOptions)
          }
        />

        <Input
          label="Start Date"
          type="date"
          value={formData.startDate || ""}
          onChange={() => {}}
          disabled
        />

        <Input
          label="Review Date"
          type="date"
          value={formData.reviewDate || ""}
          onChange={() => {}}
          disabled
        />

        <TextArea
          label="History & Background"
          value={formData.personalDetails.historyandBackground}
          onChange={(val) =>
            handleChange("personalDetails", "historyandBackground", val)
          }
          placeholder="The Clients Previous History and Background"
          full
        />
      </div>
    </div>
  );
}
