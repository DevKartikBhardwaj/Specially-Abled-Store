import mongoose from "mongoose";
const Schema = mongoose.Schema;

const passkeySchema = new Schema({
  id: {
    type: String, // Base64URLString → String
    required: true,
    index: true,
  },
  publicKey: {
    type: Buffer, // Stored as binary (Uint8Array will convert to Buffer in Node)
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId, // Foreign key to User
    ref: 'users',
    required: true,
  },
  webauthnUserID: {
    type: String,
    required: true,
    index: true,
  },
  counter: {
    type: Number,
    required: true,
  },
  deviceType: {
    type: String,
    enum: ['singleDevice', 'multiDevice'],
    required: true,
  },
  backedUp: {
    type: Boolean,
    required: true,
  },
  transports: {
    type: [String], // ['usb', 'ble', 'nfc', etc.]
    enum: ['ble', 'cable', 'hybrid', 'internal', 'nfc', 'smart-card', 'usb'],
    default: undefined,
  },
}, { timestamps: true });

const PasskeyCollection=mongoose.model('Passkey', passkeySchema);

export default PasskeyCollection;