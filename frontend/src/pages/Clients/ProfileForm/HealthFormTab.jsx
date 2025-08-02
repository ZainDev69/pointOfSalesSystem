import { Heart } from "lucide-react";
import { Input } from "../../../components/ui/Input";

export function HealthFormTab({ formData, handleNestedChange }) {
  return (
    <div className="space-y-6">
      {/* GP Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            General Practitioner
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="GP Name *"
            required
            value={formData.healthcareContacts.gp.name}
            onChange={(e) =>
              handleNestedChange(
                "healthcareContacts",
                "gp",
                "name",
                e.target.value
              )
            }
          />
          <Input
            label="Surgery Name *"
            required
            value={formData.healthcareContacts.surgery.name}
            onChange={(e) =>
              handleNestedChange(
                "healthcareContacts",
                "surgery",
                "name",
                e.target.value
              )
            }
          />
          <Input
            label="Phone *"
            type="tel"
            required
            value={formData.healthcareContacts.gp.phone}
            onChange={(e) =>
              handleNestedChange(
                "healthcareContacts",
                "gp",
                "phone",
                e.target.value
              )
            }
          />
          <Input
            label="Email"
            type="email"
            value={formData.healthcareContacts.gp.email}
            onChange={(e) =>
              handleNestedChange(
                "healthcareContacts",
                "gp",
                "email",
                e.target.value
              )
            }
          />
        </div>
      </div>

      {/* Surgery Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Surgery Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Surgery Phone"
            type="tel"
            value={formData.healthcareContacts.surgery.phone}
            onChange={(e) =>
              handleNestedChange(
                "healthcareContacts",
                "surgery",
                "phone",
                e.target.value
              )
            }
          />
          <Input
            label="Out of Hours Number"
            type="tel"
            value={formData.healthcareContacts.surgery.outOfHoursNumber}
            onChange={(e) =>
              handleNestedChange(
                "healthcareContacts",
                "surgery",
                "outOfHoursNumber",
                e.target.value
              )
            }
          />
          <Input
            label="Surgery Address"
            className="md:col-span-2"
            value={formData.healthcareContacts.surgery.address}
            onChange={(e) =>
              handleNestedChange(
                "healthcareContacts",
                "surgery",
                "address",
                e.target.value
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
