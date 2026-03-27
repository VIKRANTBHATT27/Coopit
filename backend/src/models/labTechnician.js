import { model, Schema } from "mongoose";

const labTechSchema = new Schema({
     staffId: {
          type: Schema.Types.ObjectId,
          ref: "Staff",
     },

     pfp_url: {
          type: String,
          required: false,
          default: "/default-pfp/default-lab-technician.png"
     },

     labType: {
          type: String,
          required: true,
          enum: [
               "Anatomic Pathology",
               "Biochemistry",
               "Cytology",
               "Genetics/Genomics",
               "Hematology",
               "Histology",
               "Imaging (MRI/CT/X-Ray)",
               "Immunology/Serology",
               "Microbiology",
               "Molecular Diagnostics",
               "Nuclear Medicine",
               "Phlebotomy",
               "Radiology",
               "Toxicology",
               "Urinalysis",
               "Virology"
          ]
     },

     qualification: {
          type: String,
          required: true
     },

     shift: {
          type: String,
          enum: ["Morning", "Evening", "Night"]
     }

});

export default model('labTechnician', labTechSchema);