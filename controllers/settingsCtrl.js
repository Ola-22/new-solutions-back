const asyncHandler = require("express-async-handler")
const Settings = require("../models/settingsModel")
const slugify = require("slugify")

// Create A Settings
const createSettings = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const serverDomain = 'https://new-solutions-api.onrender.com'; // Change this to your actual server domain

        const newSettings = await Settings.create({
            name: req.body.name,
            address: req.body.address,
            mobile: req.body.mobile,
            secondaryMobile: req.body.secondaryMobile,
            description: req.body.description,
            email: req.body.email,
            image: `${serverDomain}/images/${req.file.filename}`
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
        const updatedFields = {
            name: req.body.name,
            address: req.body.address,
            mobile: req.body.mobile,
            secondaryMobile: req.body.secondaryMobile,
            description: req.body.description,
            email: req.body.email
          };
      
          const serverDomain = 'https://new-solutions-api.onrender.com';
    
          if (req.file) {
            updatedFields.image = `${serverDomain}/images/${req.file.filename}`;
          }
      

        const updatedSettings = await Settings.findOneAndUpdate(
            {}, // Update the first document (assuming there's only one)
            updatedFields, // Update with the request body
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