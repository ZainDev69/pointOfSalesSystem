import {
  ArrowLeft,
  Calendar,
  FileText,
  BarChart3,
  Phone,
  Clock,
  Zap,
} from "lucide-react";
import { getClientImage } from "../../../utils/avatarUtils";
import { Button } from "../../../components/ui/Button";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5500";

export function HeaderTab({ client, onBack, setActiveTab }) {
  const imageUrl = getClientImage(
    client.photo,
    client.personalDetails?.title,
    client.personalDetails?.gender,
    backendUrl
  );
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onBack}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow">
              <img
                src={imageUrl}
                alt="Client"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h2 className="text-2xl font-bold">
                  {client.personalDetails.fullName || "Client Name"}
                </h2>
                <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg border border-green-300 border-opacity-50 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-white rounded-md mr-1.5 animate-pulse shadow-sm"></div>
                  <span className="text-white drop-shadow-sm">
                    {client.status || "No Status"}
                  </span>
                </div>
              </div>
              <p className="text-blue-100">
                NHS: {client.personalDetails.nhsNumber} • DOB:{" "}
                {client.personalDetails.dateOfBirth
                  ? new Date(
                      client.personalDetails.dateOfBirth
                    ).toLocaleDateString("en-GB")
                  : "-"}{" "}
                • Age:{" "}
                {client.personalDetails.dateOfBirth
                  ? Math.floor(
                      (new Date().getTime() -
                        new Date(
                          client.personalDetails.dateOfBirth
                        ).getTime()) /
                        (365.25 * 24 * 60 * 60 * 1000)
                    )
                  : "-"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-blue-100 mb-2 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Quick Actions
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {/* Schedule Visit */}
              <Button
                variant="sky"
                size="sm"
                onClick={() => setActiveTab("visits")}
                icon={Calendar}
                title="Schedule Visit (Alt + V)"
                className="text-xs"
              >
                Schedule Visit
              </Button>

              {/* Update Care Plan */}
              <Button
                variant="sky"
                size="sm"
                onClick={() => setActiveTab("care-plan")}
                icon={FileText}
                title="Update Care Plan (Alt + C)"
                className="text-xs"
              >
                Update Care Plan
              </Button>

              {/* Generate Report */}
              <Button
                variant="sky"
                size="sm"
                onClick={() => setActiveTab("documents")}
                icon={BarChart3}
                title="Generate Report (Alt + R)"
                className="text-xs"
              >
                Generate Report
              </Button>

              {/* Contact Family */}
              <Button
                variant="sky"
                size="sm"
                onClick={() => setActiveTab("contacts")}
                icon={Phone}
                title="Contact Family (Alt + F)"
                className="text-xs"
              >
                Contact Family
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
