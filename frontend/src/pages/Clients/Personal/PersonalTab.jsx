import { User, Edit3 } from "lucide-react";
import { useState } from "react";
import { PersonalDetailsEditModal } from "./PersonalDetailsEditModal";
import { useDispatch } from "react-redux";
import { updateClient } from "../../../components/redux/slice/clients";
import toast from "react-hot-toast";
import { InfoBlock } from "../../../components/layout/InfoBlock";
import { Button } from "../../../components/ui/Button";

export function PersonalTab({ client, onClientUpdate }) {
  const [showPersonalEditModal, setShowPersonalEditModal] = useState(false);
  const [savingPersonalInfo, setSavingPersonalInfo] = useState(false);

  const dispatch = useDispatch();

  const handleEditPersonalInfo = () => {
    setShowPersonalEditModal(true);
  };

  const handleSavePersonalInfo = async (personalData) => {
    setSavingPersonalInfo(true);
    try {
      // Update the client's personal information
      const updatedClient = {
        ...client,
        personalDetails: personalData.personalDetails,
        addressInformation: personalData.addressInformation,
        contactInformation: personalData.contactInformation,
        consent: personalData.consent,
        startDate: personalData.startDate,
        reviewDate: personalData.reviewDate,
      };

      const result = await dispatch(
        updateClient({
          clientId: client._id,
          clientData: updatedClient,
        })
      ).unwrap();

      if (result && result.data && result.data.client) {
        toast.success("Personal information updated successfully");
        setShowPersonalEditModal(false);

        // Notify parent component about the update
        if (onClientUpdate) {
          onClientUpdate(result.data.client);
        }
      } else if (result) {
        // Fallback if the response structure is different
        toast.success("Personal information updated successfully");
        setShowPersonalEditModal(false);

        if (onClientUpdate) {
          onClientUpdate(result);
        }
      }
    } catch (error) {
      console.error("Error updating personal information:", error);
      toast.error("Failed to update personal information");
    } finally {
      setSavingPersonalInfo(false);
    }
  };
  return (
    <div>
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        <Button
          onClick={handleEditPersonalInfo}
          icon={Edit3}
          variant="default"
          style={{ minWidth: 180 }}
        >
          Edit Personal Info
        </Button>
      </div>
      <div className="mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Personal Details
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-4">
              <InfoBlock label="Title">
                {client.personalDetails?.title || "Not specified"}
              </InfoBlock>
              <InfoBlock label="Gender">
                {client.personalDetails?.gender || "Not specified"}
              </InfoBlock>
              <InfoBlock label="Ethnicity">
                {client.personalDetails?.ethnicity || "Not specified"}
              </InfoBlock>
              <InfoBlock label="Start Date">
                {client.startDate
                  ? new Date(client.startDate).toLocaleDateString()
                  : "Not specified"}
              </InfoBlock>
            </div>
            <div className="space-y-4">
              <InfoBlock label="Preferred Name">
                {client.personalDetails?.preferredName || "Not specified"}
              </InfoBlock>
              <InfoBlock label="Marital Status">
                {client.personalDetails?.relationshipStatus || "Not specified"}
              </InfoBlock>
              <InfoBlock label="Review Date">
                {client.reviewDate
                  ? new Date(client.reviewDate).toLocaleDateString()
                  : "Not specified"}
              </InfoBlock>
            </div>
          </div>
        </div>

        {/* Address & Access */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Address & Access
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <InfoBlock label="Full Address">
              {client.addressInformation?.address || "Not specified"}
              <br />
              {client.addressInformation?.city && (
                <>{client.addressInformation.city}, </>
              )}
              {client.addressInformation?.postCode && (
                <>
                  {client.addressInformation.postCode}
                  <br />
                </>
              )}
              {client.addressInformation?.country || ""}
            </InfoBlock>
            <InfoBlock label="Access Instructions">
              {client.addressInformation?.accessInstructions || "Not specified"}
            </InfoBlock>
            <InfoBlock label="Languages">
              {Array.isArray(
                client?.preferences?.cultural?.languagePreferences
              ) ? (
                client.preferences.cultural.languagePreferences.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {client.preferences.cultural.languagePreferences.map(
                      (lang, idx) => (
                        <span
                          key={idx}
                          className="mt-2 px-3 py-1 rounded-md border border-blue-500 bg-green-50 text-blue-500 text-sm font-medium"
                        >
                          {lang}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  "Not specified"
                )
              ) : (
                client?.preferences?.cultural?.languagePreferences ||
                "Not specified"
              )}
            </InfoBlock>
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Preferences
          </h3>
          <div className="space-y-4">
            <InfoBlock label="Preferred Contact Method">
              {client.contactInformation?.preferredContactMethod ||
                "Not specified"}
            </InfoBlock>
            <InfoBlock label="Best Time to Contact">
              {client.contactInformation?.bestTimeToContact || "Not specified"}
            </InfoBlock>
            <InfoBlock label="Secondary Phone">
              {client.contactInformation?.secondaryPhone || "Not specified"}
            </InfoBlock>
          </div>
        </div>

        {/* Consent & Permissions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Consent & Permissions
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Photo Consent
              </span>
              {client.consent?.photoConsent ? (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                  Granted
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                  Not Granted
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                Data Processing Consent
              </span>
              {client.consent?.dataProcessingConsent ? (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                  Granted
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                  Not Granted
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details Edit Modal */}
      {showPersonalEditModal && (
        <PersonalDetailsEditModal
          isOpen={showPersonalEditModal}
          onClose={() => setShowPersonalEditModal(false)}
          personalDetails={{
            ...client.personalDetails,
            startDate: client.startDate,
            reviewDate: client.reviewDate,
          }}
          addressInformation={client.addressInformation}
          contactInformation={client.contactInformation}
          consent={client.consent}
          onSave={handleSavePersonalInfo}
          isLoading={savingPersonalInfo}
        />
      )}
    </div>
  );
}
