const Client = require('./../models/clientModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');



exports.createClient = catchAsync(async (req, res, next) => {
    console.log("📦 Incoming Client Payload:", req.body);
    const newClient = await Client.create(req.body);
    res.status(201).json({
        status: 'Success',
        data: {
            client: newClient
        }
    });
});


exports.getClient = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const client = await Client.findById(id);
    if (!client) return next(new AppError(`No Client found with that ID`, 404));
    res.status(200).json({
        status: 'Success',
        data: client
    });

})


exports.getClients = catchAsync(async (req, res, next) => {
    const clients = await Client.find();
    res.status(200).json({
        status: 'Success',
        results: clients.length,
        data: clients
    });
})


exports.updateClient = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const client = await Client.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!client) return next(new AppError('No Client found with that ID', 404));
    res.status(200).json({
        status: 'Success',
        data: {
            client
        }
    })


})


exports.deleteClient = catchAsync(async (req, res, next) => {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return next(new AppError(`No client found with that ID`, 404));
    res.status(204).json({
        status: 'Success',
        data: 'Client deleted Successfully'
    });
})


exports.archiveClient = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const client = await Client.findByIdAndUpdate(
        id,
        { Archived: true },
        { new: true, runValidators: true }
    );

    if (!client) return next(new AppError('No Client found with that ID', 404));

    res.status(200).json({
        status: 'Success',
        data: client
    });
});


exports.unarchiveClient = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const client = await Client.findByIdAndUpdate(
        id,
        { Archived: false },
        { new: true, runValidators: true }
    );

    if (!client) return next(new AppError('No Client found with that ID', 404));

    res.status(200).json({
        status: 'Success',
        data: client
    });
});

exports.checkClientId = catchAsync(async (req, res, next) => {
    const { clientId } = req.query;
    if (!clientId) {
        return res.status(400).json({ status: 'Fail', message: 'clientId query param required' });
    }
    const clients = await Client.find({ ClientID: clientId });
    res.status(200).json({ status: 'Success', data: clients });
});






