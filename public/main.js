const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const sendMail = require('./mailer.js');
const Store = require('./store.js');

const isDev = require('electron-is-dev');
const path = require('path');

const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

let mainWindow
let checkHandle = 0;

// Add logging support
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';



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
  mainWindow.title = 'NG Netflix Monitor';

  // and load the app.
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : 'file://' + path.join(__dirname, '../build/index.html'));

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null
  });

  // Store last window size
  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    store.set('windowBounds', { width, height });
  });

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

app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('checking-for-update', () => {
  setStatusBar('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  setStatusBar('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  setStatusBar('Update not available.');
})
autoUpdater.on('error', (err) => {
  showMessage('Error','Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  setStatusBar(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  autoUpdater.quitAndInstall();  
});

let monitorMode = 'mail_task';

// Handle the preferences editing
handleWindowMessage('enable:monitor', function (mode) {
  monitorMode = mode;
  enableMonitoring();
});


handleWindowMessage("gettask:netflixResult" , function (success) {
  if (success) {
    showMessage("Success", "Get task was clicked!", [
      { text: 'Close' }
    ]);
  } else {
    showMessage("Failure", "Failure to get task!", [
      { text: 'Close' }
    ]);
  }
});

// Handle the found task message
handleWindowMessage("found:getTask", function (success) {
  if (success) {

    // Get preferences
    let preferences = store.get('preferences');
    if (preferences) {

      clearInterval(checkHandle);

      switch (monitorMode) {
        case 'get_task':
          getTaskNetflix();
          break;
        case 'mail_task':
          sendMail(preferences.ngEMail, preferences.ngPassword, preferences.notificationEMail, "A netflix task is available!", "Go get it at https://originator.backlot.netflix.com...").then(() => {
            showMessage("Success", "Mail Sent!", [
              { text: 'Resend', action: "found:getTask", args: success },
              { text: 'Close' }
            ]);
          }).catch((reason) => {
            showMessage("Failure", "Failed to send mail! [reason='" + reason + "']", [
              { text: 'Retry', action: "found:getTask", args: success },
              { text: 'Close' }
            ]);
          });
          break;
      }

    } else {
      showMessage("Failure", "Failed to send mail! [reason=preferences]", [
        { text: 'Retry', action: "found:getTask", args: success },
        { text: 'Close' }
      ]);
    }

  } else {
    setStatusBar("Get task was not found.")
    startMonitoring();
  }
});

// Handle the preferences editing
handleWindowMessage('save:preferences', function (preferences) {

  store.set('preferences', {
    ngEMail: preferences.ngEMail,
    ngPassword: preferences.ngPassword,
    userEMail: preferences.userEMail,
    userPassword: preferences.userPassword,
    notificationEMail: preferences.notificationEMail
  });

  setStatusBar('Preferences Saved');
});


// Create the application menu
Menu.setApplicationMenu(
  Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Preferences',
          click() {
            editPreferences();
          }
        },
        { type: 'separator' },
        { label: 'Exit', role: 'close' }
      ]
    },
    {
      label: 'Actions',
      submenu: [
        {
          label: 'Start',
          click() {
            startMonitoring();
          }
        },
        {
          label: 'Stop',
          click() {
            stopMonitoring();
          }
        },
        { type: 'separator' },
        {
          label: 'Logon',
          click() {
            logonNetflix();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggledevtools' },
      ]
    },

    {
      role: 'help',
      submenu: [
        {
          label: 'About',
          click() {
            showAbout();
          }
        }
      ]
    }
  ]
  ));


  /**
 * Get the netflix task
 */
function getTaskNetflix() {
  sendWindowMessage("gettask:netflix");
}


/**
 * Probe the netflix site
 */
function probeNetflix() {
  sendWindowMessage("probe:netflix");
}

/**
 * Logon to netflix
 */
function logonNetflix() {
  sendWindowMessage("logon:netflix", store.get('preferences'));
}

/**
 * Shows the about window
 */
function showAbout() {
  showMessage("About", "Version:" + app.getVersion());
}

/**
 * Start task monitoring
 */
function startMonitoring() {
  showMessage("Monitoring", "Select action to take if task is found...", [
    { text: 'Get task', action: "enable:monitor", args: 'get_task' },
    { text: 'Send Mail', action: "enable:monitor", args: 'mail_task' },
    { text: 'Cancel' }
  ]);
}

function enableMonitoring() {
  clearTimeout(checkHandle);
  checkHandle = setTimeout(probeNetflix, 10000);
  setStatusBar("Started task monitoring.");
}

/**
 * Stop task monitoring
 */
function stopMonitoring() {
  clearTimeout(checkHandle);
  setStatusBar("Stopped task monitoring.");
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



/**
 * Set the status bar text
 * @param {string} text 
 */
function setStatusBar(text) {
  sendWindowMessage("set:statusBar", text);
}

/**
 * Show a message dialog
 * @param {string} title 
 * @param {string} message 
 * @param {array} buttons
 */
function showMessage(title, message, buttons) {
  sendWindowMessage("show:message", { title: title, message: message, buttons: buttons });
}

/**
 * Sends a message to the main window
 * @param {string} channel 
 * @param {object} args 
 */
function sendWindowMessage(channel, args) {
  if (mainWindow) {
    mainWindow.webContents.send(channel, args);
  }
}

/**
 * Handles a message sent from the main window
 * @param {string} channel 
 * @param {method} handler 
 */
function handleWindowMessage(channel, handler) {
  if (handler) {
    ipcMain.on(channel, function (e, args) {
      handler(args);
    });
  }
}



