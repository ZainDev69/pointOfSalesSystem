const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.json());



app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(helmet());



const clientRouter = require('./routes/clientRoutes');
const contactRoutes = require("./routes/contactRoutes");
const carePlanRoutes = require("./routes/carePlanRoutes");
const riskAssessmentRoutes = require('./routes/riskAssessmentRoutes');
const visitScheduleRoutes = require('./routes/visitScheduleRoutes');
const carePlanDocumentRoutes = require('./routes/carePlanDocumentRoutes');
const documentRoutes = require('./routes/documentRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const outcomeRoutes = require('./routes/outcomeRoutes');
const visitTypeRoutes = require('./routes/visitTypeRoutes');

app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
});


app.use('/clients', clientRouter);
app.use('/contacts', contactRoutes);
app.use('/clients/:clientId/contacts', contactRoutes);
app.use('/clients/:clientId/visits', visitScheduleRoutes);
app.use('/risk-assessments', riskAssessmentRoutes);
app.use('/documents', documentRoutes);
app.use('/careplans', carePlanDocumentRoutes);
app.use('/communications', communicationRoutes);
app.use('/outcomes', outcomeRoutes);
app.use('/activity-logs', require('./routes/activityLogRoutes'));
app.use('/', visitTypeRoutes);
app.use("/", carePlanRoutes);




if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})


app.use(globalErrorHandler)
module.exports = app;
