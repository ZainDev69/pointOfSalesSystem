const mongoose = require('mongoose');
const TaskOption = require('./models/taskOptionModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const defaultTaskOptions = [
    'Medication',
    'Body Map',
    'Food',
    'Drinks',
    'Personal Care',
    'Toilet Assistance',
    'Repositioning',
    'Companionship/Respite Care',
    'Laundry',
    'Groceries',
    'House work',
    'Household Chores',
    'Incident Response'
];

async function seedTaskOptions() {
    try {
        // Clear existing task options
        await TaskOption.deleteMany({});

        // Insert default task options
        const taskOptions = defaultTaskOptions.map(name => ({ name }));
        await TaskOption.insertMany(taskOptions);

        console.log('Task options seeded successfully!');
        console.log('Default task options:', defaultTaskOptions);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding task options:', error);
        process.exit(1);
    }
}

seedTaskOptions(); 