import { Phone } from "lucide-react";
import { Input } from "../../../components/ui/Input";

export function PersonalPrefInfo({ formData, handleNestedChange }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Phone className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Personal Preferences
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Wake Up Time"
          value={formData.preferences.personal.wakeUpTime}
          onChange={(val) =>
            handleNestedChange("prefrences", "personal", "wakeUpTime", val)
          }
        />

        <Input
          label="Bed Time"
          value={formData.preferences.personal.bedTime}
          onChange={(val) =>
            handleNestedChange("prefrences", "personal", "bedTime", val)
          }
        />

        <Input
          label="Hobbies & Interests"
          value={formData.preferences.personal.hobbies}
          onChange={(val) =>
            handleNestedChange("prefrences", "personal", "hobbies", val)
          }
        />

        <Input
          label="Mobility Aids"
          value={formData.preferences.personal.mobilityAids}
          onChange={(val) =>
            handleNestedChange("prefrences", "personal", "mobilityAids", val)
          }
        />

        <Input
          label="Likes & Dislikes"
          value={formData.preferences.personal.likesAndDislikes}
          onChange={(val) =>
            handleNestedChange(
              "prefrences",
              "personal",
              "likesAndDislikes",
              val
            )
          }
        />
      </div>
    </div>
  );
}
