let activeTabId = "", lastUrl = "", lastTitle = "";

async function getTabInfo(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);

    if (activeTabId != tab.id || lastUrl != tab.url || lastTitle != tab.title) {
      console.log(tab);
      lastUrl = tab.url;
      lastTitle = tab.title;
      activeTabId = tab.id;

      var url = new URL(tab.url);
      var hostname = url.hostname;

      // Check if the hostname matches youtube.com
      if (hostname === "youtube.com" || hostname === "www.youtube.com" || hostname === "o2.co.uk" || hostname === "www.o2.co.uk") {
        console.log("Navigated to YouTube");
        var height = 600;
        var width = 800;
        var left = 100;
        var top = 100;

        chrome.windows.create({
          url: "not-safe.html",
          type: "popup",
          height,
          width,
          left,
          top
        });
        return; // Exit early since YouTube is handled
      }

      // Check if the URL starts with http
      if (tab.url.startsWith("http")) {
        // Fetch the host status from the backend
        fetch('http://localhost:9091/get-host-status/' + hostname)
          .then(r => r.json())
          .then(async result => {
            if (result.type === 'benign') {
              console.log("Website is benign:", hostname);

              // Example benign functionality: Send a message to the tab
              const message = {
                msg: "benign",
                data: {
                  subject: "Hostname is safe",
                  content: `The website (${hostname}) is safe to browse.`
                }
              };
              await sendMessage(tab.id, message);
            } else {
              console.log("Website is not benign:", hostname);

              var height = 600;
              var width = 800;
              var left = 100;
              var top = 100;

              chrome.windows.create({
                url: "not-safe.html",
                type: "popup",
                height,
                width,
                left,
                top
              });
            }
          })
          .catch(error => {
            console.error("Error fetching host status:", error);
          });
      }
    }
  } catch (error) {
    if (error == "Error: Tabs cannot be edited right now (user may be dragging a tab).") {
      setTimeout(() => getTabInfo(tabId), 50);
    } else {
      console.error(error);
    }
  }
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  setTimeout(() => {
    insertScript(activeInfo);
  }, 100);

  getTabInfo((activeTabId = activeInfo.tabId));
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (activeTabId == tabId) {
    getTabInfo(tabId);
  }
});

async function sendMessage(tabId, message) {
  console.log("Sending message to tabId: ", tabId);
  await chrome.tabs.sendMessage(tabId, message, resp => {
    console.log("response: ", resp);
  });
}

function insertScript(tab) {
  chrome.tabs.get(tab.tabId, function (info) {
    console.log(info);
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting === "password_field_found") {
    var height = 600;
    var width = 800;
    var left = 100;
    var top = 100;

    chrome.windows.create({
      url: "password-safety.html",
      type: "popup",
      height,
      width,
      left,
      top
    });

    sendResponse({ farewell: "goodbye" });
  }
});
 