# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Copy only the frontend folder content
COPY frontend/package*.json ./
RUN npm ci

COPY frontend .
RUN npm run build

# ---------- Serve stage ----------
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN sed -i 's/try_files \$uri \$uri\/ =404;/try_files \$uri \/index.html;/' /etc/nginx/conf.d/default.conf || true
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
