FROM node:6

# Create sentimeter directory
RUN mkdir /operator-api
WORKDIR /operator-api

# Variables
ENV NODE_ENV production
ENV LOGGING false

# Install
COPY . /operator-api

RUN npm install .

EXPOSE 8080
CMD ["node", "index.js"]
