import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./compnents/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "Helvetica Neue", "Arial", "Helvetica", "sans-serif"],
      },
      colors: {
        "green-light": "rgb(224, 225, 226)",
        "black-87": "rgba(0, 0, 0, .87)",
        "gray-dark": "#BEBEBE",
        "red-dark": "#5B5570"
      },
      fontSize: {
        "24px": "24px",
        "20px": "20px",
      },
      fontWeight: {
        "bold-550": "550",
      },
      borderWidth: {
        "4": "4px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
