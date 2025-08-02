import { Shield } from "lucide-react";
import { Checkbox } from "../../../components/ui/Checkbox";

export function ConsentInfo({ formData, handleChange }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Consent & Permissions
        </h3>
      </div>

      <div className="space-y-4">
        <Checkbox
          id="photoConsent"
          label="Photo Consent - Client consents to having their photo taken"
          checked={formData.consent.photoConsent}
          onChange={(val) => handleChange("consent", "photoConsent", val)}
        />

        <Checkbox
          id="dataProcessingConsent"
          label="Data Processing Consent - Client consents to data processing"
          checked={formData.consent.dataProcessingConsent}
          onChange={(val) =>
            handleChange("consent", "dataProcessingConsent", val)
          }
        />
      </div>
    </div>
  );
}
