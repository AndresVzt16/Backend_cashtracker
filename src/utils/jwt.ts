import jwt from "jsonwebtoken";

export const generateJWT = (id: string) => {
  const token = jwt.sign({ id }, process.env.SECRET_JWT_KWY, {
    expiresIn: "1d",
  });
  return token;
};

export const generateTransactionalJWT = (data:string) => {
  const token = jwt.sign({data},process.env.SECRET_JWT_KWY,{
    expiresIn: '5m'
  })
  return token
}

export const verifyTransactionalJWT = (token: string) => {
  return jwt.verify(token, process.env.SECRET_JWT_KWY) as {
    data: string;
    iat: number;
    exp: number;
  };
};
