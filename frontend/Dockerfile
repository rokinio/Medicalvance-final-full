# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# ========================================================
# highlight-start
# 1. یک آرگومان برای دریافت URL در زمان ساخت تعریف کنید
ARG VITE_API_BASE_URL
# 2. آن را به عنوان یک متغیر محیطی برای Vite تنظیم کنید
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# highlight-end
# ========================================================

# 3. حالا Vite از این متغیر در زمان build استفاده می‌کند
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# highlight-start
# این خط را از حالت کامنت خارج کنید تا فایل تنظیمات کپی شود
COPY nginx.conf /etc/nginx/conf.d/default.conf
# highlight-end

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]