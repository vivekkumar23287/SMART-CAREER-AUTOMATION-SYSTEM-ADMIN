'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Check, X, Eye, Loader2, ExternalLink, RefreshCw, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function getDaysLeft(expiryDate: string) {
  if (!expiryDate) return null;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

interface Payment {
  id: number;
  user_email: string;
  utr_number: string;
  screenshot_b64?: string;
  status: string;
  current_expiry?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPayments(data);
      } else {
        setPayments([]);
        console.error('Invalid payment data received:', data);
      }
    } catch (err) {
      setPayments([]);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPayments(payments.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold premium-gradient-text">Payment Verification</h1>
            <p className="text-gray-400 mt-1">Verify manual UTR submissions and screenshots.</p>
          </div>
          <button 
            onClick={fetchPayments}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            title="Refresh List"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 size={40} className="animate-spin text-[#D4AF37]" />
            <p className="text-gray-500">Loading pending requests...</p>
          </div>
        ) : (!Array.isArray(payments) || payments.length === 0) ? (
          <div className="glass-card p-12 text-center">
            <Check size={48} className="mx-auto mb-4 text-green-500/50" />
            <h3 className="text-xl font-semibold">All caught up!</h3>
            <p className="text-gray-500 mt-2">There are no pending payment verifications at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {Array.isArray(payments) && payments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-white/5 hover:border-[#D4AF37]/20 transition-all"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
                    {payment.screenshot_b64 ? (
                      <div 
                        className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/10 cursor-pointer group"
                        onClick={() => setSelectedImage(payment.screenshot_b64 || null)}
                      >
                        <img 
                          src={payment.screenshot_b64.startsWith('data:') ? payment.screenshot_b64 : `data:image/png;base64,${payment.screenshot_b64}`} 
                          alt="UTR Screenshot" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye size={20} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 text-xs text-center p-2">
                        No Screenshot
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold text-lg">{payment.user_email}</h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">UTR:</span>
                          <code className="text-[#D4AF37] font-mono bg-[#D4AF37]/10 px-2 py-0.5 rounded text-sm">
                            {payment.utr_number}
                          </code>
                        </div>
                        
                        {payment.current_expiry && (
                          <div className="flex items-center gap-2 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded">
                            <Clock size={12} className="text-green-500" />
                            <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">
                              {(getDaysLeft(payment.current_expiry) ?? 0) > 0 
                                ? `Active: ${getDaysLeft(payment.current_expiry)}d left` 
                                : 'Previous Access Expired'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleApprove(payment.id)}
                      disabled={processingId === payment.id}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B8860B] text-black px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                      {processingId === payment.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <Check size={18} />
                          Approve
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.startsWith('data:') ? selectedImage : `data:image/png;base64,${selectedImage}`} 
              className="w-full h-full object-contain"
              alt="Payment Screenshot Full"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-all"
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
