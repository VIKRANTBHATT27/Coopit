import { model, Schema } from "mongoose";

const labTechSchema = new Schema({
     staffId: {
          type: Schema.Types.ObjectId,
          ref: "Staff",
          unique: true
     },

     pfp_url: {
          type: String,
          required: false,
          default: "/default-pfp/default-lab-technician.png"
     },

     pfp_publicId: {
          type: String,
          required: false,
     },

     labType: {
          type: String,
          required: true,
          enum: [
               "ANATOMIC_PATHOLOGY",
               "BIOCHEMISTRY",
               "CYTOLOGY",
               "GENETICS_GENOMICS",
               "HEMATOLOGY",
               "HISTOLOGY",
               "IMAGING_MRI_CT_X_RAY",
               "IMMUNOLOGY_SEROLOGY",
               "MICROBIOLOGY",
               "MOLECULAR_DIAGNOSTICS",
               "NUCLEAR_MEDICINE",
               "PHLEBOTOMY",
               "RADIOLOGY",
               "TOXICOLOGY",
               "URINALYSIS",
               "VIROLOGY"
          ]
     },

     qualification: {
          type: String,
          required: true
     },

     shift: {
          type: String,
          enum: [
               "MORNING",
               "EVENING",
               "Night"
          ]
     },

     assignedCheckups: {
          type: [{
               type: mongoose.Types.ObjectId,
               ref: "Checkup",
               required: true,
               unique: true
          }],
          default: []
     },
});

const LabTechnician = model('LabTechnician', labTechSchema);
export default LabTechnician;
