FROM ubuntu:latest
WORKDIR /webapp
COPY WebApp .
RUN apt-get update && apt-get install npm nodejs ffuf -y
RUN npm install
CMD ["npm", "start"]