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

// Import the DCS-BIOS data types
type DcsBiosData =
  | { type: 'AntiSkid'; value: string }
  | { type: 'CL_B1'; value: number }
  | { type: 'CDU_SCREEN'; lines: Array<{ line: number; name: string; address: number; value: string }> }
  | { type: string; value: string | number | unknown }
  | string
  | unknown;

// Définir les types pour les événements IPCAdd commentMore actions
interface ElectronAPI {
  onDcsbiosStatus: (callback: (event: IpcRendererEvent, status: string) => void) => void;
  onDcsbiosData: (callback: (event: IpcRendererEvent, data: DcsBiosData) => void) => void;
  onDcsbiosError: (callback: (event: IpcRendererEvent, error: string) => void) => void;
}

// Exposer les API sécurisées au processus de renduAdd commentMore actions
contextBridge.exposeInMainWorld('electron', {
  onDcsbiosStatus: (callback: (event: IpcRendererEvent, status: string) => void) => ipcRenderer.on('dcsbios-status', callback),
  onDcsbiosData: (callback: (event: IpcRendererEvent, data: DcsBiosData) => void) => ipcRenderer.on('dcsbios-data', callback),
  onDcsbiosError: (callback: (event: IpcRendererEvent, error: string) => void) => ipcRenderer.on('dcsbios-error', callback)
} as ElectronAPI);
