import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is missing");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError(403, "Invalid refresh token");
        }
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(404, "User not found");
        }
    
        if(user.refreshToken !== incomingRefreshToken){
            throw new ApiError(403, "Refresh token does not match");
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, 
                { user, accessToken, refreshToken }, 
                "Tokens refreshed successfully"
            ));
    } catch (err) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldpassword, newpassword} = req.body;
    if(!oldpassword || !newpassword){
        throw new ApiError(400, "Old password and new password are required");
    }

    const user = await User.findById(req.user._id);
    const isPasswordValid = await user.isPasswordCorrect(oldpassword);
    if(!isPasswordValid){
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newpassword;
    await user.save({validateBeforeSave: false});
    return res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const {fullname, email, username} = req.body;
    if(!fullname && !email && !username){
        throw new ApiError(400, "At least one field (fullname, email, username) is required to update");
    }
    User.findByIdAndUpdate(req.user._id, {
        $set: {
            fullname,
            email: email
        },
    },{ new: true}).select("-password -refreshToken");

    res.status(200).json(new ApiResponse(200, null, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }

    const user = await User.findById(req.user._id);
    if(user.avatar){
        await deleteFromCloudinary(user.avatar);
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        throw new ApiError(400, "Failed to upload avatar");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            avatar: avatar.url
        }
    }, {new: true}).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, updatedUser, "User avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image is required");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage.url){
        throw new ApiError(400, "Failed to upload cover image");
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        $set: {
            coverImage: coverImage.url
        }
    }, {new: true}).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, updatedUser, "User cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const {username} = req.params;
    if(!username?.trim()){
        throw new ApiError(400, "Username is required");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase().trim()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { 
                    $size: "$subscribers" 
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])
    if(!channel?.length){
        throw new ApiError(404, "Channel not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Channel profile fetched successfully"));
});

export { registerUser,
    LoginUser,
    logoutUser,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    refreshAccessToken,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile
 };



//NOTES
//the main purpose of access and refresh token is used to verify user and prevent user to again login and logout every time they perform any action on the website or app
//refresh token is long termed like 7 days or more maybe and access token is shorttermed like 1d and refresh token is stored in db
//access token is sent to frontend in httponly cookie and used to verify user on every request made to secured routes