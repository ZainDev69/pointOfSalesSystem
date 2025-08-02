import { useSelector } from "react-redux";
import { useApp } from "../../../components/Context/AppContext";
import { Phone } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";

export function DietaryInfo({ formData, handleNestedChange }) {
  const { clientOptionsLoading } = useSelector((state) => state.clients);
  const { assistanceLevelOptions } = useApp();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Phone className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Dietary Requirements
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Diet Type"
          value={formData.preferences.dietary.dietType}
          onChange={(val) =>
            handleNestedChange("preferences", "dietary", "dietType", val)
          }
        />

        <Select
          label="Assistance Level"
          value={formData.preferences.dietary.assistanceLevel}
          onChange={(val) =>
            handleNestedChange("preferences", "dietary", "assistanceLevel", val)
          }
          disabled={clientOptionsLoading}
          options={clientOptionsLoading ? [] : assistanceLevelOptions}
        />

        <Input
          label="Food Preferences"
          value={formData.preferences.dietary.preferences}
          onChange={(val) =>
            handleNestedChange("preferences", "dietary", "preferences", val)
          }
        />

        <Input
          label="Food Dislikes"
          value={formData.preferences.dietary.dislikes}
          onChange={(val) =>
            handleNestedChange("preferences", "dietary", "dislikes", val)
          }
        />

        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="textureModification"
              checked={formData.preferences.dietary.textureModification}
              onChange={(e) =>
                handleNestedChange(
                  "preferences",
                  "dietary",
                  "textureModification",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="textureModification"
              className="ml-2 block text-sm text-gray-900"
            >
              Requires Texture Modification
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="fluidThickening"
              checked={formData.preferences.dietary.fluidThickening}
              onChange={(e) =>
                handleNestedChange(
                  "preferences",
                  "dietary",
                  "fluidThickening",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="fluidThickening"
              className="ml-2 block text-sm text-gray-900"
            >
              Requires Fluid Thickening
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
