interface Window {
  electron: {
    onTcpData: (callback: (event: Event, data: string) => void) => void;
    onTcpStatus: (callback: (event: Event, data: string) => void) => void;
    sendTcpData: (data: string) => void;
  };
}
