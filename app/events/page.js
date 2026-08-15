'use client';

import { useState, useEffect, useRef } from 'react';
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
  CalendarPlus, 
  MapPin, 
  Heart, 
  Sun, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 1. Google Form Submission Endpoint
const FORM_ENDPOINT = 'https://docs.google.com/forms/d/e/1FAIpQLSeu6-TZUOmw4P-Kvey4yzQgT03ggnWL2Bue0xLjYydAQ6Nu_g/formResponse';

// 2. Events Google Sheet CSV URL
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS168ea40QaGQwWRrRImmeUKay_FrvUOK5nuXtsFi84vzy06uwnJrkMCBnW-erchGNcWoZ69ORpXrxf/pub?gid=2093475087&single=true&output=csv';

// 3. Google Maps URLs
const HALDI_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=5500+FM+424,+Cross+Roads,+TX+76227';
const SANGEETH_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=3825+W+Spring+Creek+Pkwy+Ste+207,+Plano,+TX+75023';

export default function EventsInvite() {
  const [status, setStatus] = useState('Going');
  const [activeModal, setActiveModal] = useState(null); // 'details' | 'rsvp' | null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const videoRef = useRef(null);

  // Live Guest Counts State
  const [counts, setCounts] = useState({ going: 0, notGoing: 0, maybe: 0, loading: true });

  // iOS Safari Autoplay Fix
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.log('Autoplay deferred:', err);
      });
    }
  }, []);

  // Helper to parse CSV rows correctly handling quoted strings
  const parseCsvRow = (text) => {
    const result = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
    }
    result.push(cell.trim());
    return result;
  };

  // Helper to extract clean integer numbers
  const parseGuestNumber = (val) => {
    if (!val) return 0;
    const cleanVal = val.replace(/"/g, '').trim();
    const match = cleanVal.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Fetch and sum live guest numbers directly from sheet columns
  const fetchLiveCounts = async () => {
    try {
      const cacheBustingUrl = `${CSV_URL}&_t=${Date.now()}`;
      const res = await fetch(cacheBustingUrl, { cache: 'no-store' });
      const csvText = await res.text();
      
      const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) {
        setCounts({ going: 0, notGoing: 0, maybe: 0, loading: false });
        return;
      }

      let goingTotal = 0;
      let notGoingTotal = 0;
      let maybeTotal = 0;

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvRow(lines[i]);
        
        const rawStatus = cols[1] ? cols[1].replace(/"/g, '').trim().toLowerCase() : '';
        const rawGuests = cols[3] ? cols[3] : '0';

        if (rawStatus.includes('not going') || rawStatus === 'not') {
          notGoingTotal += 1;
        } else if (rawStatus.includes('maybe')) {
          maybeTotal += parseGuestNumber(rawGuests);
        } else if (rawStatus.includes('going')) {
          goingTotal += parseGuestNumber(rawGuests);
        }
      }

      setCounts({
        going: goingTotal,
        notGoing: notGoingTotal,
        maybe: maybeTotal,
        loading: false
      });
    } catch (err) {
      console.error('Failed to fetch live guest counts:', err);
      setCounts((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchLiveCounts();
  }, []);

  const handleStatusSelect = (selectedStatus) => {
    setStatus(selectedStatus);
    setActiveModal('rsvp');
  };

  const handleAddToCalendar = (type) => {
    let event;
    if (type === 'haldi') {
      event = {
        title: "Sai & Vamsi's Haldi Ceremony",
        description: "Join us for the vibrant Haldi Ceremony of Sai Padmini & Vamsi Krishna at 8:30 AM.",
        location: "JRB Ranch House, 5500 FM 424, Cross Roads, TX 76227",
        startTime: "20260828T083000",
        endTime: "20260828T123000",
        filename: "haldi-ceremony.ics"
      };
    } else {
      event = {
        title: "Sai & Vamsi's Sangeeth Night",
        description: "Join us for an evening filled with music, dance, and celebrations at the Sangeeth of Sai Padmini & Vamsi Krishna at 7:00 PM.",
        location: "Minerva Banquet Hall, 3825 W Spring Creek Pkwy Ste 207, Plano, TX 75023",
        startTime: "20260828T190000",
        endTime: "20260828T230000",
        filename: "sangeeth-night.ics"
      };
    }

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
    link.setAttribute("download", event.filename);
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
          colors: ['#FFD700', '#FF8C00', '#FF1493', '#32CD32']
        });
      }

      setSubmitted(true);
      setTimeout(() => {
        fetchLiveCounts();
      }, 800);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-screen w-full relative flex flex-col justify-end font-sans overflow-hidden bg-[#0d131a]">
      
      {/* 1. Full-Bleed Video Background with iOS Autoplay and Control Hiding */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-top pointer-events-none [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-panel]:hidden [&::-webkit-media-controls-play-button]:hidden [&::-webkit-media-controls-start-playback-button]:hidden"
        >
          <source src="/events-bg.mp4" type="video/mp4" />
        </video>
        {/* Subtle Dark Gradient at Bottom for UI Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* 2. Text & Controls */}
      <div 
        className="relative z-10 w-full max-w-md mx-auto px-5 flex flex-col items-center text-center space-y-4 bg-transparent"
        style={{ transform: 'translateY(-30px)' }}
      >
        
        {/* Event Details Frosted Glass Card */}
        <div className="w-full bg-black/45 backdrop-blur-md border border-white/15 rounded-3xl p-5 shadow-2xl space-y-2 text-white">
          <p className="text-[11px] uppercase tracking-[0.25em] font-bold text-amber-300">
            You&apos;re Invited
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-white leading-tight drop-shadow-md">
            Sai &amp; Vamsi&apos;s
            <span className="block text-amber-200">Haldi &amp; Sangeeth Event</span>
          </h1>
          <div className="pt-1 space-y-0.5">
            <p className="text-xs font-semibold text-slate-100">
              Friday, August 28, 2026
            </p>
            <p className="text-[11px] font-medium text-amber-100/90">
              Haldi 8:30 AM &bull; Sangeeth 7:00 PM
            </p>
          </div>
        </div>

        {/* Segmented RSVP Pill Bar */}
        <div className="w-full bg-[#252a30]/90 backdrop-blur-md rounded-full p-2 border border-white/20 flex items-center justify-between shadow-2xl">
          <button
            onClick={() => handleStatusSelect('Going')}
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
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
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
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
            className={`flex-1 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
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
          className="w-full py-3.5 bg-[#3a414a]/90 hover:bg-[#48515c] text-white font-medium text-xs sm:text-sm rounded-2xl transition-all shadow-xl backdrop-blur-sm border border-white/10"
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
                className="fixed bottom-0 inset-x-0 bg-[#252223] text-white rounded-t-[36px] p-5 sm:p-7 max-w-md mx-auto z-40 border-t border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4"
              >
                {/* Top Actions Bar */}
                <div className="flex items-center justify-between pb-2">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <Home className="w-4 h-4" />
                  </button>
                  
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                    Schedule of Events
                  </span>
                </div>

                {/* Guest List Summary Card */}
                <div className="bg-[#481c1d]/90 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">Guest List</h3>
                    <p className="text-xs text-rose-100/80 font-medium pt-0.5">
                      {counts.loading ? (
                        'Updating guest counts...'
                      ) : (
                        `${counts.going} Going \u2022 ${counts.notGoing} Not Going \u2022 ${counts.maybe} Maybe`
                      )}
                    </p>
                  </div>
                </div>

                {/* Couple Names Intro */}
                <div className="text-center py-1">
                  <p className="text-xs text-slate-300 font-medium">Join us to celebrate</p>
                  <h4 className="text-base font-bold text-white tracking-wide pt-1">
                    Sai Padmini <span className="text-amber-300 font-serif font-normal">&amp;</span> Vamsi Krishna
                  </h4>
                  <p className="text-[11px] text-amber-200/80 pt-0.5">Friday, August 28, 2026</p>
                </div>

                {/* 1. HALDI CEREMONY CARD */}
                <div className="bg-[#353032] border border-amber-500/20 rounded-2xl p-4 text-left shadow-lg space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <div>
                        <h5 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                          Haldi Ceremony
                        </h5>
                        <p className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1 pt-0.5">
                          <Clock className="w-3 h-3 text-amber-400" /> 08:30 AM
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCalendar('haldi')}
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[11px] flex items-center gap-1 transition-colors"
                      title="Add Haldi to Calendar"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cal</span>
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 pt-1">
                    <p className="font-semibold text-white">JRB Ranch House</p>
                    <a
                      href={HALDI_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 underline transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>5500 FM 424, Cross Roads, TX 76227</span>
                    </a>
                  </div>
                </div>

                {/* 2. SANGEETH EVENT CARD */}
                <div className="bg-[#353032] border border-purple-500/20 rounded-2xl p-4 text-left shadow-lg space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-300" />
                      <div>
                        <h5 className="text-sm font-bold text-purple-200 uppercase tracking-wider">
                          Sangeeth Event
                        </h5>
                        <p className="text-[11px] font-semibold text-purple-200/90 flex items-center gap-1 pt-0.5">
                          <Clock className="w-3 h-3 text-purple-300" /> 07:00 PM
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCalendar('sangeeth')}
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[11px] flex items-center gap-1 transition-colors"
                      title="Add Sangeeth to Calendar"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cal</span>
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 pt-1">
                    <p className="font-semibold text-white">Minerva Banquet Hall</p>
                    <a
                      href={SANGEETH_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 underline transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>3825 W Spring Creek Pkwy Ste 207, Plano, TX 75023</span>
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal('rsvp')}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md mt-2"
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
                {/* Top Actions Bar */}
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
                    <div className="w-16 h-16 bg-amber-400/20 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <Heart className="w-8 h-8 fill-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold tracking-wide text-white leading-normal">
                      Response Recorded
                    </h3>
                    <p className="text-sm text-amber-200/90 max-w-xs mx-auto leading-relaxed font-serif italic">
                      &ldquo;We are eagerly awaiting for you to be here and share in our special moment!&rdquo;
                    </p>
                    <p className="text-xs text-slate-400 pt-2">
                      Sai Padmini &amp; Vamsi Krishna
                    </p>
                  </div>
                ) : (
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
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-base sm:text-xs focus:outline-none focus:border-amber-400 text-white placeholder:text-slate-400 leading-relaxed"
                        />
                      </div>

                      {/* Number of Guests Input */}
                      {status !== 'Not Going' ? (
                        <div className="relative">
                          <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <select
                            name="entry.220456160"
                            required
                            defaultValue=""
                            className="w-full pl-10 pr-4 py-3 bg-[#252223] border border-white/10 rounded-xl text-base sm:text-xs focus:outline-none focus:border-amber-400 text-white appearance-none leading-relaxed invalid:text-slate-400"
                          >
                            <option value="" disabled hidden>Number of Guests *</option>
                            <option value="1">1 Person</option>
                            <option value="2">2 People</option>
                            <option value="3">3 People</option>
                            <option value="4">4 People</option>
                            <option value="5">5 People</option>
                            <option value="10">10 People</option>
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
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-base sm:text-xs focus:outline-none focus:border-amber-400 text-white placeholder:text-slate-400 resize-none leading-relaxed"
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