FROM node:stretch-slim

WORKDIR /usr/favorites

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY *.json ./
COPY *.js ./

RUN npm install
EXPOSE 5002

CMD ["node", "favorites.js"]