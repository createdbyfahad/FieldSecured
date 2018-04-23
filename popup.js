document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.local.get('total_fields', function (items){
        var total_fields = items["total_fields"] || 0;
        document.getElementById("phishing_fields_count").innerHTML = total_fields;
    });
    
}, false);