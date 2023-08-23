const asyncHandler = require("express-async-handler")
const Employee = require("../models/employeesModel")


const createEmployee = asyncHandler(async(req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({message: "The Image Is Required"})
        }

        const newEmployee = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            image: req.file.filename,
            job: req.body.job
        })
        res.json(newEmployee)

    } catch(error){
        throw new Error(error)
    }
})
const getAllEmployee = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'limit', 'sort', 'fields', 'search'];
        excludeFields.forEach(el => delete queryObj[el]);

        let query = Employee.find();

        // Filtering by any character of the word
        if (req.query.search) {
            const searchRegex = new RegExp([...req.query.search].join('.*'), 'i');
            query = query.where("job", searchRegex);
        }

        // Sorting
        if (req.query.sort) {
            let sortField = req.query.sort; // Assuming sort parameter contains the field name
            let sortOrder = req.query.orderBy === 'desc' ? -1 : 1;
        
            query = query.sort({ [sortField]: sortOrder });
        } else {
            // Default sorting by createdAt
            query = query.sort({ createdAt: -1 });
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

        const totalCount = await Employee.countDocuments(queryObj);

        // if (skip >= totalCount) {
        //     throw new Error('This Page does not exist');
        // }

        console.log(totalCount, "totalCount")

        const employees = await query;

        console.log(query, "employees");
        res.json({
            totalEmployees: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            employees
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const getSingleEmployee = asyncHandler(async(req, res) => {
    const {id} = req.params
    try{
        const getEmployee = await Employee.findById(id)

        res.json(getEmployee)
    }catch(error){
        throw new Error(error)
    }
})


const updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const updatedFields = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        job: req.body.job
      };
  
      if (req.file) {
        updatedFields.image = req.file.filename;
      }
  
      const getEmployee = await Employee.findByIdAndUpdate(id, updatedFields, { new: true });
      res.json({ status: true, message: "Updated Successfully", employees: getEmployee }); 
  
      console.log(req.body, "getEmployee");
    } catch (error) {
      throw new Error(error);
    }
  });

  
const deleteEmployee = asyncHandler(async(req, res) => {
    const {id} = req.params
    try{
        const deleteEmployee = await Employee.findByIdAndDelete(id)

        res.json(deleteEmployee)
    }catch(error){
        throw new Error(error)
    }
})
module.exports = {createEmployee, getAllEmployee, getSingleEmployee, updateEmployee, deleteEmployee}