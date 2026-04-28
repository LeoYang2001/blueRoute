import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../css/ContactModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const el = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: "easeOut" as const, delay },
});

export default function ContactModal({ isOpen, onClose }: Props) {
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      setTimeout(() => firstInput.current?.focus(), 380);
    }
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        // Step 1: backdrop fades in
        <motion.div
          className="contactBackdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
        >
          {/* Step 2: card background slides up */}
          <motion.div
            className="contactCard"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <motion.button
              className="contactCard__close"
              onClick={onClose}
              aria-label="Close"
              {...el(0.18)}
            >
              ✕
            </motion.button>

            {/* ── Left panel (white) ── */}
            <div className="contactCard__left">
              <motion.h2 className="contactCard__title" {...el(0.22)}>
                Get in
                <br />
                touch with
                <br />
                us!
              </motion.h2>

              {/* Contact info bottom-left */}
              <motion.div className="contactCard__info" {...el(0.38)}>
                <div className="contactCard__infoItem">
                  <span className="contactCard__infoLabel">Email</span>
                  <span className="contactCard__infoValue">
                    info@blueroutemarine.com
                  </span>
                </div>
                <div className="contactCard__infoDivider" />
                <div className="contactCard__infoItem">
                  <span className="contactCard__infoLabel">Phone</span>
                  <span className="contactCard__infoValue">
                    +86 000 0000 0000
                  </span>
                </div>
                <div className="contactCard__infoDivider" />
                <div className="contactCard__infoItem">
                  <span className="contactCard__infoLabel">Address</span>
                  <span className="contactCard__infoValue">
                    123 Maritime Blvd
                    <br />
                    Xiamen, Fujian, China
                  </span>
                </div>
              </motion.div>
            </div>

            {/* ── Right panel (orange) ── */}
            <div className="contactCard__right">
              <form
                className="contactCard__form py-12"
                onSubmit={(e) => e.preventDefault()}
              >
                <motion.div className="contactCard__field" {...el(0.28)}>
                  <input
                    ref={firstInput}
                    type="text"
                    placeholder="Your name"
                    className="contactCard__input"
                    required
                  />
                </motion.div>

                <motion.div className="contactCard__field" {...el(0.34)}>
                  <input
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Your email"
                    className="contactCard__input"
                    required
                  />
                </motion.div>

                <motion.div
                  className="contactCard__field contactCard__field--grow"
                  {...el(0.4)}
                >
                  <textarea
                    placeholder="Message"
                    className="contactCard__input contactCard__textarea"
                    required
                  />
                </motion.div>
              </form>

              <motion.button
                className="contactCard__send "
                type="submit"
                {...el(0.48)}
              >
                <span>
                  Send
                  <br />
                  message
                </span>
                <span className="contactCard__sendArrow">↗</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
