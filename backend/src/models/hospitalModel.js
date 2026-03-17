import { model, Schema } from "mongoose";

const hospitalSchema = new Schema({

     name: {
          type: String,
          required: true,
          unique: true
     },

     city: {
          type: String,
          required: true
     },

     landmark: {
          type: String,
          required: false
     },

     address: {
          street: { type: String, required: true },
          locality: { type: String, required: true },
          city: { type: String, required: true },
          state: { type: String, required: true },
          pincode: {
               type: String,
               required: true,
          },
     },

     hospitalType: {
          type: String,
          enum: ["Government", "Private", "Clinic", "Speciality"]
     },

     phones: {
          type: [String],
          required: true,
          validator: {
               validator: function (phones) {
                    const regexValid = phones.every(v => /^\+?[1-9]\d{9,14}$/.test(v));

                    const uniqueValid = new Set(phones).size() === phones.length;

                    return regexValid && uniqueValid;
               },
               message: props => `${props.value} contains invalid or duplicate number`
          }
     },

     departments: {
          type: [String],
          required: true,
          enum: [
               "Anesthesiology",
               "Cardiology",
               "Dermatology",
               "Emergency Medicine",
               "Endocrinology",
               "Gastroenterology",
               "General Medicine",
               "General Surgery",
               "Gynecology & Obstetrics",
               "Neurology",
               "Oncology",
               "Orthopedics",
               "Pediatrics",
               "Psychiatry",
               "Pulmonology",
               "Radiology",
               "Urology"
          ]
     },

     createdBy: {
          type: Schema.Types.ObjectId,
          ref: "Staff"
     },

     location: {
          type: {
               type: String,
               enum: ['Point'],
               default: 'Point'
          },
          coordinates: {
               type: [Number],
               required: true,
               validate: {
                    validator: v => v.length === 2,
                    message: "Coordinates must be [longitude, latitude]"
               }
          }
     },

}, { timestamps: true });

hospitalSchema.index({ city: 1 });
hospitalSchema.index({ location: '2dsphere' });

export default model('Hospital', hospitalSchema, "hospitalModel");