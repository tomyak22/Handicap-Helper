FROM node:12 as node
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . /frontend
EXPOSE 4200
CMD ["npm", "start"]
