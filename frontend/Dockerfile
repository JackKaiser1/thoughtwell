FROM node:24.15.0-alpine
WORKDIR /frontend
COPY . .
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev"]