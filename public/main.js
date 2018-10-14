const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const sendMail = require('./mailer.js');
const Store = require('./store.js');


let mainWindow
let checkHandle = 0;

// Create the application store
const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: { width: 1000, height: 600 },
  }
});

/**
 * Creates the main window
 */
function createWindow() {

  // Indicate loading
  setStatusBar("Loading..");

  // Get window size
  let { width, height } = store.get('windowBounds');

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: width, height: height })

  // and load the app.
  mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null
  });

  // Store last window size
  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

  // Check every 10 seconds if there is a task
  checkHandle = setInterval(probeNetflix, 10000);


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed (For Mac).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// For Mac
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})




// Create the application menu
Menu.setApplicationMenu(
  Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        { label: 'Exit', role: 'close' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        {
          label: 'Preferences',
          click() {
            editPreferences();
          }
        },
        {
          label: 'Logon',
          click() {
            logonNetflix();
          }
        }
      ]
    },

    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            editPreferences();
          }
        }
      ]
    }
  ]
  ));

/**
 * Probe the netflix site
 */
function probeNetflix() {
  if (mainWindow) {
    mainWindow.webContents.send("probe:netflix");
  }
}

/**
 * Logon to netflix
 */
function logonNetflix() {
  if (mainWindow) {
    mainWindow.webContents.send("logon:netflix", store.get('preferences'));
  }
}

/**
 * edit application preferences
 */
function editPreferences() {
  if (mainWindow) {

    // Get preferences
    let preferences = store.get('preferences');

    // If we need to initialize preferences
    if (!preferences) preferences = {
      ngEMail: '',
      ngPassword: '',
      userEMail: '',
      userPassword: '',
      notificationEMail: ''
    };

    // Show the edit preferences window
    mainWindow.webContents.send("edit:preferences", {
      ngEMail: preferences.ngEMail,
      ngPassword: preferences.ngPassword,
      userEMail: preferences.userEMail,
      userPassword: preferences.userPassword,
      notificationEMail: preferences.notificationEMail
    });
  }
}


// Handle the found task message
ipcMain.on("found:getTask", function (e, item) {
  if (item) {

    // Get preferences
    let preferences = store.get('preferences');
    if (preferences) {
      sendMail(preferences.ngEMail, preferences.ngEMailPassword, preferences.notificationEMail, "Found task!", "Found task!").then(() => {
        clearInterval(checkHandle);
        setStatusBar("Mail Sent!");
      }).catch((reason) => {
        setStatusBar("Failed to send mail! [reason='" + reason + "']");
      });
    } else {
      setStatusBar("Failed to send mail! [reason=preferences]");
    }

  }
});

// Handle the preferences editing
ipcMain.on('save:preferences', function (e, preferences) {
  
  store.set('preferences', {
    ngEMail: preferences.ngEMail,
    ngPassword: preferences.ngPassword,
    userEMail: preferences.userEMail,
    userPassword: preferences.userPassword,
    notificationEMail: preferences.notificationEMail
  });

  setStatusBar('Preferences Saved');
});

/**
 * Set the status bar text
 * @param {string} text 
 */
function setStatusBar(text) {
  if (mainWindow) {
    mainWindow.webContents.send("set:statusBar", text);
  }
}

