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
  mainWindow.title = 'NG Netflix Monitor';
  
  // and load the app.
  mainWindow.loadURL('http://localhost:3000');

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
        {type: 'separator'},
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
 * Shows the about window
 */
function showAbout() {
  showMessage("About", "temp");
}

/**
 * Start task monitoring
 */
function startMonitoring() {
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



// Handle the found task message
ipcMain.on("found:getTask", function (e, item) {
  if (item) {

    // Get preferences
    let preferences = store.get('preferences');
    if (preferences) {
      sendMail(preferences.ngEMail, preferences.ngEMailPassword, preferences.notificationEMail, "Found task!", "Found task!").then(() => {
        clearInterval(checkHandle);
        showMessage("Success", "Mail Sent!", [
          { text: 'Resend', action: "found:getTask", args: item },
          { text: 'Close' }
        ]);
      }).catch((reason) => {
        showMessage("Failure", "Failed to send mail! [reason='" + reason + "']", [
          { text: 'Retry', action: "found:getTask", args: item },
          { text: 'Close' }
        ]);
      });
    } else {
      showMessage("Failure", "Failed to send mail! [reason=preferences]", [
        { text: 'Retry', action: "found:getTask", args: item },
        { text: 'Close' }
      ]);
    }

  } else {
    setStatusBar("Get task was not found.")
    startMonitoring();
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

/**
 * Show a message dialog
 * @param {string} title 
 * @param {string} message 
 * @param {array} buttons
 */
function showMessage(title, message, buttons) {
  if (mainWindow) {
    mainWindow.webContents.send("show:message", { title: title, message: message, buttons: buttons });
  }
}



