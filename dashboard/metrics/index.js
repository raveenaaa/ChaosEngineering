// websocket server that dashboard connects to.
const got = require('got');
const fs = require('fs');
const path = require('path');


/// Servers data being monitored.
var servers = 
[
    {name: 'blue', url: 'http://192.168.44.102:3080/health'},
    {name: 'green', url: 'http://192.168.66.108:3080/health'},
];

function startDashboard(app)
{
	////////////////////////////////////////////////////////////////////////////////////////
	// DASHBOARD
	////////////////////////////////////////////////////////////////////////////////////////
	const io = require('socket.io')(3050);
	// Force websocket protocol, otherwise some browsers may try polling.
	io.set('transports', ['websocket']);
	// Whenever a new page/client opens a dashboard, we handle the request for the new socket.
	io.on('connection', function (socket) {
        console.log(`Received connection id ${socket.id} connected ${socket.connected}`);

		if( socket.connected )
		{
			//// Broadcast heartbeat event over websockets ever 1 second
			var heartbeatTimer = setInterval( async function () 
			{
                for (server of servers )
                {
					let captureServer = server;
                    let resp =await got(server.url, {timeout: 5000, throwHttpErrors: false}).catch( e => 
					{
					});
					if( resp )
					{
						captureServer.stat = JSON.parse(resp.body);
						
						for( var client of captureServer.stat)
						{
							// calculate timing
							if( client.timings.length == 0 )
							{
								client.latency = 0;
							} else {
								let sum = client.timings.reduce((a, b) => a + b)
								client.latency = sum/client.timings.length;
							}
							console.log(`${captureServer.name} ${client.timings}`);
							client.status = "#00ff00";
						}
						// console.log(server);
					}
                }

				socket.emit("heartbeat", servers);
			}, 3000);

			//// If a client disconnects, we will stop sending events for them.
			socket.on('disconnect', function (reason) {
				console.log(`closing connection ${reason}`);
				clearInterval(heartbeatTimer);
			});
		}
    });

}

module.exports.startDashboard = startDashboard;
