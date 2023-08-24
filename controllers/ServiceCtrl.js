const asyncHandler = require("express-async-handler")
const Service = require("../models/servicesModel")
const slugify = require("slugify")

// Create A Service
const createService = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }
        
        const serverDomain = 'https://new-solutions-api.onrender.com'; // Change this to your actual server domain

        const newService = await Service.create({
            title: req.body.title,
            description: req.body.description,
            image: `${serverDomain}/images/${req.file.filename}`
        });
                
        // Return the new service data along with the image URL
        res.json({ newService });
        
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
});


const getServices = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'limit', 'sort', 'fields', 'search', 'query'];
        excludeFields.forEach(el => delete queryObj[el]);

        let query = Service.find();


        // Filtering by any character of the word
        if (req.query.search) {
            const searchRegex = new RegExp([...req.query.search].join('.*'), 'i');
            query = query.where("job", searchRegex); // تحديد الحقل هنا
        }

        console.log(queryObj, "q")

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        const totalCount = await Service.countDocuments(queryObj);

        if (skip >= totalCount) {
            throw new Error('This Page does not exist');
        }

        const services = await query;

        console.log(query, "services")
        res.json({
            totalServices: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            services
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// get Service by id
const getSingleService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getService = await Service.findById(id)
        res.json(getService)
    } catch (error) {
        throw new Error(error)
    }
})

// Update A Service
const updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const updatedFields = {
        description: req.body.description,
        title: req.body.title,
      };
  
      if (req.file) {
        updatedFields.image = req.file.filename;
      }
  
      const getService = await Service.findByIdAndUpdate(id, updatedFields, { new: true });
      res.json({ status: true, message: "Updated Successfully" , services: getService }); 
  
    } catch (error) {
      throw new Error(error);
    }
  });

// Delete A Service
const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deleteService = await Service.findByIdAndDelete(id)
        res.json(deleteService)
    } catch (error) {
        throw new Error(error)
    }

})

module.exports = { createService, getServices, getSingleService, updateService, deleteService }