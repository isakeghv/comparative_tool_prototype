FROM node:18

WORKDIR /app

COPY app/package.json /app/
COPY app/package-lock.json /app/

RUN npm install

COPY app/ /app

# RUN npm run generate
RUN npm run build

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8183

EXPOSE 8183

CMD ["node", ".output/server/index.mjs"]