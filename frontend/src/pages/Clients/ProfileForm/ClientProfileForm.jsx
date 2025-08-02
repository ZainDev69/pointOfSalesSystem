import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { checkClientId } from "../../../components/redux/slice/clients";
import { Button } from "../../../components/ui/Button";
import { PhotoUpload } from "./PhotoUpload";
import { PersonalFormTab } from "./PersonalFormTab";
import { HealthFormTab } from "./HealthFormTab";
import { MedicalFormTab } from "./MedicalFormTab";
import { PrefrencesFormTab } from "./PrefrencesFormTab";
import { FormTabs } from "./FormTabs";

export function ClientProfileForm({ client, onBack, onSave }) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("personal");
  const isEditing = !!client;
  const [clientIdExists, setClientIdExists] = useState(false);
  const [checkingClientId, setCheckingClientId] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const toInputDate = (val) => (val ? val.slice(0, 10) : "");

  const [formData, setFormData] = useState({
    clientId: client?.clientId || "",
    personalDetails: {
      title: client?.personalDetails.title || "",
      fullName: client?.personalDetails.fullName || "",
      preferredName: client?.personalDetails.preferredName || "",
      dateOfBirth: toInputDate(client?.personalDetails.dateOfBirth),
      gender: client?.personalDetails.gender || "",
      nhsNumber: client?.personalDetails.nhsNumber || "",
      relationshipStatus: client?.personalDetails.relationshipStatus || "",
      ethnicity: client?.personalDetails.ethnicity || "",
      historyandBackground: client?.personalDetails.historyandBackground || "",
    },
    status: client?.status || "",
    addressInformation: {
      address: client?.addressInformation.address || "",
      city: client?.addressInformation.city || "",
      county: client?.addressInformation.county || "",
      postCode: client?.addressInformation.postCode || "",
      country: client?.addressInformation.country || "United Kingdom",
      accessInstructions: client?.addressInformation.accessInstructions || "",
    },
    contactInformation: {
      primaryPhone: client?.contactInformation.primaryPhone || "",
      secondaryPhone: client?.contactInformation.secondaryPhone || "",
      email: client?.contactInformation.email || "",
      preferredContactMethod:
        client?.contactInformation.preferredContactMethod || "",
      bestTimeToContact: client?.contactInformation.bestTimeToContact || "",
    },
    consent: {
      photoConsent: client?.consent.photoConsent || false,
      dataProcessingConsent: client?.consent.dataProcessingConsent || false,
    },
    healthcareContacts: {
      gp: {
        id: client?.healthcareContacts?.gp?.id || "",
        name: client?.healthcareContacts?.gp?.name || "",
        role: "General Practitioner",
        organization: client?.healthcareContacts?.gp?.organization || "",
        phone: client?.healthcareContacts?.gp?.phone || "",
        email: client?.healthcareContacts?.gp?.email || "",
      },
      surgery: {
        name: client?.healthcareContacts?.surgery?.name || "",
        phone: client?.healthcareContacts?.surgery?.phone || "",
        email: client?.healthcareContacts?.surgery?.email || "",
        outOfHoursNumber:
          client?.healthcareContacts?.surgery?.outOfHoursNumber || "",
        address: client?.healthcareContacts?.surgery?.address || "",
      },
    },
    medicalInformation: {
      conditions: client?.medicalInformation?.conditions || [],
      allergies: client?.medicalInformation?.allergies || [],
      medications: client?.medicalInformation?.medications || [],
      mentalCapacity: {
        hasCapacity:
          client?.medicalInformation?.mentalCapacity?.hasCapacity || true,
        assessmentDate:
          client?.medicalInformation?.mentalCapacity?.assessmentDate || "",
        assessedBy:
          client?.medicalInformation?.mentalCapacity?.assessedBy || "",
        specificDecisions:
          client?.medicalInformation?.mentalCapacity?.specificDecisions || [],
        supportNeeds:
          client?.medicalInformation?.mentalCapacity?.supportNeeds || [],
        reviewDate:
          client?.medicalInformation?.mentalCapacity?.reviewDate || "",
        notes: client?.medicalInformation?.mentalCapacity?.notes || "",
      },
      dnr: {
        hasDNR: client?.medicalInformation?.dnr?.hasDNR || false,
        dateIssued: client?.medicalInformation?.dnr?.dateIssued || "",
        issuedBy: client?.medicalInformation?.dnr?.issuedBy || "",
        reviewDate: client?.medicalInformation?.dnr?.reviewDate || "",
        location: client?.medicalInformation?.dnr?.location || "",
        familyAware: client?.medicalInformation?.dnr?.familyAware || false,
        notes: client?.medicalInformation?.dnr?.notes || "",
      },
    },
    preferences: {
      cultural: {
        background: client?.preferences?.cultural?.background || "",
        languagePreferences: client?.preferences?.cultural
          ?.languagePreferences || ["English"],
        culturalNeeds: client?.preferences?.cultural?.culturalNeeds || [],
      },
      religious: {
        religion: client?.preferences?.religious?.religion || "",
        denomination: client?.preferences?.religious?.denomination || "",
        practiceLevel:
          client?.preferences?.religious?.practiceLevel || "non-practicing",
        prayerRequirements:
          client?.preferences?.religious?.prayerRequirements || "",
        spiritualSupport:
          client?.preferences?.religious?.spiritualSupport || false,
      },
      dietary: {
        dietType: client?.preferences?.dietary?.dietType || [],
        dislikes: client?.preferences?.dietary?.dislikes || [],
        preferences: client?.preferences?.dietary?.preferences || [],
        textureModification:
          client?.preferences?.dietary?.textureModification || false,
        fluidThickening: client?.preferences?.dietary?.fluidThickening || false,
        assistanceLevel:
          client?.preferences?.dietary?.assistanceLevel || "independent",
      },
      personal: {
        wakeUpTime: client?.preferences?.personal?.wakeUpTime || "",
        bedTime: client?.preferences?.personal?.bedTime || "",
        mobilityAids: client?.preferences?.personal?.mobilityAids || [],
        likesAndDislikes: client?.preferences?.personal?.likesAndDislikes || [],
        hobbies: client?.preferences?.personal?.hobbies || [],
      },
    },
  });

  // Real-time check for Client ID existence
  useEffect(() => {
    const id = formData.clientId;
    if (!id || isEditing) {
      setClientIdExists(false);
      setCheckingClientId(false);
      return;
    }

    setCheckingClientId(true);

    const timeoutId = setTimeout(() => {
      const checkId = async () => {
        try {
          const result = await dispatch(checkClientId(id)).unwrap();
          setClientIdExists(Array.isArray(result) && result.length > 0);
        } catch (error) {
          console.error("Error checking client ID:", error);
          setClientIdExists(false);
        } finally {
          setCheckingClientId(false);
        }
      };
      checkId();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.clientId, isEditing, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if client ID already exists (only for new clients)
    if (!isEditing && clientIdExists) {
      toast.error(
        "This Client ID already exists. Please choose a different one."
      );
      return;
    }

    // Check if client ID is empty
    if (!formData.clientId.trim()) {
      toast.error("Client ID is required.");
      return;
    }

    try {
      let photoUrl = formData.photo || "";
      if (photoFile) {
        const formDataImg = new FormData();
        formDataImg.append("photo", photoFile);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/clients/${
            client?._id || formData.clientId
          }/photo`,
          {
            method: "PATCH",
            body: formDataImg,
          }
        );
        const data = await res.json();
        if (data.data && data.data.photo) {
          photoUrl = data.data.photo;
        }
      }
      await onSave({ ...formData, photo: photoUrl }); // onSave should be async and use .unwrap() internally
    } catch (err) {
      // Display error using toast or similar
      if (err && err.message) {
        toast.error(
          Array.isArray(err.message)
            ? err.message.map((e) => e.msg || e).join(", ")
            : err.message
        );
      } else {
        toast.error("An error occurred while saving the client");
      }
    }
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Client Profile" : "Add New Client"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update comprehensive client information"
              : "Enter complete client details and care requirements"}
          </p>
        </div>
      </div>
      {/* Navigation Tabs */}
      <FormTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <PhotoUpload
          client={client}
          setPhotoFile={setPhotoFile}
          formData={formData}
        />

        {/* Personal Details */}
        {activeTab === "personal" && (
          <PersonalFormTab
            formData={formData}
            setFormData={setFormData}
            client={client}
            clientIdExists={clientIdExists}
            checkingClientId={checkingClientId}
          />
        )}
        {/* Healthcare Contacts Tab */}
        {activeTab === "healthcare" && (
          <HealthFormTab
            handleNestedChange={handleNestedChange}
            formData={formData}
          />
        )}

        {/* Medical Information Tab */}
        {activeTab === "medical" && (
          <MedicalFormTab formData={formData} setFormData={setFormData} />
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <PrefrencesFormTab
            formData={formData}
            handleNestedChange={handleNestedChange}
          />
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <Button
            type="submit"
            variant="default"
            icon={Save}
            style={{ minWidth: 180 }}
          >
            {isEditing ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
