# --- مرحله ۱: آشپزخانه (ساختن نسخه نهایی) ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # <--- در اینجا پوشه /app/dist ساخته می‌شود

# --- مرحله ۲: رستوران (سرو کردن غذای آماده) ---
FROM nginx:stable-alpine
# ما فقط پوشه dist را از آشپزخانه به رستوران می‌آوریم
COPY --from=builder /app/dist /usr/share/nginx/html 
# ... بقیه تنظیمات وب‌سرور