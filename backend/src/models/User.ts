import mongoose, { Schema, type HydratedDocument, type InferSchemaType } from 'mongoose'

const userSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export type IUser = InferSchemaType<typeof userSchema>
export type UserDocument = HydratedDocument<IUser>

const User = mongoose.model('User', userSchema)
export default User
