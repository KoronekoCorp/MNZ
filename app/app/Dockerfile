FROM node

WORKDIR /app

ENV DB_PROXY=https://db.elysia.rip \
TurnstileS=1x0000000000000000000000000000000AA	\
s3_domain=nmsl.s3.tebi.io



COPY . .
RUN npm install && npm run build && rm -rf node_modules/ && npm install --production

EXPOSE 3000

CMD ["npm", "start"]
