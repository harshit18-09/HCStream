import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';


const videoSchema = new Schema({
     videoFile: {
        type: String, //cloudinary url will be used this is new
        required: true,
    },
    thumbnail: {
        type: String, //cloudinary url will be used this is new
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{ timestamps: true });



videoSchema.plugin(mongooseAggregatePaginate);   //this is something new i have not used before
export const Video = mongoose.model("Video", videoSchema);