"use client";

import "./maintenance.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, Settings, Mail, ArrowRight, Clock } from "lucide-react";

// ─── Countdown Logic ───────────────────────────────────────────
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

// ─── Animated Number ───────────────────────────────────────────
function AnimatedNumber({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-card">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 12, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -12, opacity: 0, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="countdown-value"
        >
          {String(value).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
      <span className="countdown-label">{label}</span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function MaintenancePage() {
  const endDate =
    process.env.NEXT_PUBLIC_MAINTENANCE_END_DATE || "2026-05-18T00:00:00+07:00";
  const countdown = useCountdown(endDate);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    try {
      await fetch("/api/maintenance/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
    } catch {
      // silently fail — not critical
    } finally {
      setLoading(false);
    }
  };

  // ── Stagger animation variants ──
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="maintenance-root">
      {/* ── Animated floating orbs ── */}
      <motion.div
        className="orb orb-1"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-2"
        animate={{ x: [0, -30, 25, 0], y: [0, 25, -15, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-3"
        animate={{ x: [0, 20, -30, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Glassmorphism Card ── */}
      <motion.div
        className="maintenance-card"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="maintenance-logo">
          <Image
            src="/LogoDanNama.png"
            alt="khlasify"
            width={160}
            height={48}
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Animated Icons */}
        <motion.div variants={fadeUp} className="maintenance-icons">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="icon-wrapper icon-wrapper--gear"
          >
            <Settings className="icon-gear" />
          </motion.div>
          <motion.div
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="icon-wrapper icon-wrapper--wrench"
          >
            <Wrench className="icon-wrench" />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={fadeUp} className="maintenance-title">
          We&apos;re upgrading
          <br />
          <span className="maintenance-title--gradient">your experience</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={fadeUp} className="maintenance-subtitle">
          Our site is currently undergoing scheduled maintenance.
          <br />
          We&apos;ll be back shortly with something amazing.
        </motion.p>

        {/* Countdown */}
        <motion.div variants={fadeUp} className="countdown-row">
          <AnimatedNumber value={countdown.days} label="Days" />
          <span className="countdown-separator">:</span>
          <AnimatedNumber value={countdown.hours} label="Hours" />
          <span className="countdown-separator">:</span>
          <AnimatedNumber value={countdown.minutes} label="Minutes" />
          <span className="countdown-separator">:</span>
          <AnimatedNumber value={countdown.seconds} label="Seconds" />
        </motion.div>

        {/* Email Subscribe */}
        <motion.div variants={fadeUp} className="subscribe-section">
          {subscribed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="subscribe-success"
            >
              <Mail className="w-5 h-5" />
              <span>We&apos;ll notify you when we&apos;re back!</span>
            </motion.div>
          ) : (
            <div className="subscribe-form">
              <div className="subscribe-input-wrapper">
                <Mail className="subscribe-icon" />
                <input
                  type="email"
                  placeholder="Enter your email for updates..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  className="subscribe-input"
                />
              </div>
              <motion.button
                onClick={handleSubscribe}
                disabled={loading || !email}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="subscribe-button"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="subscribe-spinner"
                  />
                ) : (
                  <>
                    Notify Me
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Footer Info */}
        <motion.div variants={fadeUp} className="maintenance-footer">
          <Clock className="w-4 h-4" />
          <span>Estimated downtime: less than 24 hours</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
