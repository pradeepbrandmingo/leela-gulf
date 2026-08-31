import jwt from "jsonwebtoken";

/**
 * Generate JWT Token & set HTTP-only cookie
 * Token Expiration: Exactly 1 Day (24 Hours)
 */
export const generateToken = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: "1d", // 1 Day Expiration
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // Exactly 1 Day in Milliseconds
  };

  res.cookie("token", token, cookieOptions);

  return token;
};
