import * as z from "zod";

export const labTechSchema = z.object({
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     pfp_url: z.string().default("/default-pfp/default-lab-technician.png"),
     labType: z.enum([
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
     ]),
     qualification: z.string(),
     shift: z.enum(["Morning", "Evening", "Night"])
});

export const labTechiUpdateSchema = labTechSchema.partial();

export const labTechImgUploadSchema = z.object({
     emailId: z.string().email("Invalid email format"),
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid staffId")
});

// export const dicomBodySchema = z.array(z.object({
//      fileName: z.string(),
//      uploadedBy: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
// }));