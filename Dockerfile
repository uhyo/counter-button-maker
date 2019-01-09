# Dockerfile for running counter-button-maker
FROM node:8
MAINTAINER uhyo
# put things into src.
WORKDIR /service-counter-button-maker
# first copy package-related files.
COPY ./package.json ./package-lock.json ./
# then install dependencies.
RUN npm install --production
# copy files needed to run the application.
# only copy default (userless) server config.
COPY server-config/default.yaml ./server-config/
COPY static ./static/
COPY server/views ./server/views/
COPY dist ./dist/
COPY dist-server ./dist-server/
# make dist and static a volume so that it can be exposed to the host.
VOLUME /service-counter-button-maker/dist
VOLUME /service-counter-button-maker/static
# set user to node user.
USER node
# expose default port.
EXPOSE 8080
# define command to run the app.
CMD ["npm", "start"]
