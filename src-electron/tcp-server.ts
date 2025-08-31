import * as dgram from 'dgram';
import { BrowserWindow } from 'electron';

const PORT = 5010;
const MULTICAST_ADDR = '239.255.50.10';
const syncSequence = new Uint8Array([0x55, 0x55, 0x55, 0x55]);
let dcsbiosData: Buffer = Buffer.alloc(65536);

const client = dgram.createSocket({ type: 'udp4', reuseAddr: true });

client.on('listening', () => {
  const address = client.address();
  console.log(`UDP Client listening on ${address.address}:${address.port}`);
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('dcsbios-status', `UDP Client listening on ${address.address}:${address.port}`);
  });
  client.addMembership(MULTICAST_ADDR, '0.0.0.0');
});

client.on('message', (message, remote) => {
  if (detectUpdate(message)) {
    let offset = 4;
    while (message.length - offset > 0) {
      let startAddress = message.readUInt16LE(offset);
      offset += 2;
      let dataLenB = message.readUInt16LE(offset);
      offset += 2;
      message.copy(dcsbiosData, startAddress, offset, offset + dataLenB);
      offset += dataLenB;

      // Example: send Anti Skid status
      if (startAddress === 0x1110) {
        const antiSkid = decodeValue(dcsbiosData, 0x1110, 0x0080, 7) ? 'ON' : 'OFF';
        BrowserWindow.getAllWindows().forEach(win => {
          win.webContents.send('dcsbios-data', { type: 'AntiSkid', value: antiSkid });
        });
      }
      // Example: send CL_B1 value
      if (startAddress === 0x10d4) {
        const clb1 = decodeValue(dcsbiosData, 0x10d4, 0x0010, 4);
        BrowserWindow.getAllWindows().forEach(win => {
          win.webContents.send('dcsbios-data', { type: 'CL_B1', value: clb1 });
        });
      }
      // Example: send CDU lines
      if ([0x11d8, 0x11f0, 0x1208].includes(startAddress)) {
        const cduLine = decodeString(dcsbiosData, startAddress, 24);
        BrowserWindow.getAllWindows().forEach(win => {
          win.webContents.send('dcsbios-data', { type: 'CDU', address: startAddress, value: cduLine });
        });
      }
    }
  } else {
    console.log(`Received invalid message: ${bytesToHex(message)}`);
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('dcsbios-error', `Received invalid message: ${bytesToHex(message)}`);
    });
  }
});

client.on('error', (err) => {
  console.log(`UDP Client error: ${err.stack}`);
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('dcsbios-error', `UDP Client error: ${err.stack}`);
  });
  client.close();
});

client.bind(PORT, '0.0.0.0', () => {
  console.log(`Client bound to port ${PORT}`);
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('dcsbios-status', `Client bound to port ${PORT}`);
  });
});

function bytesToHex(byteArray: Uint8Array): string {
  return Array.from(byteArray)
    .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

function decodeString(buffer: Buffer, address: number, length: number): string {
  return buffer
    .toString('ascii', address, address + length)
    .replace(/\x00/g, '')
    .trimEnd();
}

function detectUpdate(message: Buffer): boolean {
  if (message.length < 4) {
    return false;
  }
  for (let i = 0; i < 4; i++) {
    if (message[i] !== syncSequence[i]) {
      return false;
    }
  }
  return true;
}

function decodeValue(buffer: Buffer, startAddress: number, mask: number, shift: number): number {
  if (startAddress < 0 || startAddress + 2 > buffer.length) {
    throw new RangeError(`Index ${startAddress} is out of range. Buffer length: ${buffer.length}`);
  }
  const value = buffer.readUInt16LE(startAddress);
  const decodedValue = (value & mask) >> shift;
  return decodedValue;
}
