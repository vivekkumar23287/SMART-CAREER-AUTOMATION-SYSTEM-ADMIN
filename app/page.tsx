import DashboardLayout from "@/components/DashboardLayout";
import { CreditCard, Users, ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { query } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const pendingPayments = await query("SELECT COUNT(*) as count FROM ai_tool_payments WHERE status = 'pending'");
    const totalUsers = await query("SELECT COUNT(*) as count FROM applications");
    const approvedPayments = await query("SELECT COUNT(*) as count FROM ai_tool_payments WHERE status = 'approved'");

    return {
      pending: parseInt(pendingPayments[0]?.count || '0'),
      totalUsers: parseInt(totalUsers[0]?.count || '0'),
      approved: parseInt(approvedPayments[0]?.count || '0')
    };
  } catch (err) {
    console.error('Stats fetch error:', err);
    return { pending: 0, totalUsers: 0, approved: 0 };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold premium-gradient-text">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Pending Payments" 
            value={stats.pending} 
            icon={<Clock className="text-yellow-500" />} 
            description="Awaiting verification"
            color="border-yellow-500/20"
          />
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<Users className="text-blue-500" />} 
            description="Registered in system"
            color="border-blue-500/20"
          />
          <StatCard 
            title="Approved Payments" 
            value={stats.approved} 
            icon={<CheckCircle className="text-green-500" />} 
            description="Successfully processed"
            color="border-green-500/20"
          />
        </div>

        <div className="glass-card p-8 border-white/5 gold-glow">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <ArrowUpRight className="text-[#D4AF37]" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionLink title="Verify Payments" href="/payments" description="Check pending UTR numbers and screenshots" />
            <ActionLink title="Manage Resumes" href="/users" description="Review user profiles and download resumes" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, description, color }: any) {
  return (
    <div className={`glass-card p-6 border ${color} hover:bg-white/[0.07] transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
    </div>
  );
}

function ActionLink({ title, href, description }: any) {
  return (
    <a 
      href={href} 
      className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all group"
    >
      <h4 className="font-semibold group-hover:text-[#D4AF37] transition-colors">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </a>
  );
}
