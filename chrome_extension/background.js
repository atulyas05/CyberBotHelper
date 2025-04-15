let activeTabId = "", lastUrl = "", lastTitle = "";

async function getTabInfo(tabId) {

  try {


    const tab = await chrome.tabs.get(tabId);

    if(activeTabId != tab.id || lastUrl != tab.url || lastTitle != tab.title) {
      
      console.log(tab);
      lastUrl = tab.url;
      lastTitle = tab.title;
      activeTabId = tab.id;

      if (tab.url.startsWith("http")) {
        var url = new URL(tab.url);
        var hostname = url.hostname;

        fetch('http://localhost:9091/get-host-status/' + hostname).then(r => r.json()).then(async result => {
          if (result.type !== 'benign') {

            var height = 600;
            var width = 800;
            var left = 100;
            var top = 100;

            chrome.windows.create({url : "not-safe.html",type: "popup", height, width, left, top});


            // chrome.tabs.create({
            //   url: 'popup.html',
            //   active: false
            // }, function(openTab) {
            //     console.log(openTab);
            //     if (openTab) {
            //     // After the tab has been created, open a window to inject the tab
            //       chrome.windows.create({
            //         tabId: openTab.id,
            //         type: 'popup',
            //         focused: true
            //         // incognito, top, left, ...
            //       });
            //     }
            // });

          }
        })

      }

    }

  } catch (error) {
    if (error == "Error: Tabs cannot be edited right now (user may be dragging a tab).") {
      setTimeout(() => getTabInfo(tabId), 50);
    } else {
      console.error(error);
    }    
  }

  // chrome.tabs.get(tabId, function(tab) {
  //   if(lastUrl != tab.url || lastTitle != tab.title)

  //     lastUrl = tab.url;
  //     lastTitle = tab.title
      
  //     if (tab.url.startsWith("http")) {

  //       var url = new URL(tab.url);
  //       var hostname = url.hostname;

  //       fetch('http://localhost:9091/get-host-status/' + hostname).then(r => r.json()).then(async result => {
          
  //         if (result.type === 'benign') {

  //           // (async () => {              
              
  //           //   console.log("sending benign");
  //           //   var message = {msg: "benign", data: {subject: "hostname is safe",content: "Avoid this website (" + hostname + ") as it is not safe!"}}
  //           //   console.log(message);
  //           //   const response = await chrome.tabs.sendMessage(tab.id, message);
  //           //   console.log(response);

  //           // })();

  //         } else {

  //           chrome.tabs.create({
  //             url: 'popup.html',
  //             active: false
  //           }, function(openTab) {
  //               // After the tab has been created, open a window to inject the tab
  //               chrome.windows.create({
  //                   tabId: openTab.id,
  //                   type: 'popup',
  //                   focused: true
  //                   // incognito, top, left, ...
  //               });
  //           });


  //           // (async () => {
              
            
  //           // console.log("sending phishing");
  //           // var message = {msg: "phishing", data: {subject: "hostname not safe",content: "Avoid this website (" + hostname + ") as it is not safe!"}}
  //           // console.log(message);
  //           // const response = await chrome.tabs.sendMessage(tab.id, message);
  //           // console.log(response);

  //           // })();

  //         }

  //       })        
  //     }
  // });
}

chrome.tabs.onActivated.addListener(function(activeInfo) {

  setTimeout(() => {
    insertScript(activeInfo);
  }, 100);

  getTabInfo(activeTabId = activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if(activeTabId == tabId) {
    getTabInfo(tabId);
  }
});

async function sendMessage(tabId, message) {
  console.log("Sending message to tabId: ", tabId)
  await chrome.tabs.sendMessage(tabId, message, (resp) => {console.log("response: ", resp)});
}

function insertScript(tab) {
  chrome.tabs.get(tab.tabId, function (info) {
    console.log(info);
   });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting === "password_field_found") {

      var height = 600;
      var width = 800;
      var left = 100;
      var top = 100;

      chrome.windows.create({url : "password-safety.html",type: "popup", height, width, left, top});

      sendResponse({farewell: "goodbye"});
    }
  }
);