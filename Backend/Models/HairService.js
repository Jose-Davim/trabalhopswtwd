import mongoose, { Schema } from "mongoose";

const HairService = new Schema({
    name: {
        type: 'string',
        required: true
    },
    price: {
        type: 'string',
        required: true
    },
    photo: {
        type: 'string',
        required: true
    },
    duration: {
        type: 'number',
        required: true
    },
    description: {
        type: 'string',
    },
    hairdresser: {
        type: 'string',
        ref : 'Hairdresser'
    },
    status: {
        type: 'boolean',
        required: true
    },
},
{timestamps: true}
);

export default mongoose.model('HairService', HairService);
