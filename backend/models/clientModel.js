const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    ClientID: {
        type: String,
        required: [true, 'Client ID is required'],
        unique: true
    },
    FullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    PreferredName: {
        type: String
    },
    DateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    Gender: {
        type: String,
        enum: ['Male', 'Female', 'Non-Binary', 'Other', 'Prefer not to say'],
        required: true
    },

    Address: {
        type: String
    },
    PhoneNumber: {
        type: String
    },
    EmailAddress: {
        type: String,
        lowercase: true
    },
    NHSNumber: {
        type: String
    },
    Ethnicity: {
        type: String
    },
    Religion: {
        type: String
    },
    RelationshipStatus: {
        type: String
    },
    SexualOrientation: {
        type: String
    },
    ServiceStatus: {
        type: String,
        enum: ['Active', 'Inactive', 'Hospitalized', 'Care Home'],
        default: 'Active'
    },
    StartDate: {
        type: Date,
        default: Date.now
    },
    Notes: {
        type: String
    },
    Archived: {
        type: Boolean,
        default: false
    }

});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
