import { Phone } from "lucide-react";
import { Input } from "../../../components/ui/Input";

export function CultureInfo({ formData, handleNestedChange }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Phone className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Cultural Preferences
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Cultural Background"
          value={formData.preferences.cultural.background}
          onChange={(val) =>
            handleNestedChange("prefrences", "cultural", "background", val)
          }
        />

        <Input
          label="Language Preferences"
          value={formData.preferences.cultural.languagePreferences}
          onChange={(val) =>
            handleNestedChange(
              "prefrences",
              "cultural",
              "languagePreferences",
              val
            )
          }
        />

        <Input
          label="Cultural Needs"
          value={formData.preferences.cultural.culturalNeeds}
          onChange={(val) =>
            handleNestedChange("prefrences", "cultural", "culturalNeeds", val)
          }
        />
      </div>
    </div>
  );
}
