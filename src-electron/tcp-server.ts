import * as dgram from 'dgram';
import { BrowserWindow } from 'electron';

const PORT = 5010;
const MULTICAST_ADDR = '239.255.50.10';
const syncSequence = new Uint8Array([0x55, 0x55, 0x55, 0x55]);
let dcsbiosData: Buffer = Buffer.alloc(65536);

const client = dgram.createSocket({ type: 'udp4', reuseAddr: true });

// CDU line addresses and max length
const CDU_LINES = [
  { name: 'CDU_LINE0', address: 0x11c0, length: 24 },
  { name: 'CDU_LINE1', address: 0x11d8, length: 24 },
  { name: 'CDU_LINE2', address: 0x11f0, length: 24 },
  { name: 'CDU_LINE3', address: 0x1208, length: 24 },
  { name: 'CDU_LINE4', address: 0x1220, length: 24 },
  { name: 'CDU_LINE5', address: 0x1238, length: 24 },
  { name: 'CDU_LINE6', address: 0x1250, length: 24 },
  { name: 'CDU_LINE7', address: 0x1268, length: 24 },
  { name: 'CDU_LINE8', address: 0x1280, length: 24 },
  { name: 'CDU_LINE9', address: 0x1298, length: 24 },
];

// CDU screen buffer: always holds latest state for all lines
let cduScreenBuffer: string[] = Array(CDU_LINES.length).fill('');

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

      // CDU line management: update buffer and send full screen
      CDU_LINES.forEach((line, idx) => {
        if (startAddress === line.address) {
          const cduLineValue = decodeString(dcsbiosData, line.address, line.length);
          cduScreenBuffer[idx] = cduLineValue;
          BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('dcsbios-data', {
              type: 'CDU_SCREEN',
              lines: cduScreenBuffer.map((value, i) => ({
                line: i + 1,
                name: CDU_LINES[i].name,
                address: CDU_LINES[i].address,
                value
              }))
            });
          });
        }
      });
    }
    // Always send CL_B1 value after processing the message
    const clb1 = decodeValue(dcsbiosData, 0x10d4, 0x0010, 4);
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('dcsbios-data', { type: 'CL_B1', value: clb1 });
    });
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
    .toString('latin1', address, address + length) // preserves all bytes
    .replace(/\x00/g, '')
    .replace(/\xB6/g, 'π') // map CDU pi symbol
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
