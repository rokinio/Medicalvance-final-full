# --- مرحله 1: ساخت (Build Stage) ---
# این مرحله، نسخه نهایی و بهینه شده فرانت‌اند را می‌سازد.
FROM node:18-alpine AS builder

# تنظیم پوشه کاری
WORKDIR /app

# کپی کردن پکیج‌ها و نصب آنها
COPY package*.json ./
RUN npm install

# کپی کردن تمام کدهای دیگر
COPY . .

# مهم‌ترین دستور: ساختن نسخه نهایی برای Production
# این دستور به صورت خودکار از فایل .env.production استفاده می‌کند
RUN npm run build

# --- مرحله 2: سرو (Serve Stage) ---
# این مرحله، یک وب‌سرور سبک برای نمایش فایل‌های نهایی است.
FROM nginx:stable-alpine

# کپی کردن فایل‌های نهایی از مرحله قبل (پوشه dist) به پوشه وب‌سرور
COPY --from=builder /app/dist /usr/share/nginx/html

# کپی کردن تنظیمات Nginx برای پشتیبانی از React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

#暴露端口
EXPOSE 80

# اجرای وب‌سرور
CMD ["nginx", "-g", "daemon off;"]