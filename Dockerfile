FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Dev image — runs the Vite dev server with hot reload. Source is
# bind-mounted in docker-compose.yml, so rebuilding the image is only
# needed when package.json changes.
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production build
FROM base AS build
COPY . .
RUN npm run build

# Production runtime — static build served by nginx
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80