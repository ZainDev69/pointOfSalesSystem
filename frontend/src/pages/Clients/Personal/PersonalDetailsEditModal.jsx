// Entry Point of the File
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useDispatch } from "react-redux";
import { fetchClientOptions } from "../../../components/redux/slice/clients";
import { PersonalInfo } from "./PersonalInfo";
import { AddressInfo } from "./AddressInfo";
import { CultureInfo } from "./CultureInfo";
import { ReligionInfo } from "./ReligionInfo";
import { ContactInfo } from "./ContactInfo";
import { DietaryInfo } from "./DietaryInfo";
import { PersonalPrefInfo } from "./PersonalPrefInfo";
import { ConsentInfo } from "./ConsentInfo";

export function PersonalDetailsEditModal({
  isOpen,
  onClose,
  personalDetails,
  addressInformation,
  contactInformation,
  preferences,
  consent,
  onSave,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    personalDetails: {
      title: "",
      fullName: "",
      preferredName: "",
      dateOfBirth: "",
      gender: "",
      nhsNumber: "",
      relationshipStatus: "",
      ethnicity: "",
      historyandBackground: "",
    },
    addressInformation: {
      address: "",
      city: "",
      county: "",
      postCode: "",
      country: "United Kingdom",
      accessInstructions: "",
    },
    contactInformation: {
      primaryPhone: "",
      secondaryPhone: "",
      email: "",
      preferredContactMethod: "",
      bestTimeToContact: "",
    },
    consent: {
      photoConsent: false,
      dataProcessingConsent: false,
    },
    preferences: {
      cultural: {
        background: "",
        languagePreferences: [],
        culturalNeeds: [],
      },
      religious: {
        religion: "",
        denomination: "",
        practiceLevel: "",
        religiousNeeds: [],
        prayerRequirements: "",
        spiritualSupport: false,
      },
      dietary: {
        dietType: [],
        dislikes: [],
        preferences: [],
        textureModification: false,
        fluidThickening: false,
        assistanceLevel: "",
      },
      personal: {
        wakeUpTime: "",
        bedTime: "",
        mobilityAids: [],
        likesAndDislikes: [],
        hobbies: [],
      },
    },
    startDate: "",
    reviewDate: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClientOptions());
  }, [dispatch]);

  useEffect(() => {
    if (
      personalDetails &&
      addressInformation &&
      contactInformation &&
      preferences &&
      consent
    ) {
      setFormData({
        personalDetails: {
          title: personalDetails.title || "",
          fullName: personalDetails.fullName || "",
          preferredName: personalDetails.preferredName || "",
          dateOfBirth: personalDetails.dateOfBirth
            ? new Date(personalDetails.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: personalDetails.gender || "",
          nhsNumber: personalDetails.nhsNumber || "",
          relationshipStatus: personalDetails.relationshipStatus || "",
          ethnicity: personalDetails.ethnicity || "",
          historyandBackground: personalDetails.historyandBackground || "",
        },
        addressInformation: {
          address: addressInformation.address || "",
          city: addressInformation.city || "",
          county: addressInformation.county || "",
          postCode: addressInformation.postCode || "",
          country: addressInformation.country || "United Kingdom",
          accessInstructions: addressInformation.accessInstructions || "",
        },
        contactInformation: {
          primaryPhone: contactInformation.primaryPhone || "",
          secondaryPhone: contactInformation.secondaryPhone || "",
          email: contactInformation.email || "",
          preferredContactMethod:
            contactInformation.preferredContactMethod || "",
          bestTimeToContact: contactInformation.bestTimeToContact || "",
        },
        preferences: {
          cultural: {
            background: preferences.cultural.background || "",
            languagePreferences: preferences.cultural.languagePreferences || [
              "English",
            ],
            culturalNeeds: preferences.cultural.culturalNeeds || [],
          },
          religious: {
            religion: preferences.religious.religion || "",
            denomination: preferences.religious.denomination || "",
            practiceLevel:
              preferences.religious.practiceLevel || "non-practicing",
            religiousNeeds: preferences.religious.religiousNeeds || [],
            prayerRequirements: preferences.religious.prayerRequirements || "",
            dietaryRestrictions:
              preferences.religious.dietaryRestrictions || [],
            spiritualSupport: preferences.religious.spiritualSupport || false,
          },
          dietary: {
            dietType: preferences.dietary.dietType || [],
            dislikes: preferences.dietary.dislikes || [],
            preferences: preferences.dietary.preferences || [],
            textureModification:
              preferences.dietary.textureModification || false,
            fluidThickening: preferences.dietary.fluidThickening || false,
            assistanceLevel:
              preferences.dietary.assistanceLevel || "independent",
          },
          personal: {
            wakeUpTime: preferences.personal?.wakeUpTime || "",
            bedTime: preferences.personal.bedTime || "",
            mobilityAids: preferences.personal.mobilityAids || [],
            likesAndDislikes: preferences.personal.likesAndDislikes || [],
            hobbies: preferences.personal.hobbies || [],
          },
        },

        consent: {
          photoConsent: consent.photoConsent || false,
          dataProcessingConsent: consent.dataProcessingConsent || false,
        },
        startDate: personalDetails.startDate
          ? new Date(personalDetails.startDate).toISOString().split("T")[0]
          : "",
        reviewDate: personalDetails.reviewDate
          ? new Date(personalDetails.reviewDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [
    personalDetails,
    addressInformation,
    contactInformation,
    consent,
    preferences,
  ]);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
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

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Personal Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Details */}
          <PersonalInfo formData={formData} handleChange={handleChange} />

          {/* Address Information */}
          <AddressInfo formData={formData} handleChange={handleChange} />

          {/* Contact Information */}
          <ContactInfo formData={formData} handleChange={handleChange} />
          {/* Cultural Prefrences */}
          <CultureInfo
            formData={formData}
            handleNestedChange={handleNestedChange}
          />
          {/* Religious Prefrences */}
          <ReligionInfo
            formData={formData}
            handleNestedChange={handleNestedChange}
          />

          {/* Dietary Requirements */}
          <DietaryInfo
            formData={formData}
            handleNestedChange={handleNestedChange}
          />
          {/* Personal Prefrences */}
          <PersonalPrefInfo
            formData={formData}
            handleNestedChange={handleNestedChange}
          />

          {/* Consent & Permissions */}
          <ConsentInfo formData={formData} handleChange={handleChange} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <Button onClick={handleSave} disabled={isLoading} variant="default">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
