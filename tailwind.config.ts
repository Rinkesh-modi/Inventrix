import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        Poppins_Black: ["Poppins_Black"],
        Poppins_Bold: ["Poppins_Bold"],
        Poppins_Medium: ["Poppins_Medium"],
        Poppins_Regular: ["Poppins_Regular"],
        Poppins_SemiBold: ["Poppins_SemiBold"],
      },

      colors: {
        // Inventrix Brand Colors
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Main blue
          600: "#2563eb", // Primary blue
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        secondary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea", // Primary purple
          700: "#7c3aed",
          800: "#6b21a8",
          900: "#581c87",
          950: "#3b0764",
        },
        // Custom Inventrix Colors
        inventrix: {
          blue: {
            light: "#60a5fa",
            DEFAULT: "#2563eb",
            dark: "#1d4ed8",
          },
          purple: {
            light: "#c084fc",
            DEFAULT: "#9333ea",
            dark: "#7c3aed",
          },
          gradient: {
            from: "#2563eb", // blue-600
            to: "#9333ea", // purple-600
          },
        },
        // Accent Colors
        accent: {
          success: "#10b981", // green-500
          warning: "#f59e0b", // amber-500
          error: "#ef4444", // red-500
          info: "#06b6d4", // cyan-500
        },
        // Gray Scale (Enhanced)
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
      },
      backgroundImage: {
        // Custom gradients for Inventrix
        "gradient-primary": "linear-gradient(135deg, #2563eb 0%, #9333ea 100%)",
        "gradient-primary-light":
          "linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)",
        "gradient-cta": "linear-gradient(to right, #2563eb 0%, #9333ea 100%)",
      },
      boxShadow: {
        inventrix: "0 10px 30px rgba(37, 99, 235, 0.2)",
        "inventrix-lg": "0 20px 50px rgba(37, 99, 235, 0.25)",
        purple: "0 10px 30px rgba(147, 51, 234, 0.2)",
        "purple-lg": "0 20px 50px rgba(147, 51, 234, 0.25)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-in-right": "slideInRight 0.8s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        slideInRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        bounceGentle: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
