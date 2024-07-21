/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Définir les types pour les événements IPC
interface ElectronAPI {
  onTcpData: (callback: (event: IpcRendererEvent, data: string) => void) => void;
  onTcpStatus: (callback: (event: IpcRendererEvent, data: string) => void) => void;
  sendTcpData: (data: string) => void;
}

// Exposer les API sécurisées au processus de rendu
contextBridge.exposeInMainWorld('electron', {
  onTcpData: (callback: (event: IpcRendererEvent, data: string) => void) => ipcRenderer.on('tcp-data', callback),
  onTcpStatus: (callback: (event: IpcRendererEvent, data: string) => void) => ipcRenderer.on('tcp-status', callback),
  sendTcpData: (data: string) => ipcRenderer.send('send-tcp-data', data)
} as ElectronAPI);




