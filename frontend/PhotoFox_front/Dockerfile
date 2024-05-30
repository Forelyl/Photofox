FROM node
WORKDIR /frontend

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]