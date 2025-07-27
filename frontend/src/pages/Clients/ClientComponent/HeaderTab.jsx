import {
  ArrowLeft,
  Calendar,
  FileText,
  BarChart3,
  Phone,
  Clock,
  Zap,
} from "lucide-react";
import defaultClientImg from "../../../assets/default.jpg"; // Adjust path as needed
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5500";

export function HeaderTab({ client, onBack, setActiveTab }) {
  const imageUrl = client.photo?.startsWith("/uploads/")
    ? `${backendUrl}${client.photo}`
    : client.photo || defaultClientImg;
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
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg border border-green-300 border-opacity-50 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse shadow-sm"></div>
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
              <button
                onClick={() => setActiveTab("visits")}
                className="group relative inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg border border-emerald-400 border-opacity-50 backdrop-blur-sm transform hover:scale-105 hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 hover:shadow-xl"
                title="Schedule Visit (Alt + V)"
              >
                <Calendar className="w-3 h-3 mr-1.5 group-hover:animate-pulse" />
                <span>Schedule Visit</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              </button>

              {/* Update Care Plan */}
              <button
                onClick={() => setActiveTab("care-plan")}
                className="group relative inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg border border-blue-400 border-opacity-50 backdrop-blur-sm transform hover:scale-105 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 hover:shadow-xl"
                title="Update Care Plan (Alt + C)"
              >
                <FileText className="w-3 h-3 mr-1.5 group-hover:animate-pulse" />
                <span>Update Care Plan</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
              </button>

              {/* Generate Report */}
              <button
                onClick={() => setActiveTab("documents")}
                className="group relative inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border border-purple-400 border-opacity-50 backdrop-blur-sm transform hover:scale-105 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:shadow-xl"
                title="Generate Report (Alt + R)"
              >
                <BarChart3 className="w-3 h-3 mr-1.5 group-hover:animate-pulse" />
                <span>Generate Report</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
              </button>

              {/* Contact Family */}
              <button
                onClick={() => setActiveTab("contacts")}
                className="group relative inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg border border-orange-400 border-opacity-50 backdrop-blur-sm transform hover:scale-105 hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:shadow-xl"
                title="Contact Family (Alt + F)"
              >
                <Phone className="w-3 h-3 mr-1.5 group-hover:animate-pulse" />
                <span>Contact Family</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
