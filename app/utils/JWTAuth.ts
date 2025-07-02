import jwt from "jsonwebtoken";

const jwt_secret = process.env.JWT_AUTH || "@#failedKEy1w2";
export const generateToken = (_id: string) => {
  const token = jwt.sign({ userId: _id }, jwt_secret, {
    expiresIn: "7d",
  });

  return token;
};
