const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());



app.use(cors({
    origin: process.env.ORIGIN,
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());



const clientRouter = require('./routes/clientRoutes');
const contactRoutes = require("./routes/contactRoutes");
const carePlanRoutes = require("./routes/carePlanRoutes");

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});

app.use('/clients', clientRouter);
app.use("/api/clients", contactRoutes);
app.use("/", carePlanRoutes);




if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})


app.use(globalErrorHandler)
module.exports = app;
