import { useSelector } from "react-redux";
import {
  Users,
  Activity,
  PowerOff,
  Stethoscope,
  Home,
  Lock,
} from "lucide-react";

export function ClientStats({ isPrivateClient }) {
  const clientData = useSelector((state) => state.clients.clients);
  const isLoading = useSelector((state) => state.clients.loading);
  const totalClients = useSelector((state) => state.clients.total);

  // For stats, we want to show counts for non-archived clients only (regardless of current filter)
  const activeClients = clientData.filter(
    (c) => c.status === "Active" && !c.Archived
  ).length;
  const inactiveClients = clientData.filter(
    (c) => c.status === "Inactive" && !c.Archived
  ).length;
  const hospitalizedClients = clientData.filter(
    (c) => c.personalDetails?.status === "Hospitalized" && !c.Archived
  ).length;
  const careHomeClients = clientData.filter(
    (c) => c.personalDetails?.status === "Care Home" && !c.Archived
  ).length;
  const privateClients = clientData.filter(
    (c) => isPrivateClient(c) && !c.Archived
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total Clients */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-blue-200 rounded w-16 mb-1"></div>
                <div className="h-4 bg-blue-200 rounded w-20"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-blue-900">
                  {totalClients}
                </p>
                <p className="text-sm text-blue-700 font-medium">
                  Total Clients
                </p>
              </>
            )}
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Active Clients */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-green-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-green-200 rounded w-16"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-green-900">
                  {activeClients}
                </p>
                <p className="text-sm text-green-700 font-medium">Active</p>
              </>
            )}
          </div>
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Inactive Clients */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-red-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-red-200 rounded w-16"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-red-900">
                  {inactiveClients}
                </p>
                <p className="text-sm text-red-700 font-medium">Inactive</p>
              </>
            )}
          </div>
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <PowerOff className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Hospitalized Clients */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-purple-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-purple-200 rounded w-20"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-purple-900">
                  {hospitalizedClients}
                </p>
                <p className="text-sm text-purple-700 font-medium">
                  Hospitalized
                </p>
              </>
            )}
          </div>
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Care Home Clients */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-indigo-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-indigo-200 rounded w-20"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-indigo-900">
                  {careHomeClients}
                </p>
                <p className="text-sm text-indigo-700 font-medium">Care Home</p>
              </>
            )}
          </div>
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Private Clients */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-amber-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-amber-200 rounded w-16"></div>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold text-amber-900">
                  {privateClients}
                </p>
                <p className="text-sm text-amber-700 font-medium">Private</p>
              </>
            )}
          </div>
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
