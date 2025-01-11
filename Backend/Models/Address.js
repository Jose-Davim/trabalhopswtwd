import mongoose, { Schema } from 'mongoose';

const Address = new Schema({
    clientId: {
        type: 'string',
        required: true,
        ref: 'User'
    },
    firstaddress: {
        type: 'string',
        required: true
    },
    secondaddress: {
        type: 'string',
        required: true
    },
    status: {
        type: 'boolean',
    }
},
    {timestamps: true}
);

export default mongoose.model('Address', Address);