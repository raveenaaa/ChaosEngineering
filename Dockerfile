FROM ubuntu:latest

RUN apt-get update
# Basics
RUN apt-get install -y build-essential git vim curl

RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs
# Networking tools
RUN apt-get install iproute2

# Cat facts server
COPY . /srv
RUN cd /srv && npm install
EXPOSE 3000

# Chaos scripts
COPY ./chaos/ /chaos

WORKDIR /srv

