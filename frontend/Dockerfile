# Stage 1: Build the React application
FROM node:18-alpine AS build

# --- اصلاحیه اینجاست ---
# هر دو متغیر باید با ARG تعریف شوند
ARG VITE_API_BASE_URL
ARG VITE_OPENCAGE_API_KEY
# -------------------------

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# هر دو متغیر با ENV برای Vite تنظیم می‌شوند
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_OPENCAGE_API_KEY=${VITE_OPENCAGE_API_KEY}

# برنامه را با متغیرهای محیطی بیلد کنید
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]