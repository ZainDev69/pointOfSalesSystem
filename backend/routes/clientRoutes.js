const express = require('express');
const clientController = require('./../controllers/clientController')
const { validateClient } = require('../validators/clientValidator');
const validate = require('../middlewares/validateResult');

const router = express.Router();


router.get('/check-id', clientController.checkClientId);

router.route('/')
    .get(clientController.getClients)
    .post(validateClient, validate, clientController.createClient);




router.route('/:id')
    .get(clientController.getClient)
    .patch(clientController.updateClient)
    .delete(clientController.deleteClient);

router
    .route('/:id/archive')
    .patch(clientController.archiveClient);
router
    .route('/:id/unarchive')
    .patch(clientController.unarchiveClient);


module.exports = router;