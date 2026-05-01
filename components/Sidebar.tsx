'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CreditCard, Users, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: CreditCard, label: 'Payment Requests', href: '/payments' },
  { icon: Users, label: 'User Management', href: '/users' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // In a real app, call a logout API to clear cookies
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 h-screen glass-card border-l-0 border-t-0 border-b-0 rounded-none flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 mb-8">
        <h1 className="text-xl font-bold premium-gradient-text italic tracking-wider">SMART CAREER</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin Control Panel</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border-l-2 border-[#D4AF37] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-[#D4AF37]' : ''} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-[#D4AF37]" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-500 hover:text-red-400 transition-colors w-full p-3"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
