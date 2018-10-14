
const { ipcRenderer } = require('electron')


// Handle site logon
ipcRenderer.on("logon:netflix", function (e, preferences) {
    if(preferences) {
        var username = document.querySelector('input#username');
        if(username) {
            username.value = preferences.userEMail;
        }
        var password = document.querySelector('input#password');
        if(password) {
            password.value = preferences.userEMailPassword;
        }
        var submit = document.querySelector('a#post-ok');
        if(submit) {
            submit.click();
        }
    }

});

// Handle site probing
ipcRenderer.on("probe:netflix", function (e) {
    
    // Get all document buttons
    var buttons = document.getElementsByTagName("button");
    
    // Loop all buttons
    for (var index = 0; index < buttons.length; index++) {

        // Get current button
        var current = buttons[index];

        // Check if we found the GET TASK button
        if(current.innerText.indexOf("GET TASK") > -1)
        {
            // Send the found getTask message
            ipcRenderer.send("found:getTask", true);
            return;
        }
    } 
});
