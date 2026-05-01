'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, User, FileText, ExternalLink, Loader2, X, Mail, Eye, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function getDaysLeft(expiryDate: string) {
  if (!expiryDate) return null;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

interface AppUser {
  id: number;
  full_name: string;
  email: string;
  resume_url?: string;
  job_title: string;
  job_description?: string;
  application_date: string;
  source?: string;
  location?: string;
  status?: string;
  hr_name?: string;
  hr_email?: string;
  salary?: string;
  job_url?: string;
  notes?: string;
  expires_at?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async (queryParam = '') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users?search=${encodeURIComponent(queryParam)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
        console.error('Invalid user data received:', data);
      }
    } catch (err) {
      setUsers([]);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold premium-gradient-text">User Management</h1>
            <p className="text-gray-400 mt-1">Manage users and review their submitted resumes.</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
        </div>

        {isLoading && users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 size={40} className="animate-spin text-[#D4AF37]" />
            <p className="text-gray-500">Searching user database...</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                    <th className="px-6 py-4 font-medium">User Details</th>
                    <th className="px-6 py-4 font-medium">Email Address</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-center">Access</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(!Array.isArray(users) || users.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    Array.isArray(users) && users.map((user) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 flex items-center justify-center">
                              <User size={20} className="text-[#D4AF37]" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-200">{user.full_name}</span>
                              <span className="text-xs text-gray-500 font-medium">{user.job_title}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                            user.status === 'Offer' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                            user.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                            user.status === 'Interview Scheduled' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                            'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                          }`}>
                            {user.status || 'Applied'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {(() => {
                            const days = getDaysLeft(user.expires_at || '');
                            if (days === null) return <span className="text-gray-600 text-[10px]">No Subscription</span>;
                            if (days <= 0) return <span className="text-red-500 text-[10px] font-bold">EXPIRED</span>;
                            return (
                              <div className="flex flex-col items-center">
                                <span className="text-[#D4AF37] text-sm font-bold">{days}d</span>
                                <span className="text-[10px] text-gray-500">left</span>
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-2 text-gray-500 hover:text-[#D4AF37] transition-colors">
                               <Eye size={18} />
                             </button>
                            {user.resume_url && (
                              <a 
                                href={user.resume_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 text-gray-500 hover:text-[#D4AF37] transition-colors"
                              >
                                <FileText size={18} />
                              </a>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Side Panel Details */}
        <AnimatePresence>
          {selectedUser && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedUser(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-screen w-full max-w-md bg-[#121212] border-l border-white/10 z-[70] p-8 overflow-y-auto scrollbar-hide"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold premium-gradient-text">Application Details</h2>
                  <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Header Info */}
                  <div className="flex items-center gap-4 p-4 glass-card border-[#D4AF37]/20">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 flex items-center justify-center text-2xl">
                      🏢
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedUser.full_name}</h3>
                      <p className="text-[#D4AF37] font-medium">{selectedUser.job_title}</p>
                    </div>
                  </div>

                  {/* Core Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="Status" value={selectedUser.status || 'Applied'} highlight />
                    <DetailItem label="Date" value={selectedUser.application_date ? new Date(selectedUser.application_date).toLocaleDateString() : 'N/A'} />
                    <DetailItem label="Source" value={selectedUser.source || 'Direct'} />
                    <DetailItem 
                      label="Access Left" 
                      value={(() => {
                        const days = getDaysLeft(selectedUser.expires_at || '');
                        if (days === null) return 'No Access';
                        if (days <= 0) return 'Expired';
                        return `${days} Days Remaining`;
                      })()} 
                      highlight={selectedUser.expires_at ? (getDaysLeft(selectedUser.expires_at) ?? 0) > 0 : false}
                      alert={selectedUser.expires_at ? (getDaysLeft(selectedUser.expires_at) ?? 0) <= 0 : false}
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Mail size={16} className="text-gray-500" />
                        <span className="text-sm">{selectedUser.email}</span>
                      </div>
                      {selectedUser.hr_name && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <User size={16} className="text-gray-500" />
                          <span className="text-sm">{selectedUser.hr_name} (HR)</span>
                        </div>
                      )}
                      {selectedUser.hr_email && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <Mail size={16} className="text-gray-500" />
                          <span className="text-sm">{selectedUser.hr_email} (HR Email)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description & Notes */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Job Description</h4>
                    <div className="p-4 bg-white/5 rounded-xl text-sm text-gray-400 leading-relaxed max-h-48 overflow-y-auto scrollbar-hide border border-white/5">
                      {selectedUser.job_description || 'No description provided.'}
                    </div>
                  </div>

                  {selectedUser.notes && (
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Notes</h4>
                      <p className="text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5 italic">
                        "{selectedUser.notes}"
                      </p>
                    </div>
                  )}

                  {/* Links & Actions */}
                  <div className="pt-4 space-y-3">
                    {selectedUser.job_url && (
                      <a 
                        href={selectedUser.job_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3 rounded-xl border border-white/10 transition-all font-medium"
                      >
                        <ExternalLink size={18} />
                        View Job Posting
                      </a>
                    )}
                    {selectedUser.resume_url && (
                      <a 
                        href={selectedUser.resume_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B8860B] text-black py-3 rounded-xl font-bold transition-all"
                      >
                        <FileText size={18} />
                        Open PDF Resume
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function DetailItem({ label, value, highlight, alert }: any) {
  return (
    <div className={`p-3 bg-white/5 rounded-xl border ${alert ? 'border-red-500/30' : 'border-white/5'}`}>
      <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">{label}</span>
      <span className={`text-sm font-medium ${alert ? 'text-red-500' : highlight ? 'text-[#D4AF37]' : 'text-gray-300'}`}>
        {value}
      </span>
    </div>
  );
}
