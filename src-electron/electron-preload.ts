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

interface WctrlExportData {
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

interface ElectronAPI {
  onWctrlExportStatus: (
    callback: (event: IpcRendererEvent, status: string) => void,
  ) => void;
  onWctrlExportData: (
    callback: (event: IpcRendererEvent, data: WctrlExportData) => void,
  ) => void;
  onWctrlExportError: (
    callback: (event: IpcRendererEvent, error: string) => void,
  ) => void;
}

contextBridge.exposeInMainWorld('electron', {
  onWctrlExportStatus: (
    callback: (event: IpcRendererEvent, status: string) => void,
  ) => ipcRenderer.on('wctrl-export-status', callback),
  onWctrlExportData: (
    callback: (event: IpcRendererEvent, data: WctrlExportData) => void,
  ) => ipcRenderer.on('wctrl-export-data', callback),
  onWctrlExportError: (
    callback: (event: IpcRendererEvent, error: string) => void,
  ) => ipcRenderer.on('wctrl-export-error', callback),
} as ElectronAPI);
