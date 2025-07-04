import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // خط envDir به طور کامل حذف شده است
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
