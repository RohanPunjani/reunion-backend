FROM node:19-alpine3.16
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=5000
ENV MONGODB_URI=mongodb://localhost:27017/test_database
EXPOSE 5000
CMD [ "npm", "start" ]


