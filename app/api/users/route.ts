import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    // We try to fetch the columns we expect, but we'll handle the case where they might be named differently
    // Based on the user's project schema, applications might have company_name and job_title instead of full_name
    let users;
    try {
      if (search) {
        users = await query(
          `SELECT DISTINCT ON (a.id)
                  a.id, 
                  a.company_name as full_name, 
                  COALESCE(p.user_email, 'No Email Found') as email, 
                  a.resume_url,
                  a.job_title,
                  a.job_description,
                  a.application_date,
                  a.source,
                  a.location,
                  a.status,
                  a.hr_name,
                  a.hr_email,
                  a.salary,
                  a.job_url,
                  a.notes,
                  a.created_at,
                  p.expires_at
           FROM applications a
           LEFT JOIN ai_tool_payments p ON a.user_id = p.user_id
           WHERE a.company_name ILIKE $1 OR p.user_email ILIKE $1 OR a.job_title ILIKE $1
           ORDER BY a.id, a.created_at DESC`,
          [`%${search}%`]
        );
      } else {
        users = await query(
          `SELECT DISTINCT ON (a.id)
                  a.id, 
                  a.company_name as full_name, 
                  COALESCE(p.user_email, 'No Email Found') as email, 
                  a.resume_url,
                  a.job_title,
                  a.job_description,
                  a.application_date,
                  a.source,
                  a.location,
                  a.status,
                  a.hr_name,
                  a.hr_email,
                  a.salary,
                  a.job_url,
                  a.notes,
                  a.created_at,
                  p.expires_at
           FROM applications a
           LEFT JOIN ai_tool_payments p ON a.user_id = p.user_id
           ORDER BY a.id, a.created_at DESC`
        );
      }
      
      // Re-sort by created_at DESC for the UI
      if (Array.isArray(users)) {
        users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

    } catch (dbError: any) {
      console.error('Database query failed:', dbError.message);
      users = [];
    }

    return NextResponse.json(Array.isArray(users) ? users : []);
  } catch (error: any) {
    console.error('User fetch error:', error);
    return NextResponse.json({ 
      message: 'Error fetching users', 
      error: error.message,
      hint: 'Ensure your applications table has the expected columns or run the setup.sql script.'
    }, { status: 500 });
  }
}
