-- 1. MASTER PAYMENTS TABLE (For your Admin Verification)
CREATE TABLE IF NOT EXISTS ai_tool_payments (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,         -- Clerk User ID
    user_email TEXT NOT NULL,      -- User's Email
    utr_number TEXT NOT NULL,      -- Transaction ID to verify
    amount INTEGER DEFAULT 19,     -- Payment amount
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    screenshot_b64 TEXT,           -- The actual image data
    screenshot_type TEXT,          -- jpg, png, etc.
    expires_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MASTER APPLICATIONS TABLE (To see User Resumes)
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_description TEXT,
    application_date DATE DEFAULT CURRENT_DATE,
    source TEXT,
    location TEXT,
    status TEXT DEFAULT 'Applied',
    hr_name TEXT,
    hr_email TEXT,
    salary TEXT,
    job_url TEXT,
    resume_url TEXT,               -- THIS IS THE LINK TO THE PDF RESUME
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INDEXES (For fast searching in your Admin Dashboard)
CREATE INDEX IF NOT EXISTS idx_payments_email ON ai_tool_payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON ai_tool_payments(status);
CREATE INDEX IF NOT EXISTS idx_apps_user ON applications(user_id);
