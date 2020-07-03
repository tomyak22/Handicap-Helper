FROM node:12 as node
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package*.json ./
# RUN npm cache clean
RUN npm install
RUN npm install -g @angular/cli@9.0.1
COPY . /frontend
EXPOSE 4200
CMD ["ng", "serve", "--host 0.0.0.0"]
