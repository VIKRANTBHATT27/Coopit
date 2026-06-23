// import argon2 from "argon2";

// export const createPasswordHash = async (password) => {
//      try {
//           const hashPass = await argon2.hash(password);
//           return hashPass;
//      } catch (error) {
//           console.error("failed hashing password using argon2\n", error.message);
//           throw new Error(`password hashing failed`);
//      }
// };

// export const passwordMatch = async (encryptedPassword, password) => {
//      try {
//           const isVerified = await argon2.verify(encryptedPassword, password);
//           return isVerified;
//      } catch (error) {
//           console.log(error);
//           throw new Error(`INTERNAL SERVER ERROR due to ${error.message}`);
//      }
// };