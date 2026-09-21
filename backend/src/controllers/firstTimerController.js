import { Parser } from "json2csv";
import { supabase } from "../config/supabase.js";

// Helper function to map database snake_case row to frontend camelCase
const mapToCamelCase = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    phoneNumber: row.phone_number,
    email: row.email,
    residenceAddress: row.residence_address,
    status: row.status,
    studentInstitution: row.student_institution,
    studentFaculty: row.student_faculty,
    studentDepartment: row.student_department,
    studentLevel: row.student_level,
    professionalOrganization: row.professional_organization,
    professionalOccupation: row.professional_occupation,
    otherStatus: row.other_status,
    howDidYouHear: row.how_did_you_hear,
    experienceToday: row.experience_today,
    bestContactTime: row.best_contact_time,
    preferredContactMethod: row.preferred_contact_method,
    prayerRequests: row.prayer_requests,
    followUpStatus: row.follow_up_status || "pending",
    assignedTo: row.assigned_to,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

// Helper function to map frontend camelCase to database snake_case
const mapToSnakeCase = (data) => {
  return {
    full_name: data.fullName,
    gender: data.gender,
    date_of_birth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split("T")[0] : null,
    phone_number: data.phoneNumber,
    email: data.email,
    residence_address: data.residenceAddress,
    status: data.status,
    student_institution: data.studentInstitution || null,
    student_faculty: data.studentFaculty || null,
    student_department: data.studentDepartment || null,
    student_level: data.studentLevel || null,
    professional_organization: data.professionalOrganization || null,
    professional_occupation: data.professionalOccupation || null,
    other_status: data.otherStatus || null,
    how_did_you_hear: data.howDidYouHear || null,
    experience_today: data.experienceToday || null,
    best_contact_time: data.bestContactTime || null,
    preferred_contact_method: data.preferredContactMethod || null,
    prayer_requests: data.prayerRequests || null,
    follow_up_status: data.followUpStatus || "pending",
  };
};

/**
 * Public Endpoint: Create a First Timer Submission
 */
export const createFirstTimer = async (req, res, next) => {
  try {
    const payload = req.body;

    if (!payload.fullName || !payload.email || !payload.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Email, and Phone Number are required fields.",
      });
    }

    const dbPayload = mapToSnakeCase(payload);

    const { data, error } = await supabase
      .from("first_timers")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: "First timer information submitted successfully.",
      data: mapToCamelCase(data),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Protected Endpoint: Get all submissions with pagination, search, and filtering
 */
export const getFirstTimers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const search = req.query.search?.trim() || "";
    const status = req.query.status?.trim() || "";
    const followUpStatus = req.query.followUpStatus?.trim() || "";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("first_timers")
      .select("*", { count: "exact" });

    // Apply Search Filter across name, email, phone
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone_number.ilike.%${search}%`
      );
    }

    // Apply Status Filter (student, professional, other)
    if (status) {
      query = query.eq("status", status.toLowerCase());
    }

    // Apply Follow-up Status Filter (pending, contacted, integrated, closed)
    if (followUpStatus) {
      query = query.eq("follow_up_status", followUpStatus.toLowerCase());
    }

    // Order by latest first and apply pagination range
    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      throw error;
    }

    const totalRecords = count || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    // Set headers for clients expecting x-total-count
    res.setHeader("x-total-count", totalRecords);
    res.setHeader("Access-Control-Expose-Headers", "x-total-count");

    return res.status(200).json({
      success: true,
      data: (data || []).map(mapToCamelCase),
      pagination: {
        total: totalRecords,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Protected Endpoint: Get single First Timer details
 */
export const getFirstTimerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("first_timers")
      .select(`
        *,
        follow_up_notes (
          id,
          note,
          contact_method,
          created_at,
          user:users (id, full_name, email)
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "First timer record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: mapToCamelCase(data),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Protected Endpoint: Update status or details of a First Timer
 */
export const updateFirstTimer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { followUpStatus, assignedTo } = req.body;

    const updates = {};
    if (followUpStatus) updates.follow_up_status = followUpStatus;
    if (assignedTo !== undefined) updates.assigned_to = assignedTo;

    const { data, error } = await supabase
      .from("first_timers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: "First timer record updated successfully.",
      data: mapToCamelCase(data),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Protected Endpoint: Export all submissions as CSV
 */
export const exportCSV = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("first_timers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const fields = [
      { label: "ID", value: "id" },
      { label: "Full Name", value: "full_name" },
      { label: "Gender", value: "gender" },
      { label: "Date of Birth", value: "date_of_birth" },
      { label: "Phone Number", value: "phone_number" },
      { label: "Email", value: "email" },
      { label: "Residence Address", value: "residence_address" },
      { label: "Status", value: "status" },
      { label: "Institution", value: "student_institution" },
      { label: "Faculty", value: "student_faculty" },
      { label: "Department", value: "student_department" },
      { label: "Level", value: "student_level" },
      { label: "Organization", value: "professional_organization" },
      { label: "Occupation", value: "professional_occupation" },
      { label: "Other Status", value: "other_status" },
      { label: "How Did You Hear", value: "how_did_you_hear" },
      { label: "Experience Today", value: "experience_today" },
      { label: "Best Contact Time", value: "best_contact_time" },
      { label: "Preferred Contact Method", value: "preferred_contact_method" },
      { label: "Prayer Requests", value: "prayer_requests" },
      { label: "Follow-up Status", value: "follow_up_status" },
      { label: "Submission Date", value: "created_at" },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data || []);

    const filename = `hgbc_first_timers_${new Date().toISOString().split("T")[0]}.csv`;

    res.header("Content-Type", "text/csv");
    res.attachment(filename);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
