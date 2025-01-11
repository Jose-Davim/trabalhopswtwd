import mongoose, { Schema } from "mongoose";

const HairDresser = new Schema({
    name: {
        type: 'string',
        required: [true, "Name is required to create/update"]
    },
    photo:{
        type: 'string',
        required: [true, "Photo is required to create/update"]
    },

    email: {
        type: 'string',
        required: [true, "Email is required to create/update"]
    },
    phonenumber: {
        type: 'number',
        required: [true, "Phone number is required to create/update"]
    },
    tax: {
        type: 'number',
        unique: true,
        required: [true, "Tax is required to create/update"],
        maxlenght: 9
    },
    isActived: {
        type: 'boolean',
        default: true
    },
    observations: {
        type : 'string'
    },
    firstaddress: {
        type: 'string',
        required: [true, "First address is required to create/update"]
    },
    secondaddress: {
        type: 'string',
        required: [true, "Second address is required to create/update"]
    },
    openstore: {
        type: 'date',
        required: [true, "Store opening hours is required to create/update"]
    },
    closestore: {
        type: 'date',
        required: [true, "Store closing hours is required to create/update"]
    },
    lat:{
        type: 'string',
        required: [true, "Latitude is required to create/update"]
    },
    long:{
        type: 'string',
        required: [true, "Longitude is required to create/update"]
    },
    daysoff:{
        type: [String]
    },
    rating:{
        type: 'number',
        default: 0
    },
},
{timestamps: true}
);

export default mongoose.model('HairDresser', HairDresser);