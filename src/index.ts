import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import MonthlyCondition from './models/monthlyCondition';

const app = express();
app.use(express.json());
const port = 8000;

app.get("/", (req, res) => {
    res.send('Hello World');
});

app.get("/collections", async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections found:", collections);
        const collectionNames: string[]  = collections.map(collection => collection.name);
        res.json(collectionNames);
    } catch (error) {
        console.error("Error listing collections:", error);
        res.status(500).send("Error listing collections");
    }
});

app.get("/checklist/monthly-condition", async (req, res) => {
    try {
        const monthlyCondition = await MonthlyCondition.find();

        console.log("Documents found:", monthlyCondition);
        res.json(monthlyCondition);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send("Error fetching documents");
    }
});

app.get("/checklist/monthly-condition/:year/:month", async (req, res) => {
    const { year, month } = req.params; 

    try {
        const monthlyCondition = await MonthlyCondition.find({ year, month });

        if (!monthlyCondition || monthlyCondition.length === 0) {
            return res.status(404).send("No documents found");
        }

        res.json(monthlyCondition); // Return found documents as JSON response
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).send("Error fetching documents");
    }
});

app.put("/checklist/monthly-condition", async (req, res) => {
    try {
        const { year, month, checked } = req.body;

        if (!year || !month || !checked) {
            return res.status(400).send("Missing required fields");
        }

        const updatedCondition = await MonthlyCondition.findOneAndUpdate(
            { year, month },
            { 
                lastModified: new Date(),
                checked
            },
            { new: true } 
        );

        if (!updatedCondition) {
            return res.status(404).send("Document not found");
        }

        res.json(updatedCondition);
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).send("Error updating document");
    }
});

mongoose.connect(process.env.DB_CHECKLIST_URL!)
    .then(() => {
        console.log("Connected to db");

        app.listen(port, () => {
            console.log(`Listening on ${port}`);
        });
    })
    .catch((error) => {
        console.error("Connection failed:", error);
    });
