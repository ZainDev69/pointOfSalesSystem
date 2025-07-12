const { body } = require('express-validator');

exports.validateClient = [
  body('ClientID')
    .notEmpty().withMessage('ClientID is required')
    .isLength({ min: 3 }).withMessage('ClientID must be at least 3 characters'),

  body('FullName')
    .notEmpty().withMessage('Full Name is required'),

  body('DateOfBirth')
    .notEmpty().withMessage('Date of Birth is required')
    .isISO8601().toDate().withMessage('Invalid Date format'),

  body('Gender')
    .notEmpty().withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Non-Binary', 'Other', 'Prefer Not to Say']).withMessage('Invalid Gender'),

  body('EmailAddress')
    .optional()
    .isEmail().withMessage('Invalid email'),

  body('PhoneNumber')
    .optional()
    .isMobilePhone().withMessage('Invalid phone number'),


];
