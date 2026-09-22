import bcrypt from "bcryptjs";
import { z } from "zod";
import { supabase } from "../config/supabase.js";

// Helper to format user payload
const mapUser = (u) => {
  if (!u) return null;
  return {
    id: u.id,
    fullName: u.full_name,
    full_name: u.full_name,
    email: u.email,
    role: u.role || "team_member",
    isActive: u.is_active ?? true,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  };
};

const roleSchema = z.object({
  role: z.enum(["admin", "super_admin", "team_member", "pastor"], {
    errorMap: () => ({ message: "Role must be 'team_member', 'admin', 'super_admin', or 'pastor'" }),
  }),
});

const createUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "super_admin", "team_member", "pastor"]).default("team_member"),
});

// GET /api/users - List all team members (Accessible to all authenticated users)
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;

    let query = supabase
      .from("users")
      .select("id, full_name, email, role, is_active, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    if (search && search.trim()) {
      const s = search.trim();
      query = query.or(`full_name.ilike.%${s}%,email.ilike.%${s}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      throw error;
    }

    const mapped = (users || []).map(mapUser);

    return res.status(200).json({
      success: true,
      count: mapped.length,
      data: mapped,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/users/:id/role - Update a user's role (Admin only)
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = roleSchema.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: validated.error.errors[0].message,
      });
    }

    const { role } = validated.data;

    // Fetch user to verify existence
    const { data: targetUser, error: findError } = await supabase
      .from("users")
      .select("id, full_name, email, role")
      .eq("id", id)
      .single();

    if (findError || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update role
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, full_name, email, role, is_active, created_at, updated_at")
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}.`,
      data: mapUser(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id - Delete a user account (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user?.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own active administrator account.",
      });
    }

    // Fetch user to ensure existence
    const { data: targetUser, error: findError } = await supabase
      .from("users")
      .select("id, full_name, email")
      .eq("id", id)
      .single();

    if (findError || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or already removed.",
      });
    }

    // Delete user
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return res.status(200).json({
      success: true,
      message: `User ${targetUser.full_name} (${targetUser.email}) was removed successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/users - Admin directly creates a new team member
export const createUser = async (req, res, next) => {
  try {
    const validated = createUserSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({
        success: false,
        message: validated.error.errors[0].message,
      });
    }

    const { fullName, email, password, role } = validated.data;

    // Check if user already exists
    const { data: existingUser } = await supabase
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

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          full_name: fullName,
          email: email.toLowerCase().trim(),
          password_hash,
          role: role || "team_member",
        },
      ])
      .select("id, full_name, email, role, is_active, created_at, updated_at")
      .single();

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({
      success: true,
      message: "Team member created successfully.",
      data: mapUser(newUser),
    });
  } catch (error) {
    next(error);
  }
};
