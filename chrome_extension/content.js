const init = function () {
    
    var htmlCollection = document.querySelectorAll("input");
    var inputs = [...htmlCollection];
    var passwordFieldFound = false;

    for (var i=0; i<inputs.length; i++) {
        console.log(inputs[i].type.toLowerCase());
        if (inputs[i].type.toLowerCase() === "password") {
            passwordFieldFound = true;
            break;
        }
    }
    
    if (passwordFieldFound) {


        (async () => {
            const response = await chrome.runtime.sendMessage({greeting: "password_field_found"});
            console.log(response);
        })();
          
          
        // const windowFeatures = "left=100,top=100,width=600,height=400";
        // window.open("password-safety.html", "password-safety", windowFeatures)
        // chrome.windows.create({url : "password-safety.html",type: "popup", height, width, left, top});        
    }

}

init();

function logMessage(message) {
    console.log("Message from background: ", message)
}



// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    

//     if (request.msg === "phishing") {

//         chrome.action.openPopup({popup: "popup.html"});
        
//         // chrome.tabs.create({
            
//         //     url: 'not-safe.html',
//         //     active: false
//         //   }, function(openTab) {
//         //       // After the tab has been created, open a window to inject the tab
//         //       chrome.windows.create({
//         //           tabId: openTab.id,
//         //           type: 'popup',
//         //           focused: true
//         //           // incognito, top, left, ...
//         //       });
//         //   });

//         }
    
//     sendResponse({ status: "done" });
// });