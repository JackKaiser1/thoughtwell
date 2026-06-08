FROM node:24.15.0-alpine
WORKDIR /app
COPY . .
RUN cd frontend && npm install && npm run build 
RUN cd backend && npm install
WORKDIR /app/backend
CMD ["npm", "run", "dev"]
EXPOSE 8080

