import mongoose, { Schema } from "mongoose";

const ShopCartItems = new Schema({
    ShopCartId: {
        type: 'string',
        required: true,
        ref: 'ShopCart'
    },
    serviceId: {
        type: 'string',
        required: true,
        ref: 'HairService'
    },
    observation: {
        type: 'string',
        required: true
    },   
},
{timestamps: true}
);

export default mongoose.model('ShopCartItems', ShopCartItems);