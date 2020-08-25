const WebSocket = require('ws');

var deviceClients = [];
var deviceControllers = [];

module.exports = {
  start: ()=>{
    const wss = new WebSocket.Server({
      port: 3001
    });

    wss.on('connection', function (ws){
      console.log("Client connecting...");
      ws.on('message', function(message){
        console.log(message)
        const messageObj = JSON.parse(message);

        switch (messageObj.type) {

          case 'REGISTER_CLIENT':{
            if(deviceClients.findIndex(dc=>dc.deviceId === messageObj.deviceId) === -1) {
              ws.device = {
                id: messageObj.deviceId,
                name: messageObj.deviceName
              };
              deviceClients.push({
                deviceId: messageObj.deviceId,
                deviceName: messageObj.deviceName,
                ws
              })
            } else {
              console.log('Client already connected: '+ messageObj.deviceId)
            }
            break
          }

          case 'REGISTER_SERVER': {
            if( deviceControllers.findIndex(dc=>dc===messageObj.id) !== -1){
              deviceControllers.push({
                serverId: messageObj.id,
                ws
              })
            }
            break
          }

          case 'SEND_ACTION_TO_CLIENT': {
            /*
            messageObj = {
              deviceId: clientDeviceId,
              type: 'ACTION_TO_PERFORM_ON_CLIENT',
              payload: {}
            }
            */

            const client = deviceClients.find(dc => dc.deviceId === messageObj.deviceId);
            if(client){
              client.ws.send(JSON.stringify({
                deviceId: client.deviceId,
                ...messageObj.payload,
              }))
            }
            break
          }

          case 'ASK_CONNECTED_DEVICES': {
            const allDevices = deviceClients.map(dc=>({id: dc.deviceId, name: dc.deviceName}));
            console.log(allDevices)
            ws.send(JSON.stringify({
              type: 'RESPOND_CONNECTED_DEVICES',
              payload:{
                devices: allDevices
              }
            }));

            break
          }

          default: {
            console.log('received jiji: %s', message);
          }
        }

      });

      ws.on('close', function close() {
        if(ws.hasOwnProperty('device')){
          deviceClients = deviceClients.filter(dc => dc.deviceId !== ws.device.id);
          if(ws.hasOwnProperty('device')){
            console.log('Client '+ws.device.name+' disconnected');
          } else {
            console.log('Client disconnected');

          }
        }
      });

    });

    wss.on('listening', function(){
      console.log("Listening")
    });

    wss.on('close', function(){
      console.log("Closing Websocket");
    })
  }
};
