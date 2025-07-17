import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  X,
  User,
  Phone,
  MapPin,
  Heart,
  Shield,
  Calendar,
  Plus,
  Trash2,
} from "lucide-react";

export function ClientProfileForm({ client, onBack, onSave }) {
  const [activeTab, setActiveTab] = useState("personal");
  const isEditing = !!client;
  const [isPvt, setIsPvt] = useState(false);
  const [clientIdExists, setClientIdExists] = useState(false);
  const [checkingClientId, setCheckingClientId] = useState(false);

  const toInputDate = (val) => (val ? val.slice(0, 10) : "");

  const [formData, setFormData] = useState({
    clientId: client?.clientId || "",
    personalDetails: {
      fullName: client?.personalDetails.fullName || "",
      preferredName: client?.personalDetails.preferredName || "",
      dateOfBirth: toInputDate(client?.personalDetails.dateOfBirth),
      gender: client?.personalDetails.gender || "",
      nhsNumber: client?.personalDetails.nhsNumber || "",
      relationshipStatus: client?.personalDetails.relationshipStatus || "",
      ethnicity: client?.personalDetails.ethnicity || "",
      status: client?.personalDetails.status || "",
    },
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
    nextOfKin: {
      name: client?.nextOfKin?.name || "",
      relationship: client?.nextOfKin?.relationship || "",
      phone: client?.nextOfKin?.phone || "",
      email: client?.nextOfKin?.email || "",
      hasLegalAuthority: client?.nextOfKin?.hasLegalAuthority || false,
      powerOfAttorney: client?.nextOfKin?.powerOfAttorney || false,
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
      practice: {
        name: client?.healthcareContacts?.practice?.name || "",
        phone: client?.healthcareContacts?.practice?.phone || "",
        email: client?.healthcareContacts?.practice?.email || "",
        outOfHoursNumber:
          client?.healthcareContacts?.practice?.outOfHoursNumber || "",
        address: {
          line1: client?.healthcareContacts?.practice?.address?.line1 || "",
          line2: client?.healthcareContacts?.practice?.address?.line2 || "",
          city: client?.healthcareContacts?.practice?.address?.city || "",
          county: client?.healthcareContacts?.practice?.address?.county || "",
          postcode:
            client?.healthcareContacts?.practice?.address?.postcode || "",
          country:
            client?.healthcareContacts?.practice?.address?.country ||
            "United Kingdom",
        },
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
        traditions: client?.preferences?.cultural?.traditions || [],
        importantDates: client?.preferences?.cultural?.importantDates || [],
        languagePreferences: client?.preferences?.cultural
          ?.languagePreferences || ["English"],
        culturalNeeds: client?.preferences?.cultural?.culturalNeeds || [],
      },
      religious: {
        religion: client?.preferences?.religious?.religion || "",
        denomination: client?.preferences?.religious?.denomination || "",
        practiceLevel:
          client?.preferences?.religious?.practiceLevel || "non-practicing",
        religiousNeeds: client?.preferences?.religious?.religiousNeeds || [],
        prayerRequirements:
          client?.preferences?.religious?.prayerRequirements || "",
        dietaryRestrictions:
          client?.preferences?.religious?.dietaryRestrictions || [],
        holyDays: client?.preferences?.religious?.holyDays || [],
        spiritualSupport:
          client?.preferences?.religious?.spiritualSupport || false,
      },
      dietary: {
        dietType: client?.preferences?.dietary?.dietType || [],
        allergies: client?.preferences?.dietary?.allergies || [],
        dislikes: client?.preferences?.dietary?.dislikes || [],
        preferences: client?.preferences?.dietary?.preferences || [],
        textureModification:
          client?.preferences?.dietary?.textureModification || false,
        fluidThickening: client?.preferences?.dietary?.fluidThickening || false,
        assistanceLevel:
          client?.preferences?.dietary?.assistanceLevel || "independent",
        specialEquipment: client?.preferences?.dietary?.specialEquipment || [],
        nutritionalSupplements:
          client?.preferences?.dietary?.nutritionalSupplements || [],
        feedingTimes: client?.preferences?.dietary?.feedingTimes || [],
      },
      personal: {
        wakeUpTime: client?.preferences?.personal?.wakeUpTime || "",
        bedTime: client?.preferences?.personal?.bedTime || "",
        bathingPreferences: {
          frequency:
            client?.preferences?.personal?.bathingPreferences?.frequency || "",
          timeOfDay:
            client?.preferences?.personal?.bathingPreferences?.timeOfDay || "",
          bathOrShower:
            client?.preferences?.personal?.bathingPreferences?.bathOrShower ||
            "no-preference",
          temperature:
            client?.preferences?.personal?.bathingPreferences?.temperature ||
            "",
          privacy:
            client?.preferences?.personal?.bathingPreferences?.privacy || "",
          assistance:
            client?.preferences?.personal?.bathingPreferences?.assistance || "",
          products:
            client?.preferences?.personal?.bathingPreferences?.products || [],
        },
        dressingPreferences: {
          assistance:
            client?.preferences?.personal?.dressingPreferences?.assistance ||
            "",
          clothing:
            client?.preferences?.personal?.dressingPreferences?.clothing || [],
          footwear:
            client?.preferences?.personal?.dressingPreferences?.footwear || [],
          accessories:
            client?.preferences?.personal?.dressingPreferences?.accessories ||
            [],
          adaptations:
            client?.preferences?.personal?.dressingPreferences?.adaptations ||
            [],
        },
        mobilityAids: client?.preferences?.personal?.mobilityAids || [],
        comfortItems: client?.preferences?.personal?.comfortItems || [],
        routines: client?.preferences?.personal?.routines || [],
        hobbies: client?.preferences?.personal?.hobbies || [],
        interests: client?.preferences?.personal?.interests || [],
      },
    },
  });

  // Real-time check for Client ID existence
  useEffect(() => {
    const id = formData.clientId;
    if (!id) {
      setClientIdExists(false);
      return;
    }
    setCheckingClientId(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/clients?clientId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setClientIdExists(
          Array.isArray(data.data) && data.data.some((c) => c.ClientID === id)
        );
        setCheckingClientId(false);
      })
      .catch(() => setCheckingClientId(false));
  }, [formData.clientId]);

  // Handle checkbox toggle
  const handlePvtToggle = (checked) => {
    setIsPvt(checked);
    setFormData((prev) => ({
      ...prev,
      clientId: checked
        ? prev.clientId.startsWith("PVT")
          ? prev.clientId
          : "PVT"
        : prev.clientId.replace(/^PVT/, ""),
    }));
  };

  const tabs = [
    { id: "personal", label: "Personal Details", icon: User },
    { id: "healthcare", label: "Healthcare Contacts", icon: Heart },
    { id: "medical", label: "Medical Information", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Calendar },
  ];

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the entire formData object to the backend
    console.log(formData);
    onSave(formData);
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

  const addMedicalCondition = () => {
    const newCondition = {
      id: Date.now().toString(),
      condition: "",
      diagnosisDate: "",
      severity: "mild",
      status: "active",
      notes: "",
    };

    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        conditions: [...prev.medicalInformation.conditions, newCondition],
      },
    }));
  };

  const updateMedicalCondition = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        conditions: prev.medicalInformation.conditions.map((condition, i) =>
          i === index ? { ...condition, [field]: value } : condition
        ),
      },
    }));
  };

  const removeMedicalCondition = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        conditions: prev.medicalInformation.conditions.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const addAllergy = () => {
    const newAllergy = {
      id: Date.now().toString(),
      allergen: "",
      reaction: "",
      severity: "mild",
      treatment: "",
      notes: "",
    };

    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        allergies: [...prev.medicalInformation.allergies, newAllergy],
      },
    }));
  };

  const updateAllergy = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        allergies: prev.medicalInformation.allergies.map((allergy, i) =>
          i === index ? { ...allergy, [field]: value } : allergy
        ),
      },
    }));
  };

  const removeAllergy = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        allergies: prev.medicalInformation.allergies.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const addMedication = () => {
    const newMedication = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      route: "",
      prescribedBy: "",
      startDate: "",
      indication: "",
      status: "active",
    };

    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        medications: [...prev.medicalInformation.medications, newMedication],
      },
    }));
  };

  const updateMedication = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        medications: prev.medicalInformation.medications.map((medication, i) =>
          i === index ? { ...medication, [field]: value } : medication
        ),
      },
    }));
  };

  const removeMedication = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        medications: prev.medicalInformation.medications.filter(
          (_, i) => i !== index
        ),
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
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            <Section
              title="Basic Information"
              icon={<User className="w-5 h-5 text-gray-400" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3 flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="pvt-checkbox"
                    checked={isPvt}
                    onChange={(e) => handlePvtToggle(e.target.checked)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="pvt-checkbox"
                    className="text-sm text-gray-700"
                  >
                    Prefix Client ID with PVT
                  </label>
                </div>
                <div className="flex flex-col space-y-4">
                  <Input
                    label="Client ID"
                    value={formData.clientId}
                    required
                    placeholder="Leave blank to auto-generate ID"
                    onChange={(val) => {
                      let newVal = val;
                      if (isPvt && !val.startsWith("PVT"))
                        newVal = "PVT" + val.replace(/^PVT/, "");
                      if (!isPvt && newVal.startsWith("PVT"))
                        newVal = newVal.replace(/^PVT/, "");
                      setFormData((prev) => ({ ...prev, clientId: newVal }));
                    }}
                  />
                  {checkingClientId && (
                    <span className="text-xs text-blue-500">
                      Checking Client ID...
                    </span>
                  )}
                  {clientIdExists && (
                    <span className="text-xs text-red-500">
                      This Client ID already exists!
                    </span>
                  )}
                </div>
                <Input
                  label="Full Name"
                  value={formData.personalDetails.fullName}
                  required
                  onChange={(val) =>
                    handleChange("personalDetails", "fullName", val)
                  }
                />
                <Input
                  label="Preferred Name"
                  value={formData.personalDetails.preferredName}
                  onChange={(val) =>
                    handleChange("personalDetails", "preferredName", val)
                  }
                />
                <Input
                  label="Date of Birth *"
                  type="date"
                  value={formData.personalDetails.dateOfBirth}
                  required
                  onChange={(val) =>
                    handleChange("personalDetails", "dateOfBirth", val)
                  }
                />
                <Input
                  label="NHS Number"
                  value={formData.personalDetails.nhsNumber}
                  required
                  onChange={(val) =>
                    handleChange("personalDetails", "nhsNumber", val)
                  }
                />
                <Select
                  label="Gender"
                  value={formData.personalDetails.gender}
                  onChange={(val) =>
                    handleChange("personalDetails", "gender", val)
                  }
                  options={[
                    "Male",
                    "Female",
                    "Non-binary",
                    "Other",
                    "Prefer not to say",
                  ]}
                />
                <Select
                  label="Relationship Status"
                  value={formData.personalDetails.relationshipStatus}
                  onChange={(val) =>
                    handleChange("personalDetails", "relationshipStatus", val)
                  }
                  options={[
                    "Single",
                    "Married",
                    "Civil Partnership",
                    "Divorced",
                    "Widowed",
                    "Separated",
                    "Other",
                    "Prefer Not to Say",
                  ]}
                />
                <Select
                  label="Ethnicity"
                  value={formData.personalDetails.ethnicity}
                  onChange={(val) =>
                    handleChange("personalDetails", "ethnicity", val)
                  }
                  options={[
                    "White British",
                    "White Irish",
                    "White Other",
                    "Black Caribbean",
                    "Black African",
                    "Black Other",
                    "Indian",
                    "Pakistani",
                    "Bangladeshi",
                    "Chinese",
                    "Mixed White/Black Caribbean",
                    "Mixed White/Asian",
                    "Other Mixed",
                    "Other Asian",
                    "Other",
                    "Prefer Not to Say",
                  ]}
                />
                <Select
                  label="Status"
                  value={formData.personalDetails.status}
                  onChange={(val) =>
                    handleChange("personalDetails", "status", val)
                  }
                  options={["Active", "Inactive", "hospitalized", "carehome"]}
                />
              </div>
            </Section>

            {/* Address Information */}
            <Section
              title="Address Information"
              icon={<MapPin className="w-5 h-5 text-gray-400" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Address"
                  type="text"
                  required
                  value={formData.addressInformation.address}
                  onChange={(val) =>
                    handleChange("addressInformation", "address", val)
                  }
                  full
                />
                <Input
                  label="City"
                  type="text"
                  value={formData.addressInformation.city}
                  required
                  onChange={(val) =>
                    handleChange("addressInformation", "city", val)
                  }
                />
                <Input
                  label="County"
                  type="text"
                  value={formData.addressInformation.county}
                  onChange={(val) =>
                    handleChange("addressInformation", "county", val)
                  }
                />
                <Input
                  label="Post Code"
                  type="text"
                  value={formData.addressInformation.postCode}
                  onChange={(val) =>
                    handleChange("addressInformation", "postCode", val)
                  }
                />
                <Input
                  label="Country"
                  type="text"
                  value={formData.addressInformation.country}
                  onChange={(val) =>
                    handleChange("addressInformation", "country", val)
                  }
                />
                <Input
                  label="Access Instructions"
                  type="text"
                  placeholder={
                    "Special instructions for accessing the Property"
                  }
                  value={formData.addressInformation.accessInstructions}
                  onChange={(val) =>
                    handleChange(
                      "addressInformation",
                      "accessInstructions",
                      val
                    )
                  }
                />
              </div>
            </Section>

            {/* Contact Information */}
            <Section
              title="Contact Information"
              icon={<Phone className="w-5 h-5 text-gray-400" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Primary Phone*"
                  type="text"
                  value={formData.contactInformation.primaryPhone}
                  required
                  onChange={(val) =>
                    handleChange("contactInformation", "primaryPhone", val)
                  }
                />
                <Input
                  label="Secondary Phone"
                  type="text"
                  value={formData.contactInformation.secondaryPhone}
                  onChange={(val) =>
                    handleChange("contactInformation", "secondaryPhone", val)
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.contactInformation.email}
                  onChange={(val) =>
                    handleChange("contactInformation", "email", val)
                  }
                />
                <Select
                  label="Preferred Contact Method"
                  value={formData.contactInformation.preferredContactMethod}
                  onChange={(val) =>
                    handleChange(
                      "contactInformation",
                      "preferredContactMethod",
                      val
                    )
                  }
                  options={["Phone", "Email", "Post", "In Person"]}
                />
                <Input
                  label="Best Time to Contact"
                  type="text"
                  placeholder="e.g, Weekday Mornings,Evenings after 6pm"
                  value={formData.contactInformation.bestTimeToContact}
                  onChange={(val) =>
                    handleChange("contactInformation", "bestTimeToContact", val)
                  }
                />
              </div>
            </Section>

            {/* Next Of Kin Information */}

            <Section
              title="Next of Kin"
              icon={<User className="w-5 h-5 text-gray-400" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name*"
                  required
                  value={formData.nextOfKin.name}
                  onChange={(val) => handleChange("nextOfKin", "name", val)}
                />
                <Input
                  label="Relationship*"
                  required
                  value={formData.nextOfKin.relationship}
                  onChange={(val) =>
                    handleChange("nextOfKin", "relationship", val)
                  }
                />
                <Input
                  label="Phone*"
                  required
                  value={formData.nextOfKin.phone}
                  onChange={(val) => handleChange("nextOfKin", "phone", val)}
                />
                <Input
                  label="Email"
                  value={formData.nextOfKin.email}
                  onChange={(val) => handleChange("nextOfKin", "email", val)}
                />

                <div className="md:col-span-2 space-y-3">
                  <Checkbox
                    label="Has legal authority to make decisions"
                    checked={formData.nextOfKin.hasLegalAuthority}
                    onChange={(val) =>
                      handleChange("nextOfKin", "hasLegalAuthority", val)
                    }
                  />
                  <Checkbox
                    label="Has Power of Attorney"
                    checked={formData.nextOfKin.powerOfAttorney}
                    onChange={(val) =>
                      handleChange("nextOfKin", "powerOfAttorney", val)
                    }
                  />
                </div>
              </div>
            </Section>
            {/* Consent & Data Processing */}
            <Section
              title="Consent & Data Processing"
              icon={<User className="w-5 h-5 text-gray-400" />}
            >
              <div className="md:col-span-2 space-y-3">
                <Checkbox
                  label="
Consent to photography for care documentation"
                  checked={formData.consent.photoConsent}
                  onChange={(val) =>
                    handleChange("consent", "photoConsent", val)
                  }
                />
                <Checkbox
                  label="Consent to data processing for care provision (Required)"
                  checked={formData.consent.dataProcessingConsent}
                  onChange={(val) =>
                    handleChange("consent", "dataProcessingConsent", val)
                  }
                />
              </div>
            </Section>
          </div>
        )}
        {/* Healthcare Contacts Tab */}
        {activeTab === "healthcare" && (
          <div className="space-y-6">
            {/* GP Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  General Practitioner
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GP Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.healthcareContacts.gp.name}
                    onChange={(e) =>
                      handleNestedChange(
                        "healthcareContacts",
                        "gp",
                        "name",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Practice Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.healthcareContacts.gp.organization}
                    onChange={(e) =>
                      handleNestedChange(
                        "healthcareContacts",
                        "gp",
                        "organization",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.healthcareContacts.gp.phone}
                    onChange={(e) =>
                      handleNestedChange(
                        "healthcareContacts",
                        "gp",
                        "phone",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.healthcareContacts.gp.email}
                    onChange={(e) =>
                      handleNestedChange(
                        "healthcareContacts",
                        "gp",
                        "email",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Practice Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Practice Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Practice Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.healthcareContacts.practice.phone}
                    onChange={(e) =>
                      handleNestedChange(
                        "healthcareContacts",
                        "practice",
                        "phone",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Out of Hours Number
                  </label>
                  <input
                    type="tel"
                    value={
                      formData.healthcareContacts.practice.outOfHoursNumber
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "healthcareContacts",
                        "practice",
                        "outOfHoursNumber",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Practice Address
                  </label>
                  <input
                    type="text"
                    value={formData.healthcareContacts.practice.address?.line1}
                    onChange={(e) =>
                      handleNestedChange(
                        "healthcareContacts",
                        "practice",
                        "address",
                        {
                          ...formData.healthcareContacts.practice.address,
                          line1: e.target.value,
                        }
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medical Information Tab */}
        {activeTab === "medical" && (
          <div className="space-y-6">
            {/* Medical Conditions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Medical Conditions
                </h3>
                <button
                  type="button"
                  onClick={addMedicalCondition}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Condition</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.medicalInformation.conditions.map(
                  (condition, index) => (
                    <div
                      key={condition.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Condition
                          </label>
                          <input
                            type="text"
                            value={condition.condition}
                            onChange={(e) =>
                              updateMedicalCondition(
                                index,
                                "condition",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Severity
                          </label>
                          <select
                            value={condition.severity}
                            onChange={(e) =>
                              updateMedicalCondition(
                                index,
                                "severity",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="mild">Mild</option>
                            <option value="moderate">Moderate</option>
                            <option value="severe">Severe</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={condition.status}
                            onChange={(e) =>
                              updateMedicalCondition(
                                index,
                                "status",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="resolved">Resolved</option>
                            <option value="chronic">Chronic</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Diagnosis Date
                          </label>
                          <input
                            type="date"
                            value={condition.diagnosisDate}
                            onChange={(e) =>
                              updateMedicalCondition(
                                index,
                                "diagnosisDate",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={condition.notes}
                            onChange={(e) =>
                              updateMedicalCondition(
                                index,
                                "notes",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-3">
                        <button
                          type="button"
                          onClick={() => removeMedicalCondition(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  )
                )}

                {formData.medicalInformation.conditions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No medical conditions added yet. Click "Add Condition" to
                    get started.
                  </p>
                )}
              </div>
            </div>

            {/* Allergies */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Allergies
                </h3>
                <button
                  type="button"
                  onClick={addAllergy}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Allergy</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.medicalInformation.allergies.map((allergy, index) => (
                  <div
                    key={allergy.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Allergen
                        </label>
                        <input
                          type="text"
                          value={allergy.allergen}
                          onChange={(e) =>
                            updateAllergy(index, "allergen", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reaction
                        </label>
                        <input
                          type="text"
                          value={allergy.reaction}
                          onChange={(e) =>
                            updateAllergy(index, "reaction", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Severity
                        </label>
                        <select
                          value={allergy.severity}
                          onChange={(e) =>
                            updateAllergy(index, "severity", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                          <option value="life-threatening">
                            Life-threatening
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Treatment
                        </label>
                        <input
                          type="text"
                          value={allergy.treatment}
                          onChange={(e) =>
                            updateAllergy(index, "treatment", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <button
                        type="button"
                        onClick={() => removeAllergy(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}

                {formData.medicalInformation.allergies.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No allergies added yet. Click "Add Allergy" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Current Medications
                </h3>
                <button
                  type="button"
                  onClick={addMedication}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Medication</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.medicalInformation.medications.map(
                  (medication, index) => (
                    <div
                      key={medication.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Medication Name
                          </label>
                          <input
                            type="text"
                            value={medication.name}
                            onChange={(e) =>
                              updateMedication(index, "name", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={medication.dosage}
                            onChange={(e) =>
                              updateMedication(index, "dosage", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Frequency
                          </label>
                          <input
                            type="text"
                            value={medication.frequency}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "frequency",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Route
                          </label>
                          <select
                            value={medication.route}
                            onChange={(e) =>
                              updateMedication(index, "route", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select Route</option>
                            <option value="Oral">Oral</option>
                            <option value="Topical">Topical</option>
                            <option value="Injection">Injection</option>
                            <option value="Inhaled">Inhaled</option>
                            <option value="Eye drops">Eye drops</option>
                            <option value="Ear drops">Ear drops</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prescribed By
                          </label>
                          <input
                            type="text"
                            value={medication.prescribedBy}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "prescribedBy",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={medication.startDate}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Indication
                          </label>
                          <input
                            type="text"
                            value={medication.indication}
                            onChange={(e) =>
                              updateMedication(
                                index,
                                "indication",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-3">
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  )
                )}

                {formData.medicalInformation.medications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No medications added yet. Click "Add Medication" to get
                    started.
                  </p>
                )}
              </div>
            </div>

            {/* Mental Capacity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mental Capacity Assessment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasCapacity"
                      checked={
                        formData.medicalInformation.mentalCapacity.hasCapacity
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          "medicalInformation",
                          "mentalCapacity",
                          "hasCapacity",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="hasCapacity"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Client has mental capacity to make decisions
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessment Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.medicalInformation.mentalCapacity.assessmentDate
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalInformation",
                        "mentalCapacity",
                        "assessmentDate",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessed By
                  </label>
                  <input
                    type="text"
                    value={
                      formData.medicalInformation.mentalCapacity.assessedBy
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalInformation",
                        "mentalCapacity",
                        "assessedBy",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Date
                  </label>
                  <input
                    type="date"
                    value={
                      formData.medicalInformation.mentalCapacity.reviewDate
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalInformation",
                        "mentalCapacity",
                        "reviewDate",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.medicalInformation.mentalCapacity.notes}
                    onChange={(e) =>
                      handleNestedChange(
                        "medicalInformation",
                        "mentalCapacity",
                        "notes",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* DNR Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Do Not Resuscitate (DNR) Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasDNR"
                      checked={formData.medicalInformation.dnr.hasDNR}
                      onChange={(e) =>
                        handleNestedChange(
                          "medicalInformation",
                          "dnr",
                          "hasDNR",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="hasDNR"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Client has a Do Not Resuscitate order
                    </label>
                  </div>
                </div>

                {formData.medicalInformation.dnr.hasDNR && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Issued
                      </label>
                      <input
                        type="date"
                        value={formData.medicalInformation.dnr.dateIssued}
                        onChange={(e) =>
                          handleNestedChange(
                            "medicalInformation",
                            "dnr",
                            "dateIssued",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Issued By
                      </label>
                      <input
                        type="text"
                        value={formData.medicalInformation.dnr.issuedBy}
                        onChange={(e) =>
                          handleNestedChange(
                            "medicalInformation",
                            "dnr",
                            "issuedBy",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location of DNR
                      </label>
                      <input
                        type="text"
                        value={formData.medicalInformation.dnr.location}
                        onChange={(e) =>
                          handleNestedChange(
                            "medicalInformation",
                            "dnr",
                            "location",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="familyAware"
                        checked={formData.medicalInformation.dnr.familyAware}
                        onChange={(e) =>
                          handleNestedChange(
                            "medicalInformation",
                            "dnr",
                            "familyAware",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="familyAware"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Family is aware of DNR status
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            {/* Cultural Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cultural Preferences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cultural Background
                  </label>
                  <input
                    type="text"
                    value={formData.preferences.cultural.background}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "cultural",
                        "background",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language Preferences
                  </label>
                  <input
                    type="text"
                    value={formData.preferences.cultural.languagePreferences.join(
                      ", "
                    )}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "cultural",
                        "languagePreferences",
                        e.target.value.split(", ")
                      )
                    }
                    placeholder="English, Spanish, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cultural Needs
                  </label>
                  <textarea
                    value={formData.preferences.cultural.culturalNeeds.join(
                      ", "
                    )}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "cultural",
                        "culturalNeeds",
                        e.target.value.split(", ")
                      )
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Specific cultural requirements or considerations..."
                  />
                </div>
              </div>
            </div>

            {/* Religious Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Religious Preferences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Religion
                  </label>
                  <input
                    type="text"
                    value={formData.preferences.religious.religion}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "religious",
                        "religion",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Denomination
                  </label>
                  <input
                    type="text"
                    value={formData.preferences.religious.denomination}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "religious",
                        "denomination",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Practice Level
                  </label>
                  <select
                    value={formData.preferences.religious.practiceLevel}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "religious",
                        "practiceLevel",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="non-practicing">Non-practicing</option>
                    <option value="occasional">Occasional</option>
                    <option value="regular">Regular</option>
                    <option value="devout">Devout</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="spiritualSupport"
                    checked={formData.preferences.religious.spiritualSupport}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "religious",
                        "spiritualSupport",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="spiritualSupport"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Requires spiritual support
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prayer Requirements
                  </label>
                  <textarea
                    value={formData.preferences.religious.prayerRequirements}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "religious",
                        "prayerRequirements",
                        e.target.value
                      )
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Specific prayer times, directions, or requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Dietary Requirements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dietary Requirements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diet Type
                  </label>
                  <input
                    type="text"
                    value={formData.preferences.dietary.dietType.join(", ")}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "dietary",
                        "dietType",
                        e.target.value.split(", ")
                      )
                    }
                    placeholder="Vegetarian, Vegan, Halal, Kosher, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assistance Level
                  </label>
                  <select
                    value={formData.preferences.dietary.assistanceLevel}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "dietary",
                        "assistanceLevel",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="independent">Independent</option>
                    <option value="supervision">Supervision</option>
                    <option value="partial-assistance">
                      Partial Assistance
                    </option>
                    <option value="full-assistance">Full Assistance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Preferences
                  </label>
                  <input
                    type="text"
                    value={formData.preferences.dietary.preferences.join(", ")}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "dietary",
                        "preferences",
                        e.target.value.split(", ")
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Dislikes
                  </label>
                  <input
                    type="text"
                    value={formData.preferences.dietary.dislikes.join(", ")}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "dietary",
                        "dislikes",
                        e.target.value.split(", ")
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="textureModification"
                      checked={formData.preferences.dietary.textureModification}
                      onChange={(e) =>
                        handleNestedChange(
                          "preferences",
                          "dietary",
                          "textureModification",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="textureModification"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Requires texture modification
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="fluidThickening"
                      checked={formData.preferences.dietary.fluidThickening}
                      onChange={(e) =>
                        handleNestedChange(
                          "preferences",
                          "dietary",
                          "fluidThickening",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="fluidThickening"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Requires fluid thickening
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Preferences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wake Up Time
                  </label>
                  <input
                    type="time"
                    value={formData.preferences.personal.wakeUpTime}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "personal",
                        "wakeUpTime",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bed Time
                  </label>
                  <input
                    type="time"
                    value={formData.preferences.personal.bedTime}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "personal",
                        "bedTime",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hobbies & Interests
                  </label>
                  <input
                    type="text"
                    value={formData.preferences.personal.hobbies.join(", ")}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "personal",
                        "hobbies",
                        e.target.value.split(", ")
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobility Aids
                  </label>
                  <input
                    type="text"
                    value={formData.preferences.personal.mobilityAids.join(
                      ", "
                    )}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "personal",
                        "mobilityAids",
                        e.target.value.split(", ")
                      )
                    }
                    placeholder="Walking stick, wheelchair, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
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

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? "Update Profile" : "Create Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable UI Components
const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center space-x-2 mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  full = false,
}) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const Checkbox = ({ label, checked, onChange }) => (
  <div className="flex items-center space-x-2 mt-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
    />
    <label className="text-sm text-gray-700">{label}</label>
  </div>
);
