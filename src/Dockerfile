FROM node:18

WORKDIR /src

COPY package.json /src/
COPY package-lock.json /src/
RUN npm install

COPY . /src/

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
