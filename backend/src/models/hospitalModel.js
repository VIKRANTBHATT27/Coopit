import { model, Schema } from "mongoose";

const hospitalSchema = new Schema({

     name: {
          type: String,
          required: true,
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
               validator: {
                    validate: {
                         validator: v => /^[1-9][0-9]{5}$/.test(v)
                    },
                    message: props => `${props.value} is not a valid pincode!`
               }
          },
     },

     hospitalType: {
          type: String,
          enum: ["Government", "Private", "Clinic", "Speciality"]
     },

     phone: {
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
               "Critical Care Medicine",
               "Dermatology",
               "Emergency Medicine",
               "Endocrinology",
               "Gastroenterology",
               "General Medicine",
               "General Surgery",
               "Geriatrics",
               "Gynecology & Obstetrics",
               "Hematology",
               "Hepatology",
               "Infectious Diseases",
               "Internal Medicine",
               "Nephrology",
               "Neurology",
               "Neurosurgery",
               "Nuclear Medicine",
               "Oncology",
               "Ophthalmology",
               "Orthopedics",
               "Otolaryngology (ENT)",
               "Palliative Care",
               "Pathology",
               "Pediatrics",
               "Physical Medicine & Rehabilitation",
               "Plastic Surgery",
               "Psychiatry",
               "Pulmonology",
               "Radiology",
               "Rheumatology",
               "Sports Medicine",
               "Urology",
               "Vascular Surgery"
          ],
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