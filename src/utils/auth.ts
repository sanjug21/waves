import jwt, { Secret, JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { User } from '@/lib/models/User.model';

const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET || 'hello';
const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET || 'world';



export const generateTokens = (user: User) => {
  const payload = { id: user._id };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

const handleTokenError = (err: unknown, type: 'access' | 'refresh') => {
  if (err instanceof TokenExpiredError) {
    console.error(`${type} token expired:`, err.message);
  } else if (err instanceof JsonWebTokenError) {
    console.error(`Invalid ${type} token:`, err.message);
  } else {
    console.error(`An unknown error occurred during ${type} token verification:`, err);
  }
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
   
    
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
  //  console.log(decoded as JwtPayload)
    return decoded as JwtPayload;

  } catch (err: unknown) {
    handleTokenError(err, 'access');
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return decoded as JwtPayload;
  } catch (err: unknown) {
    handleTokenError(err, 'refresh');
    return null;
  }
};