FROM node:12 as node
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["ng","build", "--prod"]

FROM nginx:alpine

COPY --from=node /frontend/dist /usr/share/nginx/html