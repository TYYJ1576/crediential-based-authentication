import mongoose, { Schema, model } from 'mongoose'

export interface UserDocument {
  _id: string
  username: string
  email: string
  password: string
  emailVerified: Date
  verifyToken: string
  verifyTokenExpiry: Date
  createAt: Date
  updateAt: Date
}

const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email is invalid',
      ],
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    verifyToken: {
      type: String,
      default: null,
    },
    verifyTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.models?.User || model<UserDocument>('User', UserSchema)
export default User
