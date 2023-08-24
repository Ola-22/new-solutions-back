const asyncHandler = require("express-async-handler")
const Blog = require("../models/blogsModel")


const createBlog = asyncHandler(async(req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({message: "The Image Is Required"})
        }

        const serverDomain = 'https://new-solutions-api.onrender.com'; // Change this to your actual server domain

        const newBlog = await Blog.create({
            description: req.body.description,
            title: req.body.title,
            image: `${serverDomain}/images/${req.file.filename}`,
        });
        res.json(newBlog)

    } catch(error){
        throw new Error(error)
    }
})
const getAllBlog = asyncHandler(async (req, res) => {
    try {
        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'limit', 'sort', 'fields', 'search'];
        excludeFields.forEach(el => delete queryObj[el]);

        let query = Blog.find();

        // Filtering by any character of the word
        if (req.query.search) {
            const searchRegex = new RegExp([...req.query.search].join('.*'), 'i');
            query = query.where("job", searchRegex);
        }

        // Sorting
        if (req.query.sort) {
            let sortOrder = req.query.orderBy === 'desc' ? -1 : 1;
        
            if (sortOrder !== -1) {
                sortOrder = 1;
            }
        
            query = query.sort({ createdAt: sortOrder });
        } else {
            let sortOrder = req.query.orderBy === 'desc' ? -1 : 1;
        
            if (sortOrder !== -1) {
                sortOrder = 1;
            }
            query = query.sort({ createdAt: sortOrder });
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

        const totalCount = await Blog.countDocuments(queryObj);

        // if (skip >= totalCount) {
        //     throw new Error('This Page does not exist');
        // }

        const Blogs = await query;

        console.log(query, "Blogs");
        res.json({
            totalBlogs: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            Blogs
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



const getSingleBlog = asyncHandler(async(req, res) => {
    const {id} = req.params
    try{
        const getBlog = await Blog.findById(id)

        res.json(getBlog)
    }catch(error){
        throw new Error(error)
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const updatedFields = {
        title: req.body.title,
        description: req.body.description
      };
  
      const serverDomain = 'https://new-solutions-api.onrender.com';

      if (req.file) {
        updatedFields.image = `${serverDomain}/images/${req.file.filename}`;
      }
  
      const getBlog = await Blog.findByIdAndUpdate(id, updatedFields, { new: true });
      
      res.json({ status: true, message: "Updated Successfully", blogs: getBlog }); 

      } catch (error) {
      throw new Error(error);
    }
  });

const deleteBlog = asyncHandler(async(req, res) => {
    const {id} = req.params
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id)

        res.json(deleteBlog)
    }catch(error){
        throw new Error(error)
    }
})
module.exports = {createBlog, getAllBlog, getSingleBlog, updateBlog, deleteBlog}