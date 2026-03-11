import { model, Schema } from "mongoose";

const labTechSchema = new Schema({
     staffId: {
          type: Schema.Types.ObjectId,
          ref: "Staff",
     },

     pfp_url: {
          type: String,
          default: "/pfp/default-lab-technician.png"
     },

     labType: {
          type: String,
          required: true,
          enum: [
               "Anatomic Pathology",         // Tissue analysis/biopsies
               "Biochemistry",               // Blood chemistry, hormones, electrolytes
               "Cytology",                   // Cell-level screening (e.g., Pap smears)
               "Genetics/Genomics",          // DNA sequencing and hereditary testing
               "Hematology",                 // Blood counts and coagulation
               "Histology",                  // Microscopic study of tissues
               "Imaging (MRI/CT/X-Ray)",
               "Immunology/Serology",        // Immune system and antibody testing
               "Microbiology",               // Bacteria, fungi, and parasites
               "Molecular Diagnostics",      // PCR and viral load testing
               "Nuclear Medicine",           // Radioactive tracer diagnostics
               "Phlebotomy",                 // Blood collection station
               "Radiology",                  // General imaging
               "Toxicology",                 // Drug and toxin screening
               "Urinalysis",                 // Physical and chemical urine exam
               "Virology"                    // Specific study of viruses
          ]
     },
     
     qualification: {
          type: String
     },
     qualification: {
          type: String
     },
     
     shift: {
          type: String,
          enum: ["Morning", "Evening", "Night"]
     }
     
});

export default model('labTechnician', labTechSchema, "labTechnicianModel");