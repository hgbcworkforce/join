-- =========================================================================
-- HGBC INFLUENCERS - FIRST TIMER & GUEST MANAGEMENT SYSTEM
-- SUPABASE / POSTGRESQL DATABASE SCHEMA
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_type AS ENUM ('student', 'professional', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE follow_up_status_type AS ENUM ('pending', 'contacted', 'integrated', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('admin', 'team_member', 'pastor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS TABLE (Team Members & Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role_type DEFAULT 'team_member',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FIRST TIMERS TABLE (Guest Submissions)
CREATE TABLE IF NOT EXISTS first_timers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    gender gender_type NOT NULL,
    date_of_birth DATE,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    residence_address TEXT NOT NULL,
    status status_type NOT NULL,
    
    -- Student specific fields
    student_institution TEXT,
    student_faculty TEXT,
    student_department TEXT,
    student_level TEXT,
    
    -- Professional specific fields
    professional_organization TEXT,
    professional_occupation TEXT,
    
    -- Other status specific field
    other_status TEXT,
    
    -- Experience, Discovery & Feedback
    how_did_you_hear TEXT,
    experience_today TEXT,
    best_contact_time TEXT,
    preferred_contact_method TEXT,
    prayer_requests TEXT,
    
    -- Follow-up CRM fields
    follow_up_status follow_up_status_type DEFAULT 'pending',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FOLLOW UP NOTES TABLE (Interaction logs)
CREATE TABLE IF NOT EXISTS follow_up_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_timer_id UUID NOT NULL REFERENCES first_timers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    contact_method TEXT, -- 'phone', 'whatsapp', 'in_person', 'email'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_first_timers_created_at ON first_timers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_first_timers_follow_up_status ON first_timers (follow_up_status);
CREATE INDEX IF NOT EXISTS idx_first_timers_status ON first_timers (status);
CREATE INDEX IF NOT EXISTS idx_first_timers_email ON first_timers (email);
CREATE INDEX IF NOT EXISTS idx_first_timers_phone ON first_timers (phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- 7. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS set_timestamp_first_timers ON first_timers;
CREATE TRIGGER set_timestamp_first_timers
BEFORE UPDATE ON first_timers
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_users ON users;
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- 8. ROW LEVEL SECURITY (RLS) POLICIES (OPTIONAL)
-- If using Supabase service role key in backend, backend bypasses RLS safely.
-- If enabling RLS for public intake:
ALTER TABLE first_timers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_notes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous intake inserts:
CREATE POLICY "Allow public insert to first_timers" 
ON first_timers FOR INSERT 
WITH CHECK (true);

-- Allow service role full access:
CREATE POLICY "Service role full access on first_timers" 
ON first_timers FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Service role full access on users" 
ON users FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Service role full access on follow_up_notes" 
ON follow_up_notes FOR ALL 
USING (true) 
WITH CHECK (true);
