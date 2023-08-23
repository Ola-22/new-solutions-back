const asyncHandler = require("express-async-handler")
const Settings = require("../models/settingsModel")
const slugify = require("slugify")

// Create A Settings
const createSettings = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        
        const newSettings = await Settings.create({
            name: req.body.name,
            address: req.body.address,
            image: req.file.filename,
            mobile: req.body.mobile,
            secondaryMobile: req.body.secondaryMobile,
            description: req.body.description,
            email: req.body.email
        });

        console.log(req.body)
        res.json(newSettings);
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
});


const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne(); // Assuming there's only one settings document
        if (!settings) {
            return res.status(404).json({ status: false, message: 'Settings not found' });
        }

        res.json({ status: true, settings: settings.toObject() }); // Convert to plain JavaScript object
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};

// Update A Settings
const updateSettings = async (req, res) => {
    try {
        const updatedSettings = await Settings.findOneAndUpdate(
            {}, // Update the first document (assuming there's only one)
            req.body, // Update with the request body
            { new: true } // Return the updated document
        );
        if (!updatedSettings) {
            return res.status(404).json({ status: false, message: 'Settings not found' });
        }

        res.json({ status: true, message: "Updated Successfully" , settings: updatedSettings.toObject() }); // Return the updated settings
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};

module.exports = { createSettings, getSettings, updateSettings }