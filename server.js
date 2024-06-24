require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Country = require('./models/CountryModel');
const User = require('./models/UserModel'); // Ensure this model is properly defined
const userRoutes = require('./routes/user'); // Correctly import user routes

const app = express();
const port = 3000;

app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const secretKey = process.env.SECRET_KEY;

app.use('/users', userRoutes); // Use user routes

// Country API routes
app.get('/countries', async (req, res) => {
    try {
        const countries = await Country.find({});
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Countries retrieved successfully",
            data: countries
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: "error",
            statusCode: 500,
            message: "Internal Server Error: " + error.message
        });
    }
});

app.delete('/country/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const country = await Country.findByIdAndDelete(id);
        if (!country) {
            return res.status(404).json({ message: `Cannot find country with ID ${id}` });
        }
        res.status(200).json({ message: 'Country Deleted Successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.get('/country/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const country = await Country.findById(id);
        res.status(200).json(country);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.put('/country/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const country = await Country.findByIdAndUpdate(id, req.body, { new: true });
        if (!country) {
            return res.status(404).json({ message: `Cannot find country with ID ${id}` });
        }
        res.status(200).json(country);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.post('/country', async(req, res) => {
    try {
        const country = await Country.create(req.body);
        res.status(200).json(country);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to Mongo DB!');
        console.log('Secret Key:', secretKey);

        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
