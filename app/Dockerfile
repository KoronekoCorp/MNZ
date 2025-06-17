FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mv ./next.docker.js ./next.config.js
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN mkdir -p /app/.next/cache/fetch-cache && chown nextjs:nodejs /app/.next/cache/fetch-cache 
VOLUME /app/.next/cache/fetch-cache

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV DB_PROXY=https://db.elysia.rip \
    TurnstileS=1x0000000000000000000000000000000AA	\
    s3_domain=nmsl.s3.tebi.io

CMD ["node", "server.js"]