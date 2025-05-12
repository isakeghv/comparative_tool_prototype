# commenting out stuff for production currently

FROM node:18

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install

COPY . /app

# RUN npm run build

EXPOSE 3000

# CMD ["node", ".output/server/index.mjs"]

# for development mode
#CMD ["npm", "run", "dev"]