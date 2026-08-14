'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  User, 
  Users, 
  MessageSquare, 
  Send, 
  Loader2, 
  Home,
  CalendarPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Connected Google Form Action URL
const FORM_ENDPOINT = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSd0xUk_QkWIsXeWfZ2L0PuFc57OSQBGp6fQLjUOcFCnQTpClQ/formResponse';

export default function WeddingInvite() {
  const [status, setStatus] = useState('Going');
  const [activeModal, setActiveModal] = useState(null); // 'details' | 'rsvp' | null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleStatusSelect = (selectedStatus) => {
    setStatus(selectedStatus);
    setActiveModal('rsvp');
  };

  // Helper to add event directly to iPhone (iOS) or Android Calendar
  const handleAddToCalendar = () => {
    const event = {
      title: "Vamsi Krishna & Sai Padmini's Wedding",
      description: "We warmly invite you to celebrate the Wedding Ceremony of Vamsi Krishna Chinthala & Sai Padmini Papineni.",
      location: "1212 Arrowwood Dr, Aubrey, TX",
      startTime: "20260829T214500", // Aug 29, 2026, 9:45 PM
      endTime: "20260830T010000"     // Aug 30, 2026, 1:00 AM
    };

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      `DTSTART:${event.startTime}`,
      `DTEND:${event.endTime}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "wedding-event.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* 2. Text & Controls */}
      <div 
        className="relative z-10 w-full max-w-md mx-auto px-6 flex flex-col items-center text-center space-y-5 bg-transparent"
        style={{ transform: 'translateY(-50px)' }}
      >
        
        {/* Event Details */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-amber-800 leading-relaxed">
            You&apos;re Invited
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-slate-900 leading-normal">
            Vamsi Krishna &amp; Sai Padmini&apos;s
            <span className="block">Wedding</span>
          </h1>
          <p className="text-xs font-semibold text-slate-700 leading-relaxed pt-1">
            Sat, August 29 at 9:45 PM
          </p>
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
            Aubrey, Texas
          </p>
        </div>

        {/* Segmented RSVP Pill Bar */}
        <div className="w-full bg-[#3d454e] backdrop-blur-md rounded-full p-2 border border-white/20 flex items-center justify-between shadow-xl">
          <button
            onClick={() => handleStatusSelect('Going')}
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all leading-relaxed ${
              status === 'Going' && activeModal === 'rsvp'
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
              status === 'Not Going' && activeModal === 'rsvp'
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
              status === 'Maybe' && activeModal === 'rsvp'
                ? 'bg-white text-slate-900 shadow-md font-bold'
                : 'text-slate-100 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Maybe</span>
          </button>
        </div>

        {/* View Event Details Button */}
        <button
          onClick={() => setActiveModal('details')}
          className="w-full py-3.5 bg-[#4c545e] hover:bg-[#5b646d] text-white font-medium text-xs sm:text-sm rounded-2xl transition-all shadow-md leading-relaxed"
        >
          View Event Details
        </button>

      </div>

      {/* 3. Modals Container */}
      <AnimatePresence>
        {activeModal && (
          <>
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-30"
            />

            {/* MODAL 1: EVENT DETAILS */}
            {activeModal === 'details' && (
              <motion.div 
                key="modal-details"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="fixed bottom-0 inset-x-0 bg-[#252223] text-white rounded-t-[36px] p-5 sm:p-7 max-w-md mx-auto z-40 border-t border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                {/* Top Actions Bar (Home + Calendar) */}
                <div className="flex items-center justify-between pb-4">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <Home className="w-4 h-4" />
                  </button>
                  
                  {/* Add to Calendar Button */}
                  <button 
                    onClick={handleAddToCalendar}
                    title="Add to Calendar"
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors flex items-center gap-1.5 text-xs font-medium px-3.5"
                  >
                    <CalendarPlus className="w-4 h-4 text-amber-400" />
                    <span>Add to Calendar</span>
                  </button>
                </div>

                {/* Guest List Summary Card */}
                <div className="bg-[#481c1d]/90 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 mb-6 shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">Guest List</h3>
                    <p className="text-xs text-rose-100/80 font-medium pt-0.5">
                      102 Going &bull; 1 Not Going &bull; 4 Maybe
                    </p>
                  </div>
                </div>

                {/* Event Invitation Card */}
                <div className="bg-[#353032] border border-white/10 rounded-2xl p-6 text-center space-y-3 shadow-lg my-3">
                  <p className="text-xs text-slate-300 font-medium">
                    Together with our families,
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We warmly invite you to celebrate the Wedding Ceremony of
                  </p>
                  <div className="py-2">
                    <h4 className="text-base font-bold text-white tracking-wide">
                      Vamsi Krishna Chinthala
                    </h4>
                    <p className="text-xs text-amber-300 font-serif my-0.5">&amp;</p>
                    <h4 className="text-base font-bold text-white tracking-wide">
                      Sai Padmini Papineni
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">
                    On Saturday, August 29, 2026 9:45 PM
                  </p>
                  <div className="pt-2 text-xs text-slate-300 space-y-0.5">
                    <p className="font-semibold text-white">Venue:</p>
                    <p>1212 Arrowwood Dr</p>
                    <p>Aubrey, TX</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal('rsvp')}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md mt-4"
                >
                  Respond to RSVP
                </button>
              </motion.div>
            )}

            {/* MODAL 2: RSVP SUBMISSION FORM */}
            {activeModal === 'rsvp' && (
              <motion.div 
                key="modal-rsvp"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="fixed bottom-0 inset-x-0 bg-[#252223] text-white rounded-t-[36px] p-5 sm:p-7 max-w-md mx-auto z-40 border-t border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                {/* Top Actions Bar (Home Only) */}
                <div className="flex items-center justify-between pb-4">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <Home className="w-4 h-4" />
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
                  /* Form Wrapped in Dark Styling Card */
                  <div className="bg-[#353032] border border-white/10 rounded-2xl p-6 shadow-lg my-3">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* Selected Status Bar */}
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                        <span className="text-xs text-slate-300 leading-relaxed">RSVP Status:</span>
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{status}</span>
                      </div>
                      <input type="hidden" name="entry.1146164887" value={status} />

                      {/* Full Name Input */}
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          name="entry.1867410502"
                          required
                          placeholder="Full Name *"
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-amber-400 text-white placeholder:text-slate-400 leading-relaxed"
                        />
                      </div>

                      {/* Number of Guests Input (Sends hidden "0" when "Not Going") */}
                      {status !== 'Not Going' ? (
                        <div className="relative">
                          <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <select
                            name="entry.220456160"
                            required
                            defaultValue=""
                            className="w-full pl-10 pr-4 py-3 bg-[#252223] border border-white/10 rounded-xl text-xs focus:outline-none focus:border-amber-400 text-white appearance-none leading-relaxed invalid:text-slate-400"
                          >
                            <option value="" disabled hidden>Number of Guests *</option>
                            <option value="1">1 Person</option>
                            <option value="2">2 People</option>
                            <option value="3">3 People</option>
                            <option value="4">4 People</option>
                            <option value="5">5 People</option>
                            <option value="10+">10+ People</option>
                          </select>
                        </div>
                      ) : (
                        <input type="hidden" name="entry.220456160" value="0" />
                      )}

                      {/* Message Notes Input */}
                      <div className="relative">
                        <MessageSquare className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <textarea
                          name="entry.657578493"
                          rows={3}
                          placeholder="Special notes or Blessings..."
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-xs focus:outline-none focus:border-amber-400 text-white placeholder:text-slate-400 resize-none leading-relaxed"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2 leading-relaxed"
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
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

    </main>
  );
}