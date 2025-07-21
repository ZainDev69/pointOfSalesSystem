const mongoDB = require('./DB/mongo');
const dotenv = require('dotenv');
const app = require('./app');

require('dotenv').config();

process.on('uncaughtException', err => {
    console.log('Uncaught Exception! Shutting Down...');
    console.log(err.name, err.message);
    process.exit(1);
})


mongoDB();



const port = process.env.PORT;
if (!port) {
    throw new Error("PORT environment variable is not set!");
}
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})




process.on('unhandledRejection', err => {
    console.log('Unhandled rejection! Shutting Down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);

    });
})
