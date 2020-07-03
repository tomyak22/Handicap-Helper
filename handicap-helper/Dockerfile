FROM node:12 as node
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
CMD ["ng","build", "--prod"]

FROM nginx:alpine
COPY --from=node /frontend/dist/handicap-helper /usr/share/nginx/html