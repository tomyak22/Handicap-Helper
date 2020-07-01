FROM node:12
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json ./
RUN npm cache clean
RUN npm install
COPY . .
EXPOSE 4200
CMD ["npm","start"]