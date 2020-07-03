FROM node:12 as node
RUN mkdir -p /backend

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# Second Stage
FROM nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=node /backend/dist /usr/share/nginx/html