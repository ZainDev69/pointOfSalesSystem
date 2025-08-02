import { MapPin } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { TextArea } from "../../../components/ui/TextArea";

export function AddressInfo({ formData, handleChange }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Address Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Address"
          value={formData.addressInformation.address}
          onChange={(val) => handleChange("addressInformation", "address", val)}
          full
        />

        <Input
          label="City"
          value={formData.addressInformation.city}
          onChange={(val) => handleChange("addressInformation", "city", val)}
        />

        <Input
          label="County"
          value={formData.addressInformation.county}
          onChange={(val) => handleChange("addressInformation", "county", val)}
        />

        <Input
          label="Post Code"
          value={formData.addressInformation.postCode}
          onChange={(val) =>
            handleChange("addressInformation", "postCode", val)
          }
        />

        <Input
          label="Country"
          value={formData.addressInformation.country}
          onChange={(val) => handleChange("addressInformation", "country", val)}
        />

        <TextArea
          label="Access Instructions"
          value={formData.addressInformation.accessInstructions}
          onChange={(val) =>
            handleChange("addressInformation", "accessInstructions", val)
          }
          placeholder="Any special instructions for accessing the property..."
          full
        />
      </div>
    </div>
  );
}
