import mongoose, { Schema } from "mongoose";

const HairDresser = new Schema({

},
{timestamps: true}
);

export default mongoose.model('HairDresser', HairDresser);