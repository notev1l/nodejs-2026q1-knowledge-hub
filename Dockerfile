FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY prisma.config.ts ./
RUN npm ci
COPY tsconfig*.json ./
COPY src/ ./src/
COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
RUN  addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 4000