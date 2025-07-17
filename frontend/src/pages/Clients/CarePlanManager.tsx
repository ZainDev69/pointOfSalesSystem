import React, { useState } from "react";
import {
  Plus,
  Shield,
  Edit3,
  Eye,
  Calendar,
  User,
  Clock,
  Target,
  FileText,
} from "lucide-react";
import { CarePlanForm } from "./CarePlanForm";

export function CarePlanManager({ clientId, carePlan, onUpdateCarePlan }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [view, setView] = useState("view");

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "personal-care", label: "Personal Care", icon: User },
    { id: "daily-living", label: "Daily Living", icon: FileText },
    { id: "outcomes", label: "Outcomes", icon: Target },
  ];

  // Mock care plan data for demonstration
  const mockCarePlan = {
    id: "1",
    assessmentDate: new Date().toISOString().split("T")[0],
    assessedBy: "Sarah Johnson",
    approvedBy: "Dr. Emma Wilson",
    startDate: new Date().toISOString().split("T")[0],
    reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "active",
    personalCare: {
      washing: {
        required: true,
        frequency: "Daily",
        assistanceLevel: "partial-assistance",
        equipment: ["Shower chair", "Non-slip mat"],
        techniques: ["Gentle assistance", "Respect privacy"],
        preferences: ["Morning wash preferred", "Warm water"],
        risks: ["Slipping risk"],
        notes: "Client prefers to wash face independently",
      },
      bathing: {
        required: true,
        frequency: "Twice weekly",
        assistanceLevel: "full-assistance",
        equipment: ["Hoist", "Bath board"],
        techniques: ["Two-person lift", "Check water temperature"],
        preferences: ["Tuesday and Friday", "Lavender bath products"],
        risks: ["Transfer risk", "Water temperature"],
        notes: "Enjoys relaxing bath time",
      },
      oralCare: {
        required: true,
        frequency: "Twice daily",
        assistanceLevel: "supervision",
        equipment: ["Electric toothbrush", "Fluoride toothpaste"],
        techniques: ["Gentle reminder", "Check completion"],
        preferences: ["After breakfast and before bed"],
        risks: ["Choking risk with water"],
        notes: "Has own teeth, good oral health",
      },
      hairCare: {
        required: true,
        frequency: "Weekly",
        assistanceLevel: "partial-assistance",
        equipment: ["Gentle shampoo", "Wide-tooth comb"],
        techniques: ["Gentle massage", "Careful combing"],
        preferences: ["Prefers hairdresser visit monthly"],
        risks: ["Neck strain"],
        notes: "Enjoys having hair styled",
      },
      nailCare: {
        required: true,
        frequency: "Fortnightly",
        assistanceLevel: "full-assistance",
        equipment: ["Nail clippers", "Emery board"],
        techniques: ["Soak first", "Cut straight across"],
        preferences: ["Clear nail polish"],
        risks: ["Cutting too short", "Infection"],
        notes: "Diabetic - extra care needed",
      },
      skinCare: {
        required: true,
        frequency: "Daily",
        assistanceLevel: "partial-assistance",
        equipment: ["Moisturizer", "Barrier cream"],
        techniques: ["Check for pressure areas", "Gentle application"],
        preferences: ["Unscented products"],
        risks: ["Pressure sores", "Skin tears"],
        notes: "Fragile skin, monitor closely",
      },
      continence: {
        assessment: {
          bladderControl: "occasional-incontinence",
          bowelControl: "continent",
          causes: ["Mobility issues", "Medication side effects"],
          triggers: ["Coughing", "Sudden movements"],
          patterns: ["More frequent in mornings"],
        },
        management: {
          strategy: ["Timed toileting", "Pelvic floor exercises"],
          schedule: ["Every 2 hours", "Before meals", "Before bed"],
          products: ["Incontinence pads", "Waterproof mattress protector"],
          skinCare: ["Barrier cream", "Gentle cleansing"],
          monitoring: ["Fluid intake chart", "Continence diary"],
        },
        products: ["Day pads", "Night pads"],
        routine: ["Morning toilet visit", "Regular prompting"],
        monitoring: ["Weekly review", "Skin condition checks"],
      },
      dressing: {
        required: true,
        frequency: "Daily",
        assistanceLevel: "partial-assistance",
        equipment: ["Dressing aids", "Velcro fastenings"],
        techniques: ["Sit to dress", "Dress affected side first"],
        preferences: ["Comfortable clothes", "Favorite colors"],
        risks: ["Falls while dressing", "Shoulder strain"],
        notes: "Prefers to choose own clothes",
      },
    },
    dailyLiving: {
      housework: {
        required: true,
        frequency: "Weekly",
        assistanceLevel: "full-assistance",
        equipment: ["Vacuum cleaner", "Cleaning supplies"],
        techniques: ["Room by room approach", "Safety first"],
        preferences: ["Tidy environment", "Fresh flowers"],
        risks: ["Chemical exposure", "Lifting heavy items"],
        notes: "Client likes to supervise cleaning",
      },
      shopping: {
        required: true,
        frequency: "Weekly",
        assistanceLevel: "full-assistance",
        equipment: ["Shopping list", "Trolley"],
        techniques: ["Plan ahead", "Check expiry dates"],
        preferences: ["Local shops", "Fresh produce"],
        risks: ["Heavy lifting", "Crowded spaces"],
        notes: "Enjoys choosing own groceries",
      },
      cooking: {
        required: true,
        frequency: "Daily",
        assistanceLevel: "supervision",
        equipment: ["Adaptive utensils", "Timer"],
        techniques: ["Simple recipes", "Safety checks"],
        preferences: ["Traditional meals", "Home cooking"],
        risks: ["Burns", "Cuts", "Gas safety"],
        notes: "Experienced cook, needs safety reminders",
      },
      laundry: {
        required: true,
        frequency: "Twice weekly",
        assistanceLevel: "full-assistance",
        equipment: ["Washing machine", "Gentle detergent"],
        techniques: ["Sort by color", "Check pockets"],
        preferences: ["Line drying when possible"],
        risks: ["Heavy lifting", "Chemical exposure"],
        notes: "Prefers clothes aired outside",
      },
      finances: {
        required: false,
        frequency: "Monthly",
        assistanceLevel: "supervision",
        equipment: ["Calculator", "Filing system"],
        techniques: ["Check statements", "Budget planning"],
        preferences: ["Family involvement"],
        risks: ["Financial abuse", "Confusion"],
        notes: "Son helps with major decisions",
      },
      appointments: {
        required: true,
        frequency: "As needed",
        assistanceLevel: "full-assistance",
        equipment: ["Diary", "Transport"],
        techniques: ["Advance booking", "Reminder calls"],
        preferences: ["Morning appointments"],
        risks: ["Missed appointments", "Transport issues"],
        notes: "Needs escort to appointments",
      },
      transport: {
        required: true,
        frequency: "As needed",
        assistanceLevel: "full-assistance",
        equipment: ["Wheelchair", "Taxi vouchers"],
        techniques: ["Book in advance", "Accessible vehicles"],
        preferences: ["Familiar drivers"],
        risks: ["Transfer difficulties", "Motion sickness"],
        notes: "Uses wheelchair for longer distances",
      },
    },
    mobility: {
      assessment: {
        walkingAbility: "Uses walking frame indoors",
        balance: "Poor balance, high fall risk",
        transfers: "Needs assistance with all transfers",
        stairs: "Unable to manage stairs",
        equipment: ["Walking frame", "Wheelchair"],
        risks: ["Falls", "Injury during transfers"],
      },
      equipment: ["Walking frame", "Wheelchair", "Grab rails"],
      transfers: [
        {
          type: "Bed to chair",
          technique: "Stand and pivot",
          equipment: ["Transfer board"],
          staffRequired: 1,
          risks: ["Falls", "Skin tears"],
        },
      ],
      fallsPrevention: {
        riskLevel: "high",
        riskFactors: ["Previous falls", "Medication effects", "Poor balance"],
        interventions: ["Exercise program", "Environmental modifications"],
        equipment: ["Hip protectors", "Alarm mat"],
        monitoring: ["Daily mobility checks", "Incident reporting"],
      },
      exercise: {
        exercises: [
          {
            name: "Seated leg exercises",
            description: "Ankle pumps and leg extensions",
            duration: "10 minutes",
            repetitions: 10,
            precautions: ["Stop if pain", "Support if dizzy"],
          },
        ],
        frequency: "Daily",
        supervision: true,
        equipment: ["Exercise chair", "Resistance bands"],
        contraindications: ["Acute illness", "Severe pain"],
      },
    },
    medication: {
      administration: {
        method: "administered-by-carer",
        schedule: [
          {
            time: "08:00",
            medications: ["Metformin 500mg", "Ramipril 5mg"],
            route: "Oral",
            checks: ["Identity check", "Allergy check", "Expiry date"],
          },
        ],
        techniques: ["Crush if needed", "With food"],
        equipment: ["Dosette box", "Pill crusher"],
        documentation: ["MAR chart", "Medication log"],
      },
      storage: {
        location: "Locked cabinet in kitchen",
        security: ["Key held by senior carer", "Temperature monitoring"],
        temperature: "Room temperature",
        accessibility: "Carer access only",
        monitoring: ["Weekly stock check", "Expiry date monitoring"],
      },
      monitoring: {
        effectiveness: ["Blood pressure monitoring", "Blood sugar checks"],
        sideEffects: ["Nausea monitoring", "Dizziness checks"],
        compliance: ["Medication taken as prescribed"],
        reviews: ["Monthly GP review", "Pharmacy review"],
      },
      ordering: {
        responsibility: "Senior Carer",
        process: ["Check stock levels", "Order 7 days in advance"],
        frequency: "Monthly",
        supplier: "Local Pharmacy",
      },
      disposal: {
        method: "Return to pharmacy",
        responsibility: "Senior Carer",
        documentation: ["Disposal log", "Witness signature"],
      },
    },
    nutrition: {
      assessment: {
        status: "at-risk",
        bmi: 22.5,
        weight: 65,
        height: 170,
        appetite: "Variable",
        swallowing: "Normal",
        dietary: ["Diabetic diet", "Low sodium"],
      },
      requirements: {
        calories: 1800,
        protein: 70,
        supplements: ["Vitamin D", "Calcium"],
        restrictions: ["Low sugar", "Low salt"],
        texture: "Normal",
        fortification: true,
      },
      assistance: {
        level: "supervision",
        equipment: ["Adaptive cutlery", "Non-slip mat"],
        techniques: ["Encourage small frequent meals"],
        environment: ["Quiet dining area", "Good lighting"],
      },
      monitoring: {
        weight: "Weekly",
        intake: "Daily food diary",
        output: "Monitor for changes",
        concerns: ["Weight loss", "Poor appetite"],
      },
      hydration: {
        dailyRequirement: 2000,
        preferences: ["Tea", "Water", "Fruit juice"],
        restrictions: ["Limit caffeine"],
        assistance: "Prompting",
        monitoring: ["Fluid chart", "Urine color"],
      },
    },
    communication: {
      needs: ["Hearing aid maintenance", "Large print materials"],
      strategies: ["Face-to-face communication", "Clear speech"],
      equipment: ["Hearing aids", "Magnifying glass"],
      training: ["Staff communication training"],
    },
    socialEmotional: {
      needs: ["Social interaction", "Mental stimulation"],
      interventions: ["Daily conversation", "Activity program"],
      activities: ["Reading", "Music", "Puzzles"],
      support: ["Family visits", "Peer support"],
      monitoring: ["Mood assessment", "Social engagement"],
    },
    outcomes: [
      {
        id: "1",
        goal: "Maintain independence in personal care",
        measurable:
          "Client will continue to wash face and brush teeth independently with supervision",
        achievable: true,
        timeframe: "6 months",
        progress: [
          {
            date: new Date().toISOString().split("T")[0],
            progress: "Client maintaining independence well",
            evidence: "Daily care logs show consistent self-care",
            nextSteps: ["Continue current support level"],
            recordedBy: "Emma Wilson",
          },
        ],
        status: "in-progress",
      },
      {
        id: "2",
        goal: "Reduce fall risk",
        measurable:
          "Zero falls in next 3 months through environmental modifications and mobility support",
        achievable: true,
        timeframe: "3 months",
        progress: [],
        status: "not-started",
      },
    ],
    consent: [
      {
        id: "1",
        type: "Care Plan Agreement",
        description: "Consent to care plan implementation",
        consentGiven: true,
        consentDate: new Date().toISOString().split("T")[0],
        consentBy: "Client",
        witnessedBy: "Sarah Johnson",
        reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        withdrawn: false,
        notes: "Client fully understands and agrees to care plan",
      },
    ],
    version: 1,
    previousVersions: [],
  };

  const currentCarePlan = carePlan || mockCarePlan;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOutcomeStatusColor = (status) => {
    switch (status) {
      case "achieved":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      case "not-achieved":
        return "bg-red-100 text-red-800";
      case "modified":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (view === "edit") {
    return (
      <CarePlanForm
        carePlan={currentCarePlan}
        onBack={() => setView("view")}
        onSave={(carePlan) => {
          onUpdateCarePlan(carePlan);
          setView("view");
        }}
      />
    );
  }

  if (!currentCarePlan) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Care Plan
          </h3>
          <p className="text-gray-600 mb-4">
            No care plan has been created for this client yet.
          </p>
          <button
            onClick={() => setView("edit")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Care Plan</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Care Plan</h2>
          <p className="text-gray-600 mt-1">
            Comprehensive care planning and outcome tracking
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              currentCarePlan.status
            )}`}
          >
            {currentCarePlan.status}
          </span>
          <button
            onClick={() => setView("edit")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Plan</span>
          </button>
        </div>
      </div>

      {/* Care Plan Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Assessment Date</p>
            <p className="font-medium text-gray-900">
              {new Date(currentCarePlan.assessmentDate).toLocaleDateString()}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Assessed By</p>
            <p className="font-medium text-gray-900">
              {currentCarePlan.assessedBy}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Review Due</p>
            <p className="font-medium text-gray-900">
              {new Date(currentCarePlan.reviewDate).toLocaleDateString()}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-sm text-gray-600">Version</p>
            <p className="font-medium text-gray-900">
              v{currentCarePlan.version}
            </p>
          </div>
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

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Care Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Care Needs
            </h3>
            <div className="space-y-3">
              {Object.entries(currentCarePlan.personalCare || {}).map(
                ([key, care]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        care?.required
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {care?.required ? "Required" : "Not Required"}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Daily Living Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Daily Living Support
            </h3>
            <div className="space-y-3">
              {Object.entries(currentCarePlan.dailyLiving || {}).map(
                ([key, support]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        support?.required
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {support?.required ? "Required" : "Not Required"}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "outcomes" && (
        <div className="space-y-6">
          {/* Outcomes Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {currentCarePlan.outcomes?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Total Outcomes</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {currentCarePlan.outcomes?.filter(
                    (o) => o.status === "achieved"
                  ).length || 0}
                </p>
                <p className="text-sm text-gray-600">Achieved</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {currentCarePlan.outcomes?.filter(
                    (o) => o.status === "in-progress"
                  ).length || 0}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {currentCarePlan.outcomes?.filter(
                    (o) => o.status === "not-achieved"
                  ).length || 0}
                </p>
                <p className="text-sm text-gray-600">Not Achieved</p>
              </div>
            </div>
          </div>

          {/* Outcomes List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Care Outcomes
                </h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span>Add Outcome</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {currentCarePlan.outcomes?.map((outcome) => (
                <div key={outcome.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">
                          {outcome.goal}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeStatusColor(
                            outcome.status
                          )}`}
                        >
                          {outcome.status.replace("-", " ")}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">
                        {outcome.measurable}
                      </p>

                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Timeframe: {outcome.timeframe}</span>
                        <span>
                          Progress entries: {outcome.progress?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No outcomes defined
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add measurable outcomes to track care plan effectiveness.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto">
                    <Plus className="w-4 h-4" />
                    <span>Add First Outcome</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Other tab content placeholders */}
      {activeTab !== "overview" && activeTab !== "outcomes" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tabs.find((tab) => tab.id === activeTab)?.label} Section
            </h3>
            <p className="text-gray-600">
              This section shows detailed{" "}
              {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}{" "}
              information from the care plan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
