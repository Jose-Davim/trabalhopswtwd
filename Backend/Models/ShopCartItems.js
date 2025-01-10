import mongoose, { Schema } from "mongoose";

const ShopCartItems = new Schema({
    ShopCartId: {
        type: 'string',
        required: true
    },
    observation: {
        type: 'string',
        required: true
    },   
},
{timestamps: true}
);

export default mongoose.model('ShopCartItems', ShopCartItems);