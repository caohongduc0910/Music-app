import jwt from "jsonwebtoken";
import * as ENV from '../config/global.config'

export const createAccessToken = (id: string): string => {
  return jwt.sign(
    {
      id: id,
    },
    ENV.JWT_SECRET,
    {
      expiresIn: ENV.JWT_EXPIRY,
    }
  );  
};

export const decodeAccessToken = (token: any) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};
