$(document).ready(function() {
    
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
        var tab = tabs[0];
        var url = new URL(tab.url);
        
        $('#site-hostname').html(url.hostname);
        $('#site-protocol').html(url.protocol);
        
        if (url.protocol === 'https:') {
            $('#ssl-implemented').prop('checked', true);
        } else {
            $('#ssl-implemented').prop('checked', false);
        }

        var stringURL = url.toString();

        if (stringURL.indexOf('_') > 0) {
            $('#url-name-safe').prop('checked', false);
        } else if (stringURL.endsWith('.')) {
            $('#url-name-safe').prop('checked', false);
        } else if (/^[\x00-\x7F]*$/.test(stringURL)) {
            $('#url-name-safe').prop('checked', true);
        } else {
            $('#url-name-safe').prop('checked', false);
        }

        fetch('http://localhost:9091/get-host-status/' + url.hostname).then(r => r.json()).then(async result => {
            console.log(result.type);
            if (result.type !== 'benign') {
                $('#url-content-safe').prop('checked', false);
            } else {
                $('#url-content-safe').prop('checked', true);
            }
        });

    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.msg === "phishing") {
            alert("Data: " + request.data);
        }
        sendResponse({message: "Response from background"});

    })

});