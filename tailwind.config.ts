import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "Helvetica Neue", "Arial", "Helvetica", "sans-serif"],
      },
      colors: {
        "gray-light": "rgb(224, 225, 226)",
        "black-87": "rgba(0, 0, 0, .87)",
        "black-70": "rgba(0, 0, 0, .70)",
        "gray-dark": "#D3D3D3",
        "grayish": "#F8F8F9",
        "blueish": "#4183c4",
      },
      fontSize: {
        "24px": "24px",
        "20px": "20px",
        "17px": "17px",
      },
      borderWidth: {
        "3": "3px",
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
