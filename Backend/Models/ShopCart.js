import mongoose, { Schema } from "mongoose";

const ShopCart = new Schema({
    date: {
        type: 'date',
        required: true
    },
    price: {
        type: 'string',
        required: true
    },
    clientId: {
        type: 'string',
        required: true
    },
    observation: {
        type: 'string',
        required: true
    },
    hairdresserId:{
        type: 'string',
        required: true,
        ref: 'HairDresser'
    },
    reservtion:{
        type: 'string',
        required: true
    },
    paymentMethod: {
        type: 'string',
        required: true
    },
    status: {
        type: 'string',
        required: PENDING
    },

    
},
{timestamps: true}
);

export default mongoose.model('ShopCart', ShopCart);