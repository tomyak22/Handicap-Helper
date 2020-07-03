FROM node:12
RUN mkdir -p /backend

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /backend/public

COPY --from=handi-tracker-ui /frontend/dist/handicap-helper /backend/public

EXPOSE 3000

CMD ["npm", "start"]