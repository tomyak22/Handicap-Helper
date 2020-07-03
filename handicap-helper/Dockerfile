FROM node:12
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["npm","start"]