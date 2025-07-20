const mongoose = require('mongoose');

const carePlanSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    version: {
        type: Number,
        required: true,
        default: 1
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'under-review', 'expired'],
        default: 'active'
    },
    assessmentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    assessedBy: {
        type: String,
        required: true
    },
    approvedBy: String,
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    reviewDate: {
        type: Date,
        required: true
    },
    personalCare: {
        washing: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        bathing: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        oralCare: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        hairCare: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        nailCare: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        skinCare: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        continence: {
            assessment: {
                bladderControl: String,
                bowelControl: String,
                causes: [String],
                triggers: [String],
                patterns: [String]
            },
            management: {
                strategy: [String],
                schedule: [String],
                products: [String],
                skinCare: [String],
                monitoring: [String]
            },
            products: [String],
            routine: [String],
            monitoring: [String]
        },
        dressing: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        }
    },
    dailyLiving: {
        housework: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        shopping: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        cooking: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        laundry: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        finances: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        appointments: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        },
        transport: {
            required: Boolean,
            frequency: String,
            assistanceLevel: String,
            equipment: [String],
            techniques: [String],
            preferences: [String],
            risks: [String],
            notes: String
        }
    },
    mobility: {
        assessment: {
            walkingAbility: String,
            balance: String,
            transfers: String,
            stairs: String,
            equipment: [String],
            risks: [String]
        },
        equipment: [String],
        transfers: [{
            type: String,
            technique: String,
            equipment: [String],
            staffRequired: Number,
            risks: [String]
        }],
        fallsPrevention: {
            riskLevel: String,
            riskFactors: [String],
            interventions: [String],
            equipment: [String],
            monitoring: [String]
        },
        exercise: {
            exercises: [{
                name: String,
                description: String,
                duration: String,
                repetitions: Number,
                precautions: [String]
            }],
            frequency: String,
            supervision: Boolean,
            equipment: [String],
            contraindications: [String]
        }
    },
    medication: {
        administration: {
            method: String,
            schedule: [{
                time: String,
                medications: [String],
                route: String,
                checks: [String]
            }],
            techniques: [String],
            equipment: [String],
            documentation: [String]
        },
        storage: {
            location: String,
            security: [String],
            temperature: String,
            accessibility: String,
            monitoring: [String]
        },
        monitoring: {
            effectiveness: [String],
            sideEffects: [String],
            compliance: [String],
            reviews: [String]
        },
        ordering: {
            responsibility: String,
            process: [String],
            frequency: String,
            supplier: String
        },
        disposal: {
            method: String,
            responsibility: String,
            documentation: [String]
        }
    },
    nutrition: {
        assessment: {
            status: String,
            bmi: Number,
            weight: Number,
            height: Number,
            appetite: String,
            swallowing: String,
            dietary: [String]
        },
        requirements: {
            calories: Number,
            protein: Number,
            supplements: [String],
            restrictions: [String],
            texture: String,
            fortification: Boolean
        },
        assistance: {
            level: String,
            equipment: [String],
            techniques: [String],
            environment: [String]
        },
        monitoring: {
            weight: String,
            intake: String,
            output: String,
            concerns: [String]
        },
        hydration: {
            dailyRequirement: Number,
            preferences: [String],
            restrictions: [String],
            assistance: String,
            monitoring: [String]
        }
    },
    communication: {
        needs: [String],
        strategies: [String],
        equipment: [String],
        training: [String]
    },
    socialEmotional: {
        needs: [String],
        interventions: [String],
        activities: [String],
        support: [String],
        monitoring: [String]
    },
    consent: [{
        type: String,
        description: String,
        consentGiven: Boolean,
        consentDate: Date,
        consentBy: String,
        witnessedBy: String,
        reviewDate: Date,
        withdrawn: Boolean,
        notes: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
carePlanSchema.index({ clientId: 1, version: -1 });
carePlanSchema.index({ clientId: 1, status: 1 });

const CarePlan = mongoose.model('CarePlan', carePlanSchema);
module.exports = CarePlan; 