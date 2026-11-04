import mongoose, { Schema, type InferSchemaType } from 'mongoose'

/** Minutos de validez de los códigos de confirmación y de recuperación. */
export const TOKEN_TTL_MINUTES = 10

const tokenSchema = new Schema({
  token: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // MongoDB borra el documento automáticamente al cumplirse el TTL (índice TTL)
  createdAt: { type: Date, default: Date.now, expires: TOKEN_TTL_MINUTES * 60 },
})

export type IToken = InferSchemaType<typeof tokenSchema>

const Token = mongoose.model('Token', tokenSchema)
export default Token
