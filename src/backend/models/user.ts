import mongoose, { Schema } from 'mongoose';
import type { PassportLocalDocument } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

export interface UserDocument extends PassportLocalDocument {
  username: string;
  email: string;
  githubId?: string;
}

const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  githubId: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  }
});

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export const UserModel = mongoose.model('User', UserSchema);