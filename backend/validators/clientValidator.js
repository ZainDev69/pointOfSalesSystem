const { body } = require('express-validator');

exports.validateClient = [
  // Top-Level
  body('ClientID')
    .notEmpty().withMessage('ClientID is required')
    .isLength({ min: 3 }).withMessage('ClientID must be at least 3 characters'),

  // Personal Details
  body('personalDetails.fullName')
    .notEmpty().withMessage('Full Name is required'),

  body('personalDetails.dateOfBirth')
    .notEmpty().withMessage('Date of Birth is required')
    .isISO8601().toDate().withMessage('Invalid Date format'),

  body('personalDetails.gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Non-Binary', 'Other', 'Prefer Not to Say']).withMessage('Invalid Gender'),

  body('personalDetails.nhsNumber')
    .notEmpty().withMessage('NHS Number is required'),

  // Address Information
  body('addressInformation.address')
    .notEmpty().withMessage('Address is required'),

  body('addressInformation.city')
    .notEmpty().withMessage('City is required'),

  // Contact Information
  body('contactInformation.primaryPhone')
    .notEmpty().withMessage('Primary Phone is required')
    .isMobilePhone().withMessage('Invalid phone number'),

  // Optional contact details
  body('contactInformation.email')
    .optional()
    .isEmail().withMessage('Invalid email'),

  // Next of Kin
  body('nextOfKin.name')
    .notEmpty().withMessage('Next of Kin name is required'),

  body('nextOfKin.relationship')
    .notEmpty().withMessage('Next of Kin relationship is required'),

  body('nextOfKin.phone')
    .notEmpty().withMessage('Next of Kin phone is required')
    .isMobilePhone().withMessage('Invalid Next of Kin phone number'),

  // medicalInformation.conditions (optional array of objects)
  body('medicalInformation.conditions').optional().isArray(),
  body('medicalInformation.conditions.*.condition')
    .optional().isString().withMessage('Condition must be a string'),
  body('medicalInformation.conditions.*.diagnosisDate')
    .optional().isISO8601().withMessage('Invalid diagnosis date format'),
  body('medicalInformation.conditions.*.severity')
    .optional().isString(),
  body('medicalInformation.conditions.*.status')
    .optional().isString(),

  // medicalInformation.allergies
  body('medicalInformation.allergies').optional().isArray(),
  body('medicalInformation.allergies.*.allergen')
    .optional().isString(),
  body('medicalInformation.allergies.*.reaction')
    .optional().isString(),
  body('medicalInformation.allergies.*.severity')
    .optional().isString(),

  // medicalInformation.medications
  body('medicalInformation.medications').optional().isArray(),
  body('medicalInformation.medications.*.name')
    .optional().isString(),
  body('medicalInformation.medications.*.dosage')
    .optional().isString(),
  body('medicalInformation.medications.*.startDate')
    .optional().isISO8601().withMessage('Invalid medication start date'),

  // mentalCapacity
  body('medicalInformation.mentalCapacity.hasCapacity')
    .optional().isBoolean(),
  body('medicalInformation.mentalCapacity.assessmentDate')
    .optional({ checkFalsy: true }) // will ignore empty strings, null, undefined
    .isISO8601().withMessage('Invalid mental capacity assessment date'),

  // DNR
  body('medicalInformation.dnr.hasDNR')
    .optional().isBoolean(),
  body('medicalInformation.dnr.dateIssued')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid DNR date issued'),
  body('medicalInformation.dnr.reviewDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid DNR review date'),
];
