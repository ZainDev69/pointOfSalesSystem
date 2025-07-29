const mongoose = require('mongoose');

// Define enum values for various fields
const ENUMS = {
    TITLES: ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof', 'Rev'],
    GENDERS: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
    RELATIONSHIP_STATUSES: ['Single', 'Married', 'Civil Partnership', 'Divorced', 'Widowed', 'Separated', 'Other', 'Prefer Not to Say'],
    ETHNICITIES: [
        'White British', 'White Irish', 'White Other', 'Black Caribbean', 'Black African', 'Black Other',
        'Indian', 'Pakistani', 'Bangladeshi', 'Chinese', 'Mixed White/Black Caribbean', 'Mixed White/Asian',
        'Other Mixed', 'Other Asian', 'Other', 'Prefer Not to Say'
    ],
    STATUSES: ['Active', 'Inactive', 'Hospitalized', 'Care Home'],
    CONTACT_METHODS: ['Phone', 'Email', 'Post', 'In Person'],
    SEVERITY_LEVELS: ['mild', 'moderate', 'severe', 'life-threatening'],
    CONDITION_STATUSES: ['active', 'resolved', 'chronic'],
    MEDICATION_ROUTES: ['Oral', 'Topical', 'Injection', 'Inhaled', 'Eye drops', 'Ear drops'],
    MEDICATION_STATUSES: ['active', 'discontinued', 'completed'],
    PRACTICE_LEVELS: ['non-practicing', 'occasional', 'regular', 'devout'],
    ASSISTANCE_LEVELS: ['independent', 'supervision', 'partial-assistance', 'full-assistance'],
    BATH_SHOWER_PREFERENCES: ['bath', 'shower', 'no-preference'],
    COUNTRIES: ['United Kingdom', 'England', 'Scotland', 'Wales', 'Northern Ireland']
};

const clientSchema = new mongoose.Schema({
    ClientID: { type: String, required: true, unique: true },
    startDate: { type: Date, default: Date.now }, // Automatically set when client is created
    reviewDate: { type: Date }, // Will be calculated as 6 months after start date
    personalDetails: {
        title: { type: String, required: true, enum: ENUMS.TITLES },
        fullName: { type: String, required: true },
        preferredName: String,
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, required: true, enum: ENUMS.GENDERS },
        nhsNumber: { type: String, required: true },
        relationshipStatus: { type: String, enum: ENUMS.RELATIONSHIP_STATUSES },
        ethnicity: { type: String, enum: ENUMS.ETHNICITIES },
    },
    status: { type: String, enum: ENUMS.STATUSES },
    addressInformation: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        county: String,
        postCode: String,
        country: { type: String, default: 'United Kingdom', enum: ENUMS.COUNTRIES },
        accessInstructions: String,
    },
    contactInformation: {
        primaryPhone: { type: String, required: true },
        secondaryPhone: String,
        email: String,
        preferredContactMethod: { type: String, enum: ENUMS.CONTACT_METHODS },
        bestTimeToContact: String,
    },
    consent: {
        photoConsent: Boolean,
        dataProcessingConsent: Boolean,
    },
    healthcareContacts: {
        gp: {
            id: String,
            name: String,
            role: String,
            organization: String,
            phone: String,
            email: String,
        },
        surgery: {
            name: String,
            phone: String,
            email: String,
            outOfHoursNumber: String,
            address: String
        },
    },
    medicalInformation: {
        conditions: [
            {
                id: String,
                condition: String,
                diagnosisDate: String,
                severity: { type: String, enum: ENUMS.SEVERITY_LEVELS },
                status: { type: String, enum: ENUMS.CONDITION_STATUSES },
                notes: String,
            },
        ],
        allergies: [
            {
                id: String,
                allergen: String,
                reaction: String,
                severity: { type: String, enum: ENUMS.SEVERITY_LEVELS },
                treatment: String,
                notes: String,
            },
        ],
        medications: [
            {
                id: String,
                name: String,
                dosage: String,
                frequency: String,
                route: { type: String, enum: ENUMS.MEDICATION_ROUTES },
                prescribedBy: String,
                startDate: String,
                indication: String,
                status: { type: String, enum: ENUMS.MEDICATION_STATUSES },
            },
        ],
        mentalCapacity: {
            hasCapacity: Boolean,
            assessmentDate: String,
            assessedBy: String,
            specificDecisions: [String],
            supportNeeds: [String],
            reviewDate: String,
            notes: String,
        },
        dnr: {
            hasDNR: Boolean,
            dateIssued: String,
            issuedBy: String,
            reviewDate: String,
            location: String,
            familyAware: Boolean,
            notes: String,
        },
    },
    preferences: {
        cultural: {
            background: String,
            traditions: [String],
            importantDates: [String],
            languagePreferences: [String],
            culturalNeeds: [String],
        },
        religious: {
            religion: String,
            denomination: String,
            practiceLevel: { type: String, enum: ENUMS.PRACTICE_LEVELS },
            religiousNeeds: [String],
            prayerRequirements: String,
            dietaryRestrictions: [String],
            holyDays: [String],
            spiritualSupport: Boolean,
        },
        dietary: {
            dietType: [String],
            allergies: [String],
            dislikes: [String],
            preferences: [String],
            textureModification: Boolean,
            fluidThickening: Boolean,
            assistanceLevel: { type: String, enum: ENUMS.ASSISTANCE_LEVELS },
            specialEquipment: [String],
            nutritionalSupplements: [String],
            feedingTimes: [String],
        },
        personal: {
            wakeUpTime: String,
            bedTime: String,
            bathingPreferences: {
                frequency: String,
                timeOfDay: String,
                bathOrShower: { type: String, enum: ENUMS.BATH_SHOWER_PREFERENCES },
                temperature: String,
                privacy: String,
                assistance: String,
                products: [String],
            },
            dressingPreferences: {
                assistance: String,
                clothing: [String],
                footwear: [String],
                accessories: [String],
                adaptations: [String],
            },
            mobilityAids: [String],
            comfortItems: [String],
            routines: [String],
            hobbies: [String],
            interests: [String],
        },
    },
    Archived: { type: Boolean, default: false },
    photo: { type: String, default: '' }, // URL or filename for client image
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

// Export the enums for use in other parts of the application
module.exports = { Client, ENUMS };
