import { motion, useReducedMotion, type Variants } from "framer-motion";
import BrandSignature from "@/components/shared/BrandSignature";

/**
 * AuthLogo mirrors the footer brand lockup so sign-in and register stay
 * visually aligned with the site's official identity.
 */
const AuthLogo = () => {
  const reduced = useReducedMotion();

  const wrapVariants: Variants = reduced
    ? {}
    : {
        hidden: { opacity: 0, y: -14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
      variants={wrapVariants}
      initial="hidden"
      animate="visible"
    >
      {!reduced && (
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-14px -20px",
            borderRadius: 36,
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 48%, transparent 74%)",
            filter: "blur(14px)",
            willChange: "transform, opacity",
          }}
          animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <motion.div
        style={{ position: "relative", width: "100%" }}
        animate={!reduced ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <BrandSignature
          size="lg"
          align="left"
          surface="spotlight"
          loading="eager"
        />
      </motion.div>
    </motion.div>
  );
};

export default AuthLogo;
