import type { IpcRendererEvent } from 'electron';

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

declare global {
  interface Window {
    electron: {
      onWctrlExportStatus: (
        callback: (event: IpcRendererEvent, status: string) => void,
      ) => void;
      onWctrlExportData: (
        callback: (event: IpcRendererEvent, data: WctrlExportData) => void,
      ) => void;
      onWctrlExportError: (
        callback: (event: IpcRendererEvent, error: string) => void,
      ) => void;
    };
  }
}

export {};
