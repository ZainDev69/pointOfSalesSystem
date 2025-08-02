import { useSelector } from "react-redux";
import { useApp } from "../../../components/Context/AppContext";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Phone } from "lucide-react";

export function ReligionInfo({ formData, handleNestedChange }) {
  const { clientOptionsLoading } = useSelector((state) => state.clients);
  const { practiceLevelOptions } = useApp();

  const formatOptions = (arr) =>
    arr.map((opt) => ({ label: opt.label, value: opt.value }));

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Phone className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Religious Preferences
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Religion"
          value={formData.preferences.religious.religion}
          onChange={(val) =>
            handleNestedChange("prefrences", "religious", "religion", val)
          }
        />

        <Input
          label="Denomination"
          value={formData.preferences.religious.denomination}
          onChange={(val) =>
            handleNestedChange("prefrences", "religious", "denomination", val)
          }
        />

        <Select
          label="Practice Level"
          value={formData.preferences.religious.practiceLevel}
          onChange={(val) =>
            handleNestedChange("prefrences", "religious", "practiceLevel", val)
          }
          options={
            clientOptionsLoading
              ? [{ label: "Loading...", value: "" }]
              : formatOptions(practiceLevelOptions)
          }
        />

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="spiritualSupport"
            checked={formData.preferences.religious.spiritualSupport}
            onChange={(e) =>
              handleNestedChange(
                "prefrences",
                "religious",
                "spiritualSupport",
                e.target.checked
              )
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="spiritualSupport"
            className="ml-2 block text-sm text-gray-900"
          >
            Spiritual Support
          </label>
        </div>

        <Input
          label="Prayer Requirements"
          value={formData.preferences.religious.prayerRequirements}
          onChange={(val) =>
            handleNestedChange(
              "prefrences",
              "religious",
              "prayerRequirements",
              val
            )
          }
        />
      </div>
    </div>
  );
}
