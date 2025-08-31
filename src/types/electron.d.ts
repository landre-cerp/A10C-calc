import type { IpcRendererEvent } from 'electron';
declare global {
  interface Window {
    electron: {
      onDcsbiosStatus: (callback: (event: IpcRendererEvent, status: string) => void) => void;
      onDcsbiosData: (callback: (event: IpcRendererEvent, data: any) => void) => void;
      onDcsbiosError: (callback: (event: IpcRendererEvent, error: string) => void) => void;
    };
  }
}
export { };
