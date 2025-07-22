const express = require('express');
const carePlanDocumentController = require('../controllers/carePlanDocumentController');
const router = express.Router({ mergeParams: true });

router.get('/:carePlanId/documents', carePlanDocumentController.getDocuments);
router.post('/:carePlanId/documents', carePlanDocumentController.addDocument);
router.patch('/:carePlanId/documents/:docId', carePlanDocumentController.updateDocument);
router.delete('/:carePlanId/documents/:docId', carePlanDocumentController.deleteDocument);
router.post('/:carePlanId/documents/attachment', carePlanDocumentController.uploadAttachment, carePlanDocumentController.uploadAttachmentHandler);

module.exports = router; 