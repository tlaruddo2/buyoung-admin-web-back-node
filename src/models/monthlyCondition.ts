import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Define the schema
const MonthlyConditionSchema = new Schema({
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    checked: {
        type: [[Boolean]], // 2D array of Booleans
        required: true
    }
});

// Create the model from the schema

const MonthlyCondition = mongoose.model('MonthlyCondition', MonthlyConditionSchema, 'monthly-condition');
export default MonthlyCondition;
