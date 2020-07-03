FROM node:12 as node
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run install

# Second Stage
FROM nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=node /backend/dist /usr/share/nginx/html
