import { Schema, Document } from 'mongoose';

export const MakeSchema = new Schema({
  MakeId: { type: Number, required: true },
  MakeName: { type: String, required: true },
  VehicleTypes: [
    {
      TypeId: Number,
      TypeName: String,
    },
  ],
});

export interface Make extends Document {
  MakeId: number;
  MakeName: string;
  VehicleTypes: { TypeId: number; TypeName: string }[];
}
