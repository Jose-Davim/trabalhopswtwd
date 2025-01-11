import mongoose, { Schema } from 'mongoose';

const Address = new Schema({
    clientId: {
        type: 'string',
        required: true,
        ref: 'User'
    },
    city: {
        type: 'string',
        required: true
    },
    street: {
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