# Dockerfile

# base image
FROM node:12-slim

# create & set working directory
RUN mkdir -p /srv/app
WORKDIR /srv/app

# copy source files
COPY . /srv/app

# install dependencies
RUN npm install
EXPOSE 80 443

# start app
RUN chmod a+x ./startup.sh
CMD ["./startup.sh"]
