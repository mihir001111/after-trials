"use client";

import { motion, AnimatePresence } from "framer-motion";
import FloatingElements from "@/components/FloatingElements";
import { useRef, useState, useEffect, memo } from "react";

// --- Internal Components ---

// Optimized Razorpay Button to prevent re-loading/flickering on scroll
const RazorpayButton = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    // Prevent double injection if already loaded
    if (!containerRef.current || loadedRef.current) return;

    const form = document.createElement("form");
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.dataset.payment_button_id = "pl_RvNakEj20F9npr";
    script.async = true;

    form.appendChild(script);
    containerRef.current.appendChild(form);
    
    loadedRef.current = true;
  }, []);

  return <div ref={containerRef} className="mt-4 sm:mt-6 flex justify-center razorpay-container min-h-[50px] scale-110 sm:scale-100 origin-top" />;
});

RazorpayButton.displayName = "RazorpayButton";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLandscapeMode, setIsLandscapeMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering for hydration stability
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Total sections: 12
  const SECTION_COUNT = 12;

  // --- Hash Navigation Logic ---
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && scrollContainerRef.current) {
        const element = document.getElementById(hash);
        if (element) {
          if (isLandscapeMode) {
            scrollContainerRef.current.scrollTo({
              top: element.offsetTop,
              behavior: "smooth"
            });
          } else {
            scrollContainerRef.current.scrollTo({
              left: element.offsetLeft,
              behavior: "smooth"
            });
          }
        }
      }
    };

    setTimeout(handleHashScroll, 100);
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [isLandscapeMode]);

  const scrollToPayment = () => {
    window.location.hash = "payment";
  };

  const toggleLandscape = () => {
    setIsLandscapeMode(!isLandscapeMode);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue;
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInputValue("");
    setIsTyping(true);

    const botResponse = "Ohoo it's just a demo doctor! Please join via the last slide to unlock the full experience.";

    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: "" }]);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < botResponse.length) {
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: "bot",
              text: botResponse.substring(0, currentIndex + 1)
            };
            return newMessages;
          });
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 30);
    }, 800);
  };

  // --- Layout Classes ---
  const containerClass = isLandscapeMode
    ? "fixed inset-0 overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-white z-40 scrollbar-hide"
    : "relative w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory bg-white scrollbar-hide";

  const trackStyle = isLandscapeMode
    ? { width: "100%", minHeight: "100%", display: "flex", flexDirection: "column" as const }
    : { width: `${SECTION_COUNT * 100}vw`, height: "100%", display: "flex", flexDirection: "row" as const };

  const sectionWrapperClass = isLandscapeMode
    ? "w-full h-[100dvh] relative snap-center flex-shrink-0 overflow-hidden"
    : "w-screen h-full relative snap-center flex-shrink-0 overflow-hidden";

  const contentRotatorClass = isLandscapeMode
    ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100dvh] h-[100vw] rotate-90 origin-center flex items-center justify-center"
    : "w-full h-full flex items-center justify-center";

  const contentPadding = isLandscapeMode ? "p-6 sm:p-12" : "px-4 sm:px-8";

  // **FIX:** Reduced top padding to pt-12 and added pb-20 to ensure bottom content is reachable
  const scrollableContentClass = isLandscapeMode 
    ? "h-full overflow-y-auto scrollbar-hide w-full flex flex-col items-center justify-start pt-12 pb-24" 
    : "w-full flex flex-col items-center justify-center";

  if (!isClient) return null;

  return (
    <>
      <div className="fixed inset-0 overflow-hidden bg-white">
        
        {/* Toggle Button */}
        <motion.button
          onClick={toggleLandscape}
          className="fixed bottom-4 right-4 z-[100] flex items-center justify-center w-10 h-10 rounded-full bg-black/80 text-white shadow-lg md:hidden backdrop-blur-sm border border-white/10"
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {isLandscapeMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          )}
        </motion.button>

        <div className={isLandscapeMode ? "opacity-0 pointer-events-none" : "opacity-100"}>
          <FloatingElements />
        </div>
        
        <motion.button
          onClick={scrollToPayment}
          className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 text-[0.6rem] sm:text-xs font-medium tracking-widest uppercase group ${isLandscapeMode ? 'hidden' : 'block'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 block px-3 py-1.5 sm:px-4 sm:py-2">
            join
          </span>
          <motion.div
            className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 gradient-underline"
          />
        </motion.button>
        
        <div 
          ref={scrollContainerRef}
          className={containerClass}
        >
          <div style={trackStyle}>
            
            {/* Section 1: Brand Title */}
            <section id="intro" className={sectionWrapperClass}>
              <div className={contentRotatorClass}>
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <motion.h1
                      className="text-[10vw] sm:text-[12vw] md:text-[10vw] font-black uppercase tracking-tighter leading-none"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      After
                    </motion.h1>
                    <motion.h1
                      className="text-[10vw] sm:text-[12vw] md:text-[10vw] font-black uppercase tracking-tighter leading-none gradient-text"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      Trials
                    </motion.h1>
                  </motion.div>
                  
                  <motion.p
                    className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-[0.5rem] sm:text-[0.6rem] md:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                  >
                    Where evidence meets empathy
                  </motion.p>
                </div>
              </div>
            </section>

            {/* Section 2: Concept Statement */}
            <section id="concept" className={sectionWrapperClass}>
              <div className={`${contentRotatorClass} ${isLandscapeMode ? 'items-center justify-start' : 'items-center justify-start'} ${contentPadding}`}>
                <div className="w-full">
                  <motion.div
                    className="max-w-3xl"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[0.95] tracking-tight">
                      Where doctors{" "}
                      <span className="gradient-text font-bold">connect</span>,{" "}
                      <br className="hidden sm:block" />
                      <span className="gradient-text font-bold">share</span>,{" "}
                      <span className="gradient-text font-bold">evolve</span>.
                    </h2>
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-6 sm:bottom-8 md:bottom-12 right-3 sm:right-4 md:right-12 text-right"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-[0.6rem] sm:text-xs md:text-sm font-light text-black/60">
                      Scroll horizontally →
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Section 3: Purpose Paragraph */}
            <section id="purpose" className={sectionWrapperClass}>
              <div className={`${contentRotatorClass} ${isLandscapeMode ? 'items-center justify-end' : 'items-center justify-end'} ${contentPadding}`}>
                <motion.div
                  className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-right"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.p
                    className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-light leading-relaxed tracking-wide"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    A new kind of{" "}
                    <span className="font-semibold relative inline-block">
                      social space
                      <motion.span
                        className="absolute bottom-0 left-0 h-[1px] sm:h-[2px] gradient-underline"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                      />
                    </span>{" "}
                    — built exclusively for doctors.
                  </motion.p>
                  
                  <motion.p
                    className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-[0.65rem] sm:text-xs md:text-sm lg:text-base font-light text-black/70 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Beyond the clinic. Beyond the trials. A sanctuary where medical 
                    professionals share insights, find community, and grow together 
                    in an environment that understands the weight of their work.
                  </motion.p>
                </motion.div>
              </div>
            </section>

            {/* Section 4: Features Statement */}
            <section id="features" className={sectionWrapperClass}>
              <div className={contentRotatorClass}>
                <motion.div
                  className={`max-w-4xl text-center w-full ${contentPadding}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.p
                    className="text-[0.5rem] sm:text-[0.6rem] md:text-xs uppercase tracking-[0.3em] font-light mb-3 sm:mb-4 md:mb-6 text-black/50"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    What makes us different
                  </motion.p>
                  
                  <motion.h2
                    className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-extralight leading-tight tracking-tight mb-4 sm:mb-5 md:mb-8 px-2"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <span className="gradient-text font-bold">Verified</span> professionals.{" "}
                    <span className="gradient-text font-bold">Protected</span> conversations.{" "}
                    <span className="gradient-text font-bold">Purposeful</span> connections.
                  </motion.h2>
                  
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-left"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1.5">No Noise</h3>
                      <p className="text-[0.65rem] sm:text-xs md:text-sm font-light text-black/70 leading-relaxed">
                        Only verified medical professionals. No distractions. Pure signal.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1.5">Full Privacy</h3>
                      <p className="text-[0.65rem] sm:text-xs md:text-sm font-light text-black/70 leading-relaxed">
                        HIPAA-compliant infrastructure. Your conversations, your control.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1.5">Real Impact</h3>
                      <p className="text-[0.65rem] sm:text-xs md:text-sm font-light text-black/70 leading-relaxed">
                        Share cases, discuss research, build meaningful professional bonds.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Section 5: Sample Post Mockup 1 */}
            <section id="post-1" className={`${sectionWrapperClass} bg-blue-500`}>
              <div className={contentRotatorClass}>
                <motion.div
                  className={`max-w-2xl w-full ${contentPadding}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.p
                    className="text-[0.5rem] sm:text-[0.6rem] md:text-xs uppercase tracking-[0.3em] font-light mb-4 sm:mb-6 md:mb-8 text-white/70 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Post by @dr.sara
                  </motion.p>
                  
                  <motion.div
                    className="shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white rounded-[10px] p-5 sm:p-6 md:p-8">
                      <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <img 
                          src="https://res.cloudinary.com/dn1hjjczy/image/upload/v1760897932/divaris-shirichena-EVcTjiaq4NE-unsplash_1_1_defsog.png"
                          alt="Dr. Sara Williamson"
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs sm:text-sm md:text-base font-normal text-black">Dr. Sara Williamson</p>
                          <p className="text-xs sm:text-sm md:text-base text-black/60">@dr.sara</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed mb-3 sm:mb-4 text-black">
                        Starting a small research 🤔 on post-COVID fatigue. Looking for fellow doctors 
                        to collaborate and share insights. DM if interested.
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-black/60 pt-3 sm:pt-4 border-t border-black/10">
                        <span>12:30 PM · September 21, 2025</span>
                        <span>·</span>
                        <span className="text-blue-600 font-medium">Internal Medicine</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Section 6: Sample Post Mockup 2 */}
            <section id="post-2" className={`${sectionWrapperClass} bg-orange-500`}>
              <div className={contentRotatorClass}>
                <motion.div
                  className={`max-w-2xl w-full ${contentPadding}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.p
                    className="text-[0.5rem] sm:text-[0.6rem] md:text-xs uppercase tracking-[0.3em] font-light mb-4 sm:mb-6 md:mb-8 text-white/70 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Post by @dr.jaiswal
                  </motion.p>
                  
                  <motion.div
                    className="shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white rounded-[10px] p-5 sm:p-6 md:p-8">
                      <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <img 
                          src="https://res.cloudinary.com/dn1hjjczy/image/upload/v1760897393/ashkan-forouzani-DPEPYPBZpB8-unsplash_gpugad.jpg"
                          alt="Dr. Ankesh Jaiswal"
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs sm:text-sm md:text-base font-normal text-black">Dr. Ankesh Jaiswal</p>
                          <p className="text-[10px] sm:text-xs md:text-sm text-black/60">@dr.jaiswal</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm md:text-base font-normal leading-relaxed mb-3 sm:mb-4 text-black">
                        “Love when patients say ‘Google said it’s cancer.’ <br />
                        Cool, tell Google to sign your prescription then.”💁🏻‍♂️
                      </p>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-black/60 pt-3 sm:pt-4 border-t border-black/10">
                        <span>2:43 PM · October 11, 2025</span>
                        <span>·</span>
                        <span className="text-blue-600 font-medium">Casual</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Section 7: Community Stats */}
            <section id="stats" className={sectionWrapperClass}>
              <div className={`${contentRotatorClass} ${isLandscapeMode ? 'items-center justify-start' : 'items-center justify-start'} ${contentPadding}`}>
                <motion.div
                  className="max-w-xl"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.p
                    className="text-[0.5rem] sm:text-[0.6rem] md:text-xs uppercase tracking-[0.3em] font-light mb-4 sm:mb-6 md:mb-8 text-black/50"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Growing community
                  </motion.p>
                  
                  <motion.div
                    className="space-y-4 sm:space-y-5 md:space-y-8"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <h3 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black gradient-text mb-1 leading-none">5,000+</h3>
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg font-light text-black/70">Doctors on the waitlist</p>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black gradient-text mb-1 leading-none">24</h3>
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg font-light text-black/70">Medical specialties represented</p>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black gradient-text mb-1 leading-none">40+</h3>
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg font-light text-black/70">Countries eager to join</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Section 8: Interactive Demo Chat */}
            <section id="demo" className={sectionWrapperClass}>
              <div className={contentRotatorClass}>
                <motion.div
                  className={`max-w-2xl w-full ${contentPadding}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <div className="mb-8 sm:mb-10 md:mb-12 space-y-6 min-h-[30vh] flex items-center justify-center">
                    {messages.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                      >
                        <span 
                          className="text-xs sm:text-sm font-light tracking-wider lowercase bg-gradient-to-r from-red-500 via-blue-500 via-purple-500 via-orange-500 to-red-500 bg-clip-text text-transparent"
                          style={{
                            backgroundSize: '200% 200%',
                            animation: 'shimmer 3s linear infinite'
                          }}
                        >
                          after trials
                        </span>
                      </motion.div>
                    ) : (
                      <div className="space-y-6 w-full">
                        {messages.map((message, index) => (
                          <motion.div
                            key={index}
                            className={`${message.role === "user" ? "text-right" : "text-left"}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {message.role === "user" ? (
                              <div className="inline-block max-w-[85%] bg-gradient-to-br from-orange-300 to-orange-400 rounded-3xl px-4 py-3">
                                <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed text-white">
                                  {message.text}
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed inline-block max-w-[85%] text-black">
                                <span className="gradient-text font-semibold">AI: </span>
                                {message.text}
                              </p>
                            )}
                          </motion.div>
                        ))}

                        {messages.length > 0 && messages[messages.length - 1]?.role === "bot" && !isTyping && (
                          <motion.div
                            className="text-left"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            <button
                              onClick={scrollToPayment}
                              className="text-[0.6rem] sm:text-xs font-medium tracking-widest uppercase relative group text-black/70 hover:text-black transition-colors"
                            >
                              <span className="relative z-10">join now →</span>
                              <motion.div
                                className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 gradient-underline"
                              />
                            </button>
                          </motion.div>
                        )}

                        {isTyping && messages[messages.length - 1]?.role !== "bot" && (
                          <motion.div
                            className="text-left"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="flex gap-1.5 items-center">
                              <span className="gradient-text font-semibold text-xs sm:text-sm md:text-base">AI:</span>
                              <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-black/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-1 h-1 rounded-full bg-black/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-1 h-1 rounded-full bg-black/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-16 relative">
                    <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-red-500 via-blue-500 via-purple-500 via-orange-500 to-red-500 animate-[gradient_4s_linear_infinite] opacity-100" 
                          style={{ 
                            backgroundSize: '400% 400%',
                            animation: 'gradient 4s linear infinite'
                          }} 
                    />
                    <div className="relative bg-white/40 backdrop-blur-sm rounded-full px-5 py-3 flex gap-3 items-center shadow-lg">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="type something..."
                        className="flex-1 bg-transparent px-0 py-0 text-xs sm:text-sm md:text-base font-light focus:outline-none placeholder:text-white text-black"
                        disabled={isTyping}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="text-[0.6rem] sm:text-xs font-medium tracking-widest uppercase relative group disabled:opacity-30 disabled:cursor-not-allowed text-white"
                      >
                        <span className="relative z-10">send</span>
                        <motion.div
                          className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-red-500 via-blue-500 to-orange-500"
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Section 9: Testimonial */}
            <section id="testimonial" className={sectionWrapperClass}>
              <div className={`${contentRotatorClass} ${isLandscapeMode ? 'items-center justify-end' : 'items-center justify-end'} ${contentPadding}`}>
                <motion.div
                  className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-right"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="mb-4 sm:mb-5 md:mb-8"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-light leading-relaxed mb-3 sm:mb-4 md:mb-6 italic">
                      "Finally, a space where I can be both{" "}
                      <span className="gradient-text font-semibold not-italic">human</span>{" "}
                      and{" "}
                      <span className="gradient-text font-semibold not-italic">professional</span>."
                    </p>
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm md:text-base font-semibold">Dr. Sarah Chen</p>
                      <p className="text-[0.65rem] sm:text-xs md:text-sm font-light text-black/60">Cardiothoracic Surgeon, Boston</p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-[0.6rem] sm:text-xs md:text-sm font-light text-black/50 leading-relaxed">
                      Beta tester since launch
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Section 10: Security Focus */}
            <section id="security" className={sectionWrapperClass}>
              <div className={contentRotatorClass}>
                <motion.div
                  className={`max-w-3xl text-center ${contentPadding}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.h2
                    className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-none tracking-tight mb-3 sm:mb-4 md:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Turn your cases into{" "}
                    <span className="gradient-text font-bold">recognition</span>
                  </motion.h2>

                  <motion.p
                    className="text-xs sm:text-sm md:text-base lg:text-lg font-light text-black/70 leading-relaxed max-w-xl mx-auto px-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Every post is reviewed by fellow doctors and backed by peer approval.  
                    Build visibility, credibility, and a name that stands out in your specialty.
                  </motion.p>
                </motion.div>
              </div>
            </section>

            {/* Section 11: Vision Statement */}
            <section id="vision" className={sectionWrapperClass}>
              <div className={`${contentRotatorClass} ${isLandscapeMode ? 'items-center justify-start' : 'items-center justify-start'} ${contentPadding}`}>
                <motion.div
                  className="max-w-3xl"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <motion.p
                    className="text-[0.5rem] sm:text-[0.6rem] md:text-xs uppercase tracking-[0.3em] font-light mb-3 sm:mb-4 md:mb-6 text-black/50"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    Our vision
                  </motion.p>
                  
                  <motion.h2
                    className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight tracking-tight"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    Medicine is{" "}
                    <span className="gradient-text font-bold">lonely</span>.{" "}
                    <br />
                    It doesn't have to be.
                  </motion.h2>
                  
                  <motion.p
                    className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 text-[0.65rem] sm:text-xs md:text-sm lg:text-base xl:text-lg font-light text-black/70 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Every doctor carries stories that can't be shared at dinner parties. 
                    Decisions that keep them up at night. Victories that deserve to be celebrated 
                    by people who truly understand.
                    <br /><br />
                    After Trials is that place.
                  </motion.p>
                </motion.div>
              </div>
            </section>

            {/* Section 12: Razorpay Payment Page (FINAL PAGE) */}
            <section id="payment" className={`${sectionWrapperClass} bg-white`}>
              <div className={contentRotatorClass}>
                <motion.div
                  // Optimized padding and scrolling: pt-12 (less top gap), pb-24 (more bottom gap for button)
                  className={`${contentPadding} ${scrollableContentClass}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <div className="relative w-full text-center max-w-2xl">
                    
                    {/* Header */}
                    {/* Compact margin: mb-4 instead of mb-10 */}
                    <div className="mb-4 sm:mb-10">
                        <motion.div
                          className="flex justify-center mb-2"
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="inline-block px-3 py-1 rounded-full bg-black/5 text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-black/70">
                            Limited Time Offer
                          </span>
                        </motion.div>
                        <motion.h2 
                         // Smaller text on mobile landscape: text-3xl
                         className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight"
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3 }}
                        >
                          Founding Member <span className="gradient-text font-medium">Access</span>
                        </motion.h2>
                    </div>

                    {/* Pricing Block */}
                    {/* Compact margin: mb-4 instead of mb-10 */}
                    <motion.div 
                      className="flex flex-col items-center justify-center mb-4 sm:mb-10"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-baseline gap-2 sm:gap-4 relative">
                          <span className="text-base sm:text-xl text-gray-400 font-light line-through decoration-red-400/50 decoration-1">
                            ₹5,999
                          </span>
                          {/* Scaled down for mobile landscape: text-5xl */}
                          <span className="text-5xl sm:text-7xl md:text-8xl font-black gradient-text tracking-tighter leading-none">
                            ₹999
                          </span>
                          <span className="text-base sm:text-xl font-light text-gray-500 self-end mb-1 sm:mb-4">
                            /month
                          </span>
                      </div>
                      <p className="text-[10px] sm:text-sm text-green-600/80 font-medium mt-1">
                        Save 83% • Cancel anytime
                      </p>
                    </motion.div>

                    {/* Feature List */}
                    {/* Tighter gaps */}
                    <motion.div 
                      className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 sm:gap-y-4 max-w-lg mx-auto mb-6 sm:mb-10 text-left"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                        <div className="flex gap-2 sm:gap-3 items-center text-xs sm:text-sm font-light text-gray-700">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          Verified Doctor Badge
                        </div>
                        <div className="flex gap-2 sm:gap-3 items-center text-xs sm:text-sm font-light text-gray-700">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          Unlimited Case Discussions
                        </div>
                        <div className="flex gap-2 sm:gap-3 items-center text-xs sm:text-sm font-light text-gray-700">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          Priority Networking
                        </div>
                        <div className="flex gap-2 sm:gap-3 items-center text-xs sm:text-sm font-light text-gray-700">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          Exclusive Research Access
                        </div>
                    </motion.div>

                    {/* Razorpay Button Wrapper */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="relative z-10"
                    >
                      <RazorpayButton />
                    </motion.div>

                    <p className="mt-4 sm:mt-6 text-[10px] text-gray-400 text-center font-light">
                      Secure payment via Razorpay. Encrypted & Safe.
                    </p>

                  </div>
                </motion.div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}