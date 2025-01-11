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
    

},
{timestamps: true}
);

export default mongoose.model('HairDresser', HairDresser);