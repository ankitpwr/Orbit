
FROM node:22-alpine AS builder

WORKDIR /build

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN DATABASE_URL=postgresql://dummy:dummy@localhost/dummy npx prisma generate 

RUN npm run build

RUN cp -r src/generated/prisma/. dist/generated/prisma/

 
FROM node:22-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --omit=optional

COPY --from=builder /build/dist ./dist

ARG SERVICE=api

ENV SERVICE=${SERVICE}

EXPOSE 3001

CMD ["sh", "-c", "if [ \"$SERVICE\" = \"api\" ]; then node dist/index.js; else node dist/worker/$SERVICE.js; fi"]