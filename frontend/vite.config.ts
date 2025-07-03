import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  envDir: "../../", // این خط بسیار مهم است
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
