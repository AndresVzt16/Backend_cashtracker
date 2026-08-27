import bcrypt from "bcrypt";

export const hashData = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const checkPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const checkOTP = async (
  expirationMinutes: number,
  dateCreation: Date,
) => {
  const now = new Date();
  const expiration = expirationMinutes * 60 * 1000;
  const otpAge = now.getTime()- dateCreation.getTime()
  
  if(otpAge > expiration){
    return false
  }
  return true
};
