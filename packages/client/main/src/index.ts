import { app, BrowserWindow, shell, protocol } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import { Logger } from './util/logger';
import * as Protocol from './util/protocol';

protocol.registerSchemesAsPrivileged([
  {
    scheme: Protocol.scheme,
    privileges: {
      standard: true,
      secure: true,
    },
  },
]);

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

// Install "Vue.js devtools"
if (import.meta.env.MODE === 'development') {
  app
    .whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(
      ({ default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS }) =>
        installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], {
          loadExtensionOptions: {
            allowFileAccess: true,
          },
        }),
    )
    .catch((e) => Logger.error('Failed install extension:', e));
}

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  if (app.isPackaged) {
    protocol.registerFileProtocol(Protocol.scheme, Protocol.requestHandler);
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    resizable: false,
    backgroundColor: '#010a13',
    fullscreenable: false,
    roundedCorners: false,
    // transparent: true,
    center: true,
    frame: false,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      devTools: !app.isPackaged,
      nativeWindowOpen: true,
      disableBlinkFeatures: 'Auxclick',
      preload: import.meta.env.DEV
        ? join(__dirname, '../preload/index.cjs')
        : join(__dirname, './preload/index.cjs'),
    },
  });

  const splash = new BrowserWindow({
    width: 500,
    height: 230,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    fullscreenable: false,
    center: true,
    resizable: false,
    webPreferences: {
      devTools: !app.isPackaged,
      sandbox: true,
      contextIsolation: true,
      disableBlinkFeatures: 'Auxclick',
    },
  });

  mainWindow.webContents.once('did-finish-load', () => {
    splash.destroy();

    if (!mainWindow) {
      Logger.error('Main window is null');
      return;
    }

    mainWindow.show();
    mainWindow.focus();

    if (import.meta.env.DEV) {
      mainWindow?.webContents.openDevTools({ mode: 'detach' });
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  const mainWindowUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL('./renderer/index.html', `${Protocol.scheme}://`).toString();

  const splashWindowUrl = import.meta.env.DEV
    ? new URL(join(__dirname, '../splash/index.html'), 'file://').toString()
    : new URL('./splash/index.html', `${Protocol.scheme}://`).toString();

  splash.loadURL(splashWindowUrl);
  mainWindow.loadURL(mainWindowUrl);
};

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .catch((e) => Logger.error('Failed create window:', e));

if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => Logger.error('Failed check updates:', e));
}

app.on('web-contents-created', (_event, contents) => {
  contents.on('will-redirect', (contentsEvent, navigationUrl) => {
    shell.openExternal(navigationUrl);
    contentsEvent.preventDefault();
  });
});
