from node:10.10.0-alpine

copy . /src

workdir /src
run npm install
expose 3000

cmd ["npm","start"]