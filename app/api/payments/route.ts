import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Get pending payments
export async function GET() {
  try {
    const payments = await query(`
      SELECT p.id, p.user_email, p.utr_number, p.screenshot_b64, p.status, p.created_at,
             (SELECT MAX(expires_at) FROM ai_tool_payments WHERE user_id = p.user_id AND status = 'approved') as current_expiry
      FROM ai_tool_payments p
      WHERE p.status = 'pending' 
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    return NextResponse.json({ message: 'Error fetching payments' }, { status: 500 });
  }
}

// Approve payment
export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ message: 'Payment ID is required' }, { status: 400 });
    }

    await query(
      `UPDATE ai_tool_payments 
       SET status = 'approved', 
           approved_at = NOW(), 
           expires_at = NOW() + INTERVAL '30 days' 
       WHERE id = $1`,
      [id]
    );

    return NextResponse.json({ message: 'Payment approved successfully' });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ message: 'Error approving payment' }, { status: 500 });
  }
}
