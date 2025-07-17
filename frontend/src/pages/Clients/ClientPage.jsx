import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Users,
  PowerOff,
  Stethoscope,
  Home,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clientList,
  createClient,
  updateClient,
  deleteClient,
  archiveClient,
  unarchiveClient,
  checkClientId,
} from "../../components/redux/slice/clients";
import { ClientProfileForm } from "./ClientProfileForm";
import { ClientProfileDetails } from "./ClientProfileDetails";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";

export default function Clients() {
  const [view, setView] = useState("list");
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  const dispatch = useDispatch();
  const clientData = useSelector((state) => state.client.clients) || [];
  const isLoading = useSelector((state) => state.client.isLoading);

  const totalClients = clientData.length;
  const activeClients = clientData.filter(
    (c) => c.ServiceStatus?.toLowerCase() === "active"
  ).length;
  const inactiveClients = clientData.filter(
    (c) => c.ServiceStatus?.toLowerCase() === "inactive"
  ).length;
  const hospitalizedClients = clientData.filter(
    (c) => c.ServiceStatus?.toLowerCase() === "hospitalized"
  ).length;
  const careHomeClients = clientData.filter(
    (c) => c.ServiceStatus?.toLowerCase() === "care home"
  ).length;

  const confirmAction = ({ title, message, onConfirm }) => {
    confirmAlert({
      title,
      message,
      buttons: [
        {
          label: "Yes",
          onClick: onConfirm,
        },
        {
          label: "No",
          onClick: () => {}, // do nothing
        },
      ],
    });
  };

  useEffect(() => {
    dispatch(clientList());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setView("form");
  };

  const handleEditClient = (client) => {
    setSelectedClient({
      ...client,
      clientId: client.ClientID,
    });
    setView("form");
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setView("details");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedClient(null);
  };

  const handleSaveClient = async (formData) => {
    // Ensure ClientID is set at the top level for backend
    const payload = {
      ...formData,
      ClientID: formData.clientId,
    };
    delete payload.clientId;

    if (!selectedClient?._id && payload.ClientID) {
      const result = await dispatch(checkClientId(payload.ClientID));
      if (result.payload && result.payload.length > 0) {
        toast.error("This Client ID already exists!");
        return;
      }
    }
    try {
      if (selectedClient?._id) {
        await dispatch(
          updateClient({ clientId: selectedClient._id, clientData: payload })
        );
        toast.success("Client updated successfully");
      } else {
        const result = await dispatch(createClient(payload));

        if (createClient.rejected.match(result)) {
          // result.payload will have an array of validation errors
          result.payload.forEach((error) => {
            toast.error(`${error.path || "Error"}: ${error.msg}`);
          });
          return;
        }
        toast.success("Client created successfully");
      }
      dispatch(clientList());
      handleBackToList();
    } catch {
      toast.error("An error occurred while saving the client");
    }
  };

  const filteredClients = clientData.filter((client) => {
    const matchesStatus =
      filterStatus === "all"
        ? true
        : client.ServiceStatus?.toLowerCase() === filterStatus;

    const search = searchTerm.toLowerCase();
    const matchesSearch =
      client.FullName?.toLowerCase().includes(search) ||
      client.ClientID?.toLowerCase().includes(search) ||
      client.PhoneNumber?.toLowerCase().includes(search) ||
      client.EmailAddress?.toLowerCase().includes(search) ||
      client.NHSNumber?.toLowerCase().includes(search);

    const matchesArchive = showArchived ? true : !client.Archived;
    return matchesStatus && matchesSearch && matchesArchive;
  });

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage
  );

  const getStatusStyle = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      hospitalized: "bg-purple-100 text-purple-800",
      "care home": "bg-blue-100 text-blue-800",
    };
    return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getBorderColor = (status) => {
    const colors = {
      active: "border-l-4 border-green-500",
      inactive: "border-l-4 border-red-500",
      hospitalized: "border-l-4 border-purple-500",
      "care home": "border-l-4 border-blue-500",
    };
    return colors[status?.toLowerCase()] || "border-l-4 border-gray-300";
  };

  if (view === "form") {
    return (
      <ClientProfileForm
        client={selectedClient}
        onBack={handleBackToList}
        onSave={handleSaveClient}
      />
    );
  }

  if (view === "details" && selectedClient) {
    return (
      <ClientProfileDetails client={selectedClient} onBack={handleBackToList} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Client Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your clients and care services
          </p>
        </div>
        <button
          onClick={handleAddClient}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            icon: <Users className="w-8 h-8 text-blue-600" />,
            value: totalClients,
            label: "All Clients",
          },
          {
            icon: (
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
              </div>
            ),
            value: activeClients,
            label: "Active",
          },
          {
            icon: <PowerOff className="w-8 h-8 text-red-600" />,
            value: inactiveClients,
            label: "Inactive",
          },
          {
            icon: <Stethoscope className="w-8 h-8 text-purple-600" />,
            value: hospitalizedClients,
            label: "Hospitalized",
          },
          {
            icon: <Home className="w-8 h-8 text-purple-600" />,
            value: careHomeClients,
            label: "Care Home",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center space-x-3">
              {stat.icon}
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="hospitalized">Hospitalized</option>
              <option value="care home">Care Home</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <input
          type="checkbox"
          id="showArchived"
          checked={showArchived}
          onChange={() => setShowArchived(!showArchived)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="showArchived" className="text-sm text-gray-700">
          Show Archived Clients
        </label>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Client Profiles
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-blue-600 font-medium">
            Loading clients...
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {paginatedClients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No clients found.
                </div>
              ) : (
                paginatedClients.map((client, index) => (
                  <div
                    key={index}
                    className={`p-6 hover:bg-gray-50 transition-colors ${getBorderColor(
                      client.ServiceStatus
                    )} ${client.Archived ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {client.personalDetails?.fullName}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                client.ServiceStatus
                              )}`}
                            >
                              {client.ServiceStatus}
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
                              <strong>Email:</strong>{" "}
                              {client.contactInformation?.email}
                            </span>
                            <span>
                              <strong>NHS:</strong>{" "}
                              {client.personalDetails?.nhsNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mb-4">
                        <div className="flex space-x-2 mb-4">
                          <button
                            onClick={() => handleViewClient(client)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditClient(client)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              confirmAction({
                                title: "Confirm Deletion",
                                message:
                                  "Are you sure you want to delete this client?",
                                onConfirm: () => {
                                  dispatch(deleteClient(client._id))
                                    .then(() => toast.success("Client deleted"))
                                    .catch(() => toast.error("Delete failed"));
                                },
                              });
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                          >
                            Delete
                          </button>
                          {!client.Archived && (
                            <button
                              onClick={() => {
                                confirmAction({
                                  title: "Archive Client",
                                  message:
                                    "Are you sure you want to archive this client?",
                                  onConfirm: () => {
                                    dispatch(archiveClient(client._id))
                                      .then(() =>
                                        toast.success("Client archived")
                                      )
                                      .catch(() =>
                                        toast.error("Archive failed")
                                      );
                                  },
                                });
                              }}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              Archive
                            </button>
                          )}
                          {client.Archived && (
                            <button
                              onClick={() => {
                                dispatch(unarchiveClient(client._id))
                                  .then(() =>
                                    toast.success("Client unarchived")
                                  )
                                  .catch(() => toast.error("Unarchive failed"));
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                            >
                              Unarchive
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2 px-6 pb-6">
                {Array.from({ length: totalPages }, (_, i) => (
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
    </div>
  );
}
