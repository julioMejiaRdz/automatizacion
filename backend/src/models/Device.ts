import mongoose, { Schema, Document } from "mongoose";

export interface IDeviceField {
  key:  string; 
  unit: string;
}

export interface IDevice extends Document<string> {
  _id:    string;
  name:   string;
  topic:  string;
  fields: IDeviceField[];
}

// --- Schema del subdocumento ---
const DeviceFieldSchema = new Schema<IDeviceField>(
  {
    key:  { type: String, required: true },
    unit: { type: String, required: true },
  },
  { _id: false } // los campos no necesitan su propio _id
);

// --- Schema principal ---
const DeviceSchema = new Schema<IDevice>({
  _id:    { type: String, required: true },
  name:   { type: String, required: true },
  topic:  { type: String, required: true },
  fields: { type: [DeviceFieldSchema], default: [] },
});

export default mongoose.model<IDevice>("Device", DeviceSchema);
