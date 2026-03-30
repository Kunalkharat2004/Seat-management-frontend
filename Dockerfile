# ---------- Stage 1: Build the React (Vite) app ----------
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then corepack enable && yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

COPY . .

# Use your variable name
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ---------- Stage 2: Serve with nginx ----------
FROM nginx:1.25-alpine

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]