import { connect } from "mqtt";
import { Server as SocketServer } from "socket.io";

export function initMqtt(io: SocketServer) {
  if (process.env.MQTT_HOST) {
    const client = connect(process.env.MQTT_HOST, {
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD,
    });
    client.on("connect", () => {
      client.subscribe("opp/A24308160", (err) => {
        if (!err) {
          console.log("Contectado a broker MQTT");
        }
      });
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        const deviceId = topic.split("/")[1];

        io.to(`device-${deviceId}`).emit("mqtt-message", { topic, data });
      } catch (err) {
        console.log("Payload MQTT inválido:", err);
      }
    });

    client.on("error", (err) => {
      console.log("Error MQTT:", err);
    });
  } else {
    console.log("error sin credenciales");
  }
}
