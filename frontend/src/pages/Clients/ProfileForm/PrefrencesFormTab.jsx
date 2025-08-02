import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { TextArea } from "../../../components/ui/TextArea";
import { Checkbox } from "../../../components/ui/Checkbox";
import { useSelector } from "react-redux";
import { useApp } from "../../../components/Context/AppContext";

export function PrefrencesFormTab({ formData, handleNestedChange }) {
  const { clientOptionsLoading } = useSelector((state) => state.clients);

  const { practiceLevelOptions, assistanceLevelOptions } = useApp();
  return (
    <div className="space-y-6">
      {/* Cultural Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cultural Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cultural Background"
            value={formData.preferences.cultural.background}
            onChange={(val) =>
              handleNestedChange("preferences", "cultural", "background", val)
            }
          />

          <Input
            label="Language Preferences"
            value={formData.preferences.cultural.languagePreferences.join(", ")}
            placeholder="English, Spanish, etc."
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "cultural",
                "languagePreferences",
                val.split(", ")
              )
            }
          />

          <TextArea
            label="Cultural Needs"
            value={formData.preferences.cultural.culturalNeeds.join(", ")}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "cultural",
                "culturalNeeds",
                val.split(", ")
              )
            }
            placeholder="Specific cultural requirements or considerations..."
            rows={3}
            full
          />
        </div>
      </div>

      {/* Religious Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Religious Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Religion"
            value={formData.preferences.religious.religion}
            onChange={(val) =>
              handleNestedChange("preferences", "religious", "religion", val)
            }
          />

          <Input
            label="Denomination"
            value={formData.preferences.religious.denomination}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "religious",
                "denomination",
                val
              )
            }
          />

          <Select
            label="Practice Level"
            value={formData.preferences.religious.practiceLevel}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "religious",
                "practiceLevel",
                val
              )
            }
            options={
              clientOptionsLoading
                ? ["Loading options..."]
                : practiceLevelOptions
            }
            disabled={clientOptionsLoading}
          />

          <Checkbox
            id="spiritualSupport"
            label="Requires spiritual support"
            checked={formData.preferences.religious.spiritualSupport}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "religious",
                "spiritualSupport",
                val
              )
            }
          />

          <TextArea
            label="Prayer Requirements"
            value={formData.preferences.religious.prayerRequirements}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "religious",
                "prayerRequirements",
                val
              )
            }
            placeholder="Specific prayer times, directions, or requirements..."
            rows={2}
            full
          />
        </div>
      </div>

      {/* Dietary Requirements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dietary Requirements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Diet Type"
            value={formData.preferences.dietary.dietType.join(", ")}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "dietary",
                "dietType",
                val.split(", ")
              )
            }
            placeholder="Vegetarian, Vegan, Halal, Kosher, etc."
          />

          <Select
            label="Assistance Level"
            value={formData.preferences.dietary.assistanceLevel}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "dietary",
                "assistanceLevel",
                val
              )
            }
            options={
              clientOptionsLoading
                ? ["Loading options..."]
                : assistanceLevelOptions
            }
            disabled={clientOptionsLoading}
          />

          <Input
            label="Food Preferences"
            value={formData.preferences.dietary.preferences.join(", ")}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "dietary",
                "preferences",
                val.split(", ")
              )
            }
          />

          <Input
            label="Food Dislikes"
            value={formData.preferences.dietary.dislikes.join(", ")}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "dietary",
                "dislikes",
                val.split(", ")
              )
            }
          />

          <div className="md:col-span-2 space-y-3">
            <Checkbox
              id="textureModification"
              label="Requires texture modification"
              checked={formData.preferences.dietary.textureModification}
              onChange={(val) =>
                handleNestedChange(
                  "preferences",
                  "dietary",
                  "textureModification",
                  val
                )
              }
            />

            <Checkbox
              id="fluidThickening"
              label="Requires fluid thickening"
              checked={formData.preferences.dietary.fluidThickening}
              onChange={(val) =>
                handleNestedChange(
                  "preferences",
                  "dietary",
                  "fluidThickening",
                  val
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Personal Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Wake Up Time"
            type="time"
            value={formData.preferences.personal.wakeUpTime}
            onChange={(val) =>
              handleNestedChange("preferences", "personal", "wakeUpTime", val)
            }
          />

          <Input
            label="Bed Time"
            type="time"
            value={formData.preferences.personal.bedTime}
            onChange={(val) =>
              handleNestedChange("preferences", "personal", "bedTime", val)
            }
          />

          <Input
            label="Hobbies & Interests"
            value={formData.preferences.personal.hobbies.join(", ")}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "personal",
                "hobbies",
                val.split(", ")
              )
            }
          />

          <Input
            label="Mobility Aids"
            value={formData.preferences.personal.mobilityAids.join(", ")}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "personal",
                "mobilityAids",
                val.split(", ")
              )
            }
            placeholder="Walking stick, wheelchair, etc."
          />

          <Input
            label="Likes & Dislikes"
            value={formData.preferences.personal.likesAndDislikes.join(", ")}
            onChange={(val) =>
              handleNestedChange(
                "preferences",
                "personal",
                "likesAndDislikes",
                val.split(", ")
              )
            }
            required
          />
        </div>
      </div>
    </div>
  );
}
