// This is the main page of Client Management

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  createClient,
  updateClient,
  checkClientId,
  fetchClientOptions,
} from "../../components/redux/slice/clients";
import { ClientProfileForm } from "./ProfileForm/ClientProfileForm";
import { ClientProfileDetails } from "./ClientProfileDetails/ClientProfileDetails";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { ClientStats } from "./ClientStats";
import { ClientSearch } from "./ClientSearch";
import { ClientList } from "./ClinetList";
import { fetchContactOptions } from "../../components/redux/slice/contacts";
import { fetchRiskAssessmentOptions } from "../../components/redux/slice/riskAssessments";

export default function Clients() {
  const [view, setView] = useState("list");
  const [selectedClient, setSelectedClient] = useState(null);

  const [showArchived, setShowArchived] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  // Stats - calculate based on current filter state
  const isPrivateClient = (client) => {
    return client.ClientID && client.ClientID.startsWith("PVT");
  };

  useEffect(() => {
    dispatch(fetchRiskAssessmentOptions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchContactOptions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchClientOptions());
  }, [dispatch]);

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
      try {
        const result = await dispatch(checkClientId(payload.ClientID)).unwrap();
        if (Array.isArray(result) && result.length > 0) {
          toast.error("This Client ID already exists!");
          return;
        }
      } catch (err) {
        toast.error(err?.message || "Error checking Client ID");
        return;
      }
    }
    try {
      if (selectedClient?._id) {
        await dispatch(
          updateClient({ clientId: selectedClient._id, clientData: payload })
        ).unwrap();
        toast.success("Client updated successfully");
      } else {
        await dispatch(createClient(payload)).unwrap();
        toast.success("Client created successfully");
      }
      handleBackToList();
    } catch (err) {
      toast.error(
        Array.isArray(err.message)
          ? err.message.map((e) => e.msg || e).join(", ")
          : err?.message || "An error occurred while saving the client"
      );
    }
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
      <ClientProfileDetails
        client={selectedClient}
        onBack={handleBackToList}
        onClientUpdate={(updatedClient) => {
          setSelectedClient(updatedClient);
        }}
      />
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
        <Button onClick={handleAddClient} icon={Plus} variant="default">
          Add New Client
        </Button>
      </div>

      {/* Stats */}
      <ClientStats isPrivateClient={isPrivateClient} />

      {/* Search + Filter */}
      <ClientSearch
        showArchived={showArchived}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Show Archived Clients */}
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
      <ClientList
        isPrivateClient={isPrivateClient}
        showArchived={showArchived}
        handleViewClient={handleViewClient}
        handleEditClient={handleEditClient}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
