import mongoose from "mongoose"; 

const RowSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'please'],
        },
    },
    {
        
    }
)