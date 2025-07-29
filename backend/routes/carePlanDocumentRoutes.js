const express = require('express');
const carePlanDocumentController = require('../controllers/carePlanDocumentController');
const router = express.Router({ mergeParams: true });


router.post('/:carePlanId/documents/attachment', carePlanDocumentController.uploadAttachment, carePlanDocumentController.uploadAttachmentHandler);


// Client-level document management
router.route('/client/:clientId/documents')
    .get(carePlanDocumentController.getAllDocumentsForClient)
    .post(carePlanDocumentController.addDocumentForClient);

router.route('/client/:clientId/documents/:docId')
    .patch(carePlanDocumentController.updateDocumentForClient)
    .delete(carePlanDocumentController.deleteDocumentForClient);

module.exports = router; 
