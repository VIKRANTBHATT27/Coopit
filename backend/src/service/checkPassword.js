import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const checkPassword = async (emailId, password) => {
     const user = await userModel.findOne({ emailId });
     if (!user) throw new Error("User not found");
     

     const isPassMatched = await bcrypt.compare(password, user.password);
     if (!isPassMatched) throw new Error("Password not matched");

     return user;
};

export default checkPassword;