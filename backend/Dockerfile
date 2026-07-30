FROM node:24.15.0-alpine
WORKDIR /backend
COPY . .
RUN npm install
EXPOSE 8080
CMD ["sh", "setup.sh"]
