FROM node:8-slim
COPY . /var/www/html
WORKDIR /var/www/html
CMD [ "yarn", "start" ]
