const asyncHandler = require("express-async-handler")
const Project = require("../models/projectModel")
const slugify = require("slugify")

// Create A Project
const createProject = asyncHandler(async (req, res) => {
    try {
        // if (!req.file) {
        //     return res.status(400).json({ message: 'Image is required' });
        // }
    
        const serverDomain = 'https://new-solutions-api.onrender.com'; // Change this to your actual server domain

        const newProject = await Project.create({
            title: req.body.title,
            description: req.body.description,
            image: `${serverDomain}/images/${req.file.filename}`,
            type: req.body.type
        });

        res.json(newProject);
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
});

// Get All Products
const getProjects = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        
        // Remove keys with empty values
        for (const key in queryObj) {
            if (!queryObj[key]) {
                delete queryObj[key];
            }
        }
        
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
 
        let query;
        
        // Check if queryObj is empty
        if (Object.keys(queryObj).length === 0) {
            query = Project.find();
        } else {
            query = Project.find(JSON.parse(queryStr));
        }

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createdAt");
        }

        // Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }
 
        // Pagination
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to limit 10
        const skip = (page - 1) * limit;
 
        query = query.skip(skip).limit(limit);
 
        const totalCount = await Project.countDocuments(queryObj);
 
        if (skip >= totalCount) {
            throw new Error("This Page does not exist");
        }
 
        const projects = await query;
 
        res.json({
            totalProjects: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            projects
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// get Project by id
const getSingleProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getProject = await Project.findById(id)
        res.json(getProject)
    } catch (error) {
        throw new Error(error)
    }
})

// Update A Project
const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const updatedFields = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type
      };

      const serverDomain = 'https://new-solutions-api.onrender.com';

      if (req.file) {
        updatedFields.image = `${serverDomain}/images/${req.file.filename}`;
      }
  
      const getProject = await Project.findByIdAndUpdate(id, updatedFields, { new: true });
  
      res.json({ status: true, message: "Updated Successfully", projects: getProject }); 
      console.log(req.body, "getProject");
    } catch (error) {
      throw new Error(error);
    }
  });
  

// Delete A Project
const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deleteProject = await Project.findByIdAndDelete(id)
        res.json(deleteProject)
    } catch (error) {
        throw new Error(error)
    }

})

module.exports = { createProject, getProjects, getSingleProject, updateProject, deleteProject }