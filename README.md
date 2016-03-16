<h2>Installation:</h2>

git clone https://github.com/tkprocat/node-won-portal.git

cd node-won-portal 

npm install

<h2>Configuration:</h2>

Copy config.js.dist to config.js

Open config.js

Change the line "name: 'Example', ip: '192.168.2.1', mac: 'AA:BB:CC:DD:EE:FF'" to appropiate values.

Change the default password (default password is secret).

Put a ssl.crt and ssl.key in /cert folder.

<h2>Run:</h2>

npm start