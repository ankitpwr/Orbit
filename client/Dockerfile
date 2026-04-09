FROM node:22-alpine AS builder

WORKDIR /build

ARG VITE_BACKEND_URL
ARG VITE_CLIENT_ID
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_CLIENT_ID=$VITE_CLIENT_ID

COPY ./package.json package.json

COPY ./package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine-otel

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]





