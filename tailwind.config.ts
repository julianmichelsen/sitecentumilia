import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          neon: "#01FAA4",
          cyan: "#00DEFE",
          blue: "#2874EE",
          purple: "#BB61EC",
          dark: "#161616",
          darker: "#0a0a0a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        heading: ["var(--font-syne)", "ui-serif", "system-ui"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(90deg, #00DEFE 0%, #2874EE 50%, #BB61EC 100%)',
        'gradient-neon': 'linear-gradient(90deg, #01FAA4 0%, #00DEFE 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
