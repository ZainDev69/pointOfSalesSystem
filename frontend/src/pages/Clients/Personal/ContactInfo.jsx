import { useSelector } from "react-redux";
import { useApp } from "../../../components/Context/AppContext";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Phone } from "lucide-react";

export function ContactInfo({ formData, handleChange }) {
  const { clientOptionsLoading } = useSelector((state) => state.clients);
  const { contactMethodOptions } = useApp();

  const formatOptions = (arr) =>
    arr.map((opt) => ({ label: opt.label, value: opt.value }));

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Phone className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Contact Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Primary Phone"
          type="tel"
          value={formData.contactInformation.primaryPhone}
          onChange={(val) =>
            handleChange("contactInformation", "primaryPhone", val)
          }
        />

        <Input
          label="Secondary Phone"
          type="tel"
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
              ? [{ label: "Loading...", value: "" }]
              : formatOptions(contactMethodOptions)
          }
        />

        <Input
          label="Best time to Contact"
          value={formData.contactInformation.bestTimeToContact}
          onChange={(val) =>
            handleChange("contactInformation", "bestTimeToContact", val)
          }
        />
      </div>
    </div>
  );
}
