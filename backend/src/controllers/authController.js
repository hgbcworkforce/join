import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { supabase } from "../config/supabase.js";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signup = async (req, res, next) => {
  try {
    const validated = signupSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: validated.error.errors[0].message,
      });
    }

    const { fullName, email, password } = validated.data;

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          full_name: fullName,
          email: email.toLowerCase().trim(),
          password_hash,
          role: "team_member",
        },
      ])
      .select("id, full_name, email, role, created_at")
      .single();

    if (insertError) {
      throw insertError;
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || "default-hgbc-firsttimer-jwt-secret-key-32chars";
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        name: newUser.full_name,
        role: newUser.role,
      },
      secret,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        accessToken: token,
        token: token,
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validated = signinSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: validated.error.errors[0].message,
      });
    }

    const { email, password } = validated.data;

    // Find user
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (findError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email address or password.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email address or password.",
      });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || "default-hgbc-firsttimer-jwt-secret-key-32chars";
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.full_name,
        role: user.role,
      },
      secret,
      { expiresIn: "7d" }
    );

    const userProfile = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    };

    return res.status(200).json({
      success: true,
      message: "Signed in successfully.",
      data: {
        accessToken: token,
        token: token,
        user: userProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, created_at")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};
