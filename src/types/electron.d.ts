import type { IpcRendererEvent } from 'electron';

// DCS-BIOS data types
interface DcsBiosDataBase {
  type: string;
  value: unknown;
}

interface DcsBiosAntiSkidData extends DcsBiosDataBase {
  type: 'AntiSkid';
  value: string;
}

interface DcsBiosClb1Data extends DcsBiosDataBase {
  type: 'CL_B1';
  value: number;
}

interface DcsBiosCduLineData {
  line: number;
  name: string;
  address: number;
  value: string;
}

interface DcsBiosCduScreenData extends DcsBiosDataBase {
  type: 'CDU_SCREEN';
  lines: DcsBiosCduLineData[];
}

interface DcsBiosGenericData extends DcsBiosDataBase {
  type: string;
  value: string | number | unknown;
}

type DcsBiosData =
  | DcsBiosAntiSkidData
  | DcsBiosClb1Data
  | DcsBiosCduScreenData
  | DcsBiosGenericData
  | string
  | unknown;

declare global {
  interface Window {
    electron: {
      onDcsbiosStatus: (
        callback: (event: IpcRendererEvent, status: string) => void,
      ) => void;
      onDcsbiosData: (
        callback: (event: IpcRendererEvent, data: DcsBiosData) => void,
      ) => void;
      onDcsbiosError: (
        callback: (event: IpcRendererEvent, error: string) => void,
      ) => void;
    };
  }
}

export {};
