import net from 'net';
import { BrowserWindow } from 'electron';

const port = 31090;

const server = net.createServer((socket) => {

  BrowserWindow.getAllWindows().forEach(win => {

    console.log('Client connecté');
    win.webContents.send('tcp-status', 'Client connecté');
  });

  socket.on('data', (data) => {
    // Envoyer les données au processus de rendu via ipcMain
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('tcp-data', data.toString());
    });
  });

  socket.on('end', () => {

    BrowserWindow.getAllWindows().forEach(win => {
      console.log('Client Déconnecté');

      win.webContents.send('tcp-status', 'Client déconnecté');
    });


  });
});

server.listen(port, '127.0.0.1', () => {

  BrowserWindow.getAllWindows().forEach(win => {
    console.log('Serveur TCP en écoute sur le port ' + port);
    win.webContents.send('tcp-status', 'Serveur TCP en écoute sur le port ' + port);
  });

});
