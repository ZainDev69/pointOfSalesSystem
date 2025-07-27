const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');

// Enums for dropdowns
router.get('/initiated-by', communicationController.getInitiatedByEnum);
router.get('/types', communicationController.getCommunicationTypeEnum);
router.get('/categories', communicationController.getCategoryEnum);
router.get('/statuses', communicationController.getStatusEnum);

// CRUD
router.post('/', communicationController.createCommunication);
router.get('/client/:clientId', communicationController.getCommunicationsByClient);
router.get('/:id', communicationController.getCommunication);
router.put('/:id', communicationController.updateCommunication);
router.delete('/:id', communicationController.deleteCommunication);

module.exports = router; 