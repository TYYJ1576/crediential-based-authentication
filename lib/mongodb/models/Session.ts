import mongoose, { Schema, model } from 'mongoose'

export interface SessionDocument {
  _id: string
  userId: mongoose.Schema.Types.ObjectId
  data: object
  expiresAt: Date
  createAt: Date
  updateAt: Date
}

const SessionSchema = new Schema<SessionDocument>(
  {
    _id: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    data: { type: mongoose.Schema.Types.Mixed },
    expiresAt: { type: Date },
  },
  { timestamps: true }
)

const Session =
  mongoose.models?.Session || model<SessionDocument>('Session', SessionSchema)
export default Session
