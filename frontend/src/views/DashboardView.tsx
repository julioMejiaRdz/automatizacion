import { useEffect, useState } from "react";
import Card from "../components/Card";
import type { SensorEvent } from "../types";
import { useSocket } from "../context/SocketContext";


export default function DashboardView() {
  const [reading, setReading] = useState<SensorEvent | null>(null);
  const [connected, setConnected] = useState(false);
  const deviceId = 'A24308160';

  const socket = useSocket()

  useEffect(() => {
    socket.on('connect', () => {
        setConnected(true)
        socket.emit('join-device', deviceId) 
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on('mqtt-message', (msg: SensorEvent) => setReading(msg))

    return () => {
        socket.off('connect')
        socket.off('disconnect')
        socket.off('mqtt-message')
    }
}, [socket])



  const valores = reading?.data[deviceId] as Record<string, number> | undefined;
  return (
  <div className="p-6 max-w-2xl mx-auto">
    {/* indicador conexión */}
    <div className="flex items-center gap-2 mb-6">
      <span className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
      <span className="text-sm text-gray-600">
        {connected ? "Conectado" : "Desconectado"}
      </span>
    </div>

    <h1 className="text-2xl font-bold mb-4">Dispositivo: {deviceId}</h1>
    <p className="text-xs text-gray-400 mb-4">{reading?.data["fecha y hora"] ?? "Esperando datos..."}</p>

    {!valores ? (
      <p className="text-gray-400">Esperando mensajes...</p>
    ) : (
      <div className="grid grid-cols-2 gap-4">
        <Card label="Temperatura de bobina" value={valores["temperatura de bobina"]} unit="°C" />
        <Card label="Conductividad"         value={valores["conductividad"]}         unit="S/m" />
        <Card label="Velocidad de flujo"    value={valores["velocidad de flujo"]}    unit="m/s" />
        <Card label="Flujo volumétrico"     value={valores["flujo volumetrico"]}     unit="m³/h" />
        <Card label="Flujo másico"          value={valores["flujo masico"]}          unit="kg/h" />
        <Card label="Totalizador"           value={valores["totalizador"]}           unit="m³" />
      </div>
    )}
  </div>
);

}
