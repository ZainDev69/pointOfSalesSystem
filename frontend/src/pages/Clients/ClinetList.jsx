import { useDispatch, useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import { Eye, Edit3, Trash, Archive, RotateCcw, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { getClientImage } from "../../utils/avatarUtils";
import {
  deleteClient,
  archiveClient,
  unarchiveClient,
} from "../../components/redux/slice/clients";

export function ClientList({
  isPrivateClient,
  showArchived,
  handleViewClient,
  handleEditClient,
  currentPage,
  setCurrentPage,
}) {
  const dispatch = useDispatch();
  const clientData = useSelector((state) => state.clients.clients);
  const isLoading = useSelector((state) => state.clients.loading);
  const pages = useSelector((state) => state.clients.pages);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getBorderColor = (status) => {
    const colors = {
      active: "border-l-4 border-green-500",
      inactive: "border-l-4 border-red-500",
      hospitalized: "border-l-4 border-purple-500",
      "care home": "border-l-4 border-blue-500",
    };
    return colors[status?.toLowerCase()] || "border-l-4 border-gray-300";
  };

  const confirmAction = ({ title, message, onConfirm }) => {
    confirmAlert({
      title,
      message,
      buttons: [
        { label: "Yes", onClick: onConfirm },
        { label: "No", onClick: () => {} },
      ],
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      hospitalized: "bg-purple-100 text-purple-800",
      "care home": "bg-blue-100 text-blue-800",
    };
    return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Client Profiles</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-blue-600 font-medium">
          Loading clients...
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {clientData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {showArchived
                  ? "No archived clients found."
                  : "No clients found."}
              </div>
            ) : (
              clientData.map((client, index) => (
                <div
                  key={index}
                  className={`p-6 hover:bg-gray-50 transition-colors ${getBorderColor(
                    client.status
                  )} `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-200 shadow flex items-center justify-center bg-blue-50">
                        <img
                          src={getClientImage(
                            client.photo,
                            client.personalDetails?.title,
                            client.personalDetails?.gender,
                            backendUrl
                          )}
                          alt="Client"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {client.personalDetails?.fullName}
                          </h3>
                          {isPrivateClient(client) && (
                            <div
                              className="flex items-center"
                              title="Private Client"
                            >
                              <Lock className="w-4 h-4 text-amber-600" />
                            </div>
                          )}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                              client.status
                            )}`}
                          >
                            {client.status}
                          </span>
                          {client.Archived && (
                            <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                              Archived
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                          <span>
                            <strong>ClientID:</strong> {client.ClientID}
                          </span>
                          <span>
                            <strong>Contact:</strong>{" "}
                            {client.contactInformation?.primaryPhone}
                          </span>
                          <span>
                            <strong>Postcode:</strong>{" "}
                            {client.addressInformation?.postCode}
                          </span>
                          <span>
                            <strong>NHS:</strong>{" "}
                            {client.personalDetails?.nhsNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewClient(client)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Client"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClient(client)}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit Client"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          confirmAction({
                            title: "Confirm Deletion",
                            message:
                              "Are you sure you want to delete this client?",
                            onConfirm: () => {
                              dispatch(deleteClient(client._id))
                                .then(() => {
                                  toast.success("Client deleted");
                                })
                                .catch(() => toast.error("Delete failed"));
                            },
                          });
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Client"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      {!client.Archived && (
                        <button
                          onClick={() => {
                            dispatch(archiveClient(client._id))
                              .then(() => {
                                toast.success("Client archived");
                              })
                              .catch(() => toast.error("Archive failed"));
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Archive Client"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                      {client.Archived && (
                        <button
                          onClick={() => {
                            dispatch(unarchiveClient(client._id))
                              .then(() => {
                                toast.success("Client unarchived");
                              })
                              .catch(() => toast.error("Unarchive failed"));
                          }}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Unarchive Client"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-4 space-x-2 px-6 pb-6">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
