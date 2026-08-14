'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  User, 
  Mail, 
  Users, 
  MessageSquare, 
  Send, 
  Loader2, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const FORM_ENDPOINT = 'https://docs.google.com/forms/u/0/d/e/YOUR_FORM_ID/formResponse';

export default function WeddingInvite() {
  const [status, setStatus] = useState('Going');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleStatusSelect = (selectedStatus) => {
    setStatus(selectedStatus);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    try {
      await fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      if (status === 'Going') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#007AFF', '#34C759', '#5856D6', '#FF9500']
        });
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-screen w-full relative flex flex-col justify-end font-sans overflow-hidden bg-[#e5eff7]">
      
      {/* 1. Full-Bleed Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat z-0"
        style={{ backgroundImage: "url('/bg.png')" }}
      />

      {/* 2. Text & Controls - Expanded Spacing & Line Height */}
      <div 
        className="relative z-10 w-full max-w-md mx-auto px-6 flex flex-col items-center text-center space-y-5 bg-transparent"
        style={{ transform: 'translateY(-100px)' }}
      >
        
        {/* Event Details with relaxed line height */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-amber-800 leading-relaxed">
            You&apos;re Invited
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-slate-900 leading-normal">
            Vamsi Krishna &amp; Sai Padmini
          </h1>
          <p className="text-xs font-semibold text-slate-700 leading-relaxed pt-1">
            Sat, August 29 at 9:45 PM
          </p>
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
            Aubrey, Texas
          </p>
        </div>

        {/* Segmented RSVP Pill Bar with increased padding */}
        <div className="w-full bg-[#3d454e] backdrop-blur-md rounded-full p-2 border border-white/20 flex items-center justify-between shadow-xl">
          <button
            onClick={() => handleStatusSelect('Going')}
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all leading-relaxed ${
              status === 'Going' && isDrawerOpen
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-100 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Going</span>
          </button>

          <div className="w-[1px] h-6 bg-white/20" />

          <button
            onClick={() => handleStatusSelect('Not Going')}
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all leading-relaxed ${
              status === 'Not Going' && isDrawerOpen
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-100 hover:text-white'
            }`}
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Not Going</span>
          </button>

          <div className="w-[1px] h-6 bg-white/20" />

          <button
            onClick={() => handleStatusSelect('Maybe')}
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all leading-relaxed ${
              status === 'Maybe' && isDrawerOpen
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-100 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Maybe</span>
          </button>
        </div>

        {/* Action Button with increased padding */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full py-3.5 bg-[#4c545e] hover:bg-[#5b646d] text-white font-medium text-xs sm:text-sm rounded-2xl transition-all shadow-md leading-relaxed"
        >
          View Event Details &amp; RSVP
        </button>

      </div>

      {/* 3. Slide-Up Registration Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 bg-[#1e2329] text-white rounded-t-[32px] p-6 sm:p-8 max-w-lg mx-auto z-40 border-t border-white/20 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-bold leading-normal">Event Registration</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">Vamsi Krishna &amp; Sai Padmini&apos;s Wedding</p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold leading-normal">Response Recorded</h3>
                  <p className="text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
                    Thank you! Your RSVP response has been saved.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-xs text-amber-400 underline leading-relaxed"
                  >
                    Update Response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-400 leading-relaxed">Selected RSVP Status:</span>
                    <span className="text-sm font-semibold text-amber-400 leading-relaxed">{status}</span>
                  </div>
                  <input type="hidden" name="entry.123456789_status" value={status} />

                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="entry.123456789_name"
                      required
                      placeholder="Full Name *"
                      className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-white placeholder:text-slate-400 leading-relaxed"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      name="entry.123456789_email"
                      required
                      placeholder="Email Address *"
                      className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-white placeholder:text-slate-400 leading-relaxed"
                    />
                  </div>

                  {status !== 'Not Going' && (
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        name="entry.123456789_guests"
                        className="w-full pl-10 pr-4 py-3.5 bg-[#2b3138] border border-white/10 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-white appearance-none leading-relaxed"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5 People</option>
                        <option value="6">6 People</option>
                        <option value="7">7 People</option>
                        <option value="8">8 People</option>
                        <option value="9">9 People</option>
                        <option value="10+">10 or more People</option>
                      </select>
                    </div>
                  )}

                  <div className="relative">
                    <MessageSquare className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <textarea
                      name="entry.123456789_notes"
                      rows={3}
                      placeholder="Special notes or dietary requirements..."
                      className="w-full pl-10 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-amber-400 text-white placeholder:text-slate-400 resize-none leading-relaxed"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-4 leading-relaxed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Confirming...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Response
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </main>
  );
}