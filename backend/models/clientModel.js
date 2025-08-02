const mongoose = require('mongoose');


const clientSchema = new mongoose.Schema({
    ClientID: { type: String, required: true, unique: true },
    startDate: { type: Date, default: Date.now }, // Automatically set when client is created
    reviewDate: { type: Date }, // Will be calculated as 6 months after start date
    personalDetails: {
        title: { type: String, required: true, enum: ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof', 'Rev'] },
        fullName: { type: String, required: true },
        preferredName: String,
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, required: true, enum: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'] },
        nhsNumber: { type: String, required: true },
        relationshipStatus: { type: String, enum: ['Single', 'Married', 'Civil Partnership', 'Divorced', 'Widowed', 'Separated', 'Other', 'Prefer Not to Say'] },
        ethnicity: {
            type: String, enum: [
                'White British', 'White Irish', 'White Other', 'Black Caribbean', 'Black African', 'Black Other',
                'Indian', 'Pakistani', 'Bangladeshi', 'Chinese', 'Mixed White/Black Caribbean', 'Mixed White/Asian',
                'Other Mixed', 'Other Asian', 'Other', 'Prefer Not to Say'
            ]
        },
        historyandBackground: String,
    },
    status: { type: String, enum: ['Active', 'Inactive', 'Hospitalized', 'Care Home'] },
    addressInformation: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        county: String,
        postCode: String,
        country: { type: String, default: 'United Kingdom' },
        accessInstructions: String,
    },
    contactInformation: {
        primaryPhone: { type: String, required: true },
        secondaryPhone: String,
        email: String,
        preferredContactMethod: { type: String, enum: ['Phone', 'Email', 'Post', 'In Person'] },
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
                severity: { type: String, enum: ['mild', 'moderate', 'severe', 'life-threatening'] },
                status: { type: String, enum: ['active', 'resolved', 'chronic'] },
                notes: String,
            },
        ],
        allergies: [
            {
                id: String,
                allergen: String,
                reaction: String,
                severity: { type: String, enum: ['mild', 'moderate', 'severe', 'life-threatening'] },
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
                route: { type: String, enum: ['Oral', 'Topical', 'Injection', 'Inhaled', 'Eye drops', 'Ear drops'] },
                prescribedBy: String,
                startDate: String,
                indication: String,
                status: { type: String, enum: ['active', 'discontinued', 'completed'] },
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
            languagePreferences: [String],
            culturalNeeds: [String],
        },
        religious: {
            religion: String,
            denomination: String,
            practiceLevel: { type: String, enum: ['non-practicing', 'occasional', 'regular', 'devout'] },
            prayerRequirements: String,
            spiritualSupport: Boolean,
        },
        dietary: {
            dietType: [String],
            dislikes: [String],
            preferences: [String],
            textureModification: Boolean,
            fluidThickening: Boolean,
            assistanceLevel: { type: String, enum: ['independent', 'supervision', 'partial-assistance', 'full-assistance'] },
        },
        personal: {
            wakeUpTime: String,
            bedTime: String,
            mobilityAids: [String],
            likesAndDislikes: [String],
            hobbies: [String],

        },

    },
    Archived: { type: Boolean, default: false },
    photo: { type: String, default: '' }, // URL or filename for client image
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
module.exports = { Client };
