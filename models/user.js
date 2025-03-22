import passportLocalMongoose from 'passport-local-mongoose';
import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', userSchema);

