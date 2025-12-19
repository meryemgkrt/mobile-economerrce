import mongoos from "mongoose";

const reviewSchema = new mongoos.Schema({
    productId:{
        type:mongoos.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    userId:{
        type:mongoos.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    orderId:{
        type:mongoos.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    }
}, { timestamps: true });

export default mongoos.model("Review", reviewSchema);