FROM node:15

WORKDIR /EJSProjBlog

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD["node", "index.js"]

