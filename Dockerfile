FROM node:8-slim
COPY . /var/www/html
EXPOSE 8888
WORKDIR /var/www/html
CMD [ "yarn", "start" ]
