import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const verifyToken = async (req, res, next) => {
  try {
    // 1. Check for token in multiple locations
    const token = req.cookies?.token || 
                 req.headers.authorization?.split(' ')[1] || 
                 req.body?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        solution: "Include token in cookies, Authorization header, or request body"
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // 3. Verify user exists
    const user = await prisma.student.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
        action: "Please register or contact support"
      });
    }

    // 4. Additional checks (example)
    // if (!user.isActive) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Account deactivated",
    //     action: "Contact support to reactivate"
    //   });
    // }

    // 5. Attach user info to request
    req.user = {
      id: user.id,
      role: user.role
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);

    // Specific error messages
    let status = 500;
    let message = "Authentication failed";

    if (error instanceof jwt.JsonWebTokenError) {
      status = 401;
      message = "Invalid token";
    } else if (error instanceof jwt.TokenExpiredError) {
      status = 401;
      message = "Token expired";
    }

    return res.status(status).json({
      success: false,
      message,
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};