'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    // Check if this specific tab has been authenticated
    const isTabActive = sessionStorage.getItem('admin_tab_active');
    
    if (!isTabActive) {
      // If not, force a logout to clear cookies and go to login
      fetch('/api/auth/logout', { method: 'POST' }).then(() => {
        router.push('/login');
      });
    } else {
      setIsVerifying(false);
    }
  }, [router]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F0F0F]">
        <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
