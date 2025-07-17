const { body } = require("express-validator");

exports.contactValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("relationship").notEmpty().withMessage("Relationship is required"),
    body("contactType").optional().isIn(["family", "friend", "neighbor", "other"]),
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("phone").optional().isString(),
    body("address").optional().isObject(),
    // Add more validations as needed
];