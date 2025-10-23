import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};
    }catch(err){
        throw new ApiError(500, "Token generation failed something went wrong");
    }
} 
const registerUser = asyncHandler(async (req, res) => {
    // Registration logic here
    //get user details from frontend
    //validation - not empty
    //check if user already exists: username or email
    //check for images , check for avatar
    //if yes upload to cloudinary , avatar
    // create a userobject - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response

    const { fullname, email, username, password } = req.body
    // if(fullname === ""){
    //     throw new ApiError(400, "Fullname is required");
    // }
    if(
    [fullname, email, username, password].some(field => typeof field !== "string" || field.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or:[{username} , {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400, "Failed to upload avatar");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
    username: username.trim().toLowerCase()           
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(new ApiResponse(
        201, createdUser, "User created successfully"
    ));

});

const LoginUser = asyncHandler(async (req, res) => {
    //req -> data from the database
    //using username or email and password
    //find the user from db
    //if not found send error
    //if found check for password match
    //if not match send error
    //if match generate access token and refresh token
    //store refresh token in db for that user
    //send response with access token and refresh token in httponly cookie

    const {email, username, password} = req.body;
    if(!username && !email){
        throw new ApiError(400, "Username or Email is required");
    }

    if(!password){
        throw new ApiError(400, "Password is required");
    }

    const normalizedUsername = typeof username === "string" ? username.trim().toLowerCase() : null;
    const normalizedEmail = typeof email === "string" ? email.trim() : null;

    const queryOptions = [];
    if(normalizedUsername){
        queryOptions.push({username: normalizedUsername});
    }
    if(normalizedEmail){
        queryOptions.push({email: normalizedEmail});
    }

    const user = await User.findOne({
        $or: queryOptions
    });

    if(!user){
        throw new ApiError(404, "User not found or does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    return res.status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )
});

const logoutUser = asyncHandler(async (req, res) => {
    //logout logic here
    //get user from req
    //clear the refresh token from db
    //clear the cookies from frontend
    //send response

    User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined 
            }
        },
        {
            new: true,
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"))
    
    const userId = req.user._id;

})

export { registerUser,
    LoginUser,
    logoutUser
 };
