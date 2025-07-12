const express = require('express');
const clientController = require('./../controllers/clientController')
const { validateClient } = require('../validators/clientValidator');
const validate = require('../middlewares/validateResult');

const router = express.Router();

router.route('/')
    .get(clientController.getClients)
    // .post(validateClient, validate, clientController.createClient);
    .post(clientController.createClient);

router.route('/:id')
    .get(clientController.getClient)
    .patch(clientController.updateClient)
    .delete(clientController.deleteClient);

module.exports = router;