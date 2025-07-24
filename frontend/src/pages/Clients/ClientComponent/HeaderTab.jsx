import { ArrowLeft, User } from "lucide-react";
import defaultClientImg from "../../../assets/default.jpg"; // Adjust path as needed
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5500";
export function HeaderTab({ client, onBack }) {
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
              <h2 className="text-2xl font-bold">
                {client.personalDetails.fullName || "Client Name"}
              </h2>
              <p className="text-blue-100">
                NHS: {client.personalDetails.nhsNumber} • Age:{" "}
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
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg border border-green-300 border-opacity-50 backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
              <div className="w-2.5 h-2.5 bg-white rounded-full mr-2 animate-pulse shadow-sm"></div>
              <span className="text-white drop-shadow-sm">
                {client.status || "No Status"}
              </span>
              <div className="ml-2 w-1 h-1 bg-white rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
