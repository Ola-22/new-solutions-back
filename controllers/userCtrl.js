const { generateToken } = require("../config/jwtToken")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const validateMongoDbId = require("../utils/validateMongodbId")
const { generateRefreshToken } = require("../config/refreshToken")
const jwt = require("jsonwebtoken")


// Create a User
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email
    const findUser = await User.findOne({ email })
    if (!findUser) {
        // Create a new User
        const newUser = await User.create(req.body)
        res.json(newUser)
    } else {
        // User Already Exists
        // res.json({
        //     msg: "User Already Exits",
        //     success: false
        // })
        throw new Error("User Already Exits")
    }
})

// Login a User
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const findUser = await User.findOne({ email });

    if (findUser && await findUser.isPasswordMatched(password)) {
        // Generate a new refresh token
        const refreshToken = await generateRefreshToken(findUser?._id);

        // Update user's refreshToken in the database
        const updateUser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, { new: true });

        // Set refreshToken as an httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000 // 72 hours
        });

        // Respond with user data and access token
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        // Invalid credentials
        res.status(401).json({ error: "Invalid credentials" });
    }
});


// Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
    console.log("first")
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken, "refreshToken")
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        }
        const accessToken = generateToken(user?.id);
        res.json({ accessToken });
    });
});

// logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate({refreshToken}, {
      refreshToken: "",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // forbidden
  });

// Update a user
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const updateUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new: true
        })
        res.json(updateUser)
    } catch (error) {
        throw new Error(error)
    }
})

// Get All Users
const getallUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

// Get a single user
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getaUser = await User.findById(id)
        res.json(getaUser)
    } catch (error) {
        throw new Error(error)
    }

})


// Block User
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const blockusr = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json(blockusr);
    } catch (error) {
        throw new Error(error);
    }

})

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const unblockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
            {
                new: true
            }
        )
        res.json({
            message: "User unBlocked",
            unblockUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

// Get a delete a user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteaUser = await User.findByIdAndDelete(id)
        res.json({ deleteaUser })
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createUser,
    loginUserCtrl,
    getallUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout
}