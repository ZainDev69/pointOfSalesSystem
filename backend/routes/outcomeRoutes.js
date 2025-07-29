const express = require('express');
const router = express.Router();
const outcomeController = require('../controllers/outcomeController');

// Get outcomes by client
router.get('/client/:clientId', outcomeController.getOutcomesByClient);

// Get outcome options for select dropdowns (specific route first)
router.get('/options/all', outcomeController.getOutcomeOptions);

// Filter outcomes by multiple criteria (specific route first)
router.get('/filter', outcomeController.filterOutcomes);

// Create outcome
router.post('/', outcomeController.createOutcome);

// Add progress to outcome (specific route before parameterized routes)
router.post('/:id/progress', outcomeController.addOutcomeProgress);

// Update outcome
router.put('/:id', outcomeController.updateOutcome);
router.patch('/:id', outcomeController.updateOutcome);

// Delete outcome
router.delete('/:id', outcomeController.deleteOutcome);

module.exports = router; 