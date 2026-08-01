import * as dgram from 'dgram';
import { BrowserWindow } from 'electron';

// Matches Scripts/wctrl-export/wctrl-export-config.lua on the DCS side.
const PORT = 31090;
const HOST = '127.0.0.1';

export interface WctrlExportData {
  ver?: number;
  aircraft?: string;
  environment?: {
    wind_direction_deg?: number;
    wind_speed_kts?: number;
    temperature_c?: number;
    pressure_hpa?: number;
    pressure_inhg?: number;
  };
  position?: {
    lat?: number;
    lon?: number;
    alt_ft?: number;
  };
}

const server = dgram.createSocket({ type: 'udp4', reuseAddr: true });

function broadcast(channel: string, payload: unknown) {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(channel, payload);
  });
}

server.on('listening', () => {
  const address = server.address();
  broadcast('wctrl-export-status', `Listening on ${address.address}:${address.port}`);
});

server.on('message', (message) => {
  try {
    const data = JSON.parse(message.toString('utf-8')) as WctrlExportData;
    broadcast('wctrl-export-data', data);
  } catch (err) {
    broadcast(
      'wctrl-export-error',
      `Failed to parse packet: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
});

server.on('error', (err) => {
  broadcast('wctrl-export-error', `UDP error: ${err.stack}`);
  server.close();
});

server.bind(PORT, HOST);
