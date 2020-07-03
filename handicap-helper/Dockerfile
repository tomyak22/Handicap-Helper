FROM node:12 as node
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .
RUN ng build

# Second Stage
FROM nginx
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=node /frontend/dist /usr/share/nginx/html
