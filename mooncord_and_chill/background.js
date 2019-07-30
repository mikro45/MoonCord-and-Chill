'use strict';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Listens for message, fetches the API and sends back parsed JSON
    // we allow only certain API requests for safety reasons
    let callFetch = function(url) {
      fetch(url)
          .then(response => response.json())
          .then(emotes => sendResponse(emotes))
          .catch(error => console.error('Error:', error));
    };

    // Twitch moonmoon_ow and global emotes
    if (request.contentScriptQuery === "twitch") {
      let url = "https://api.twitchemotes.com/api/v4/channels/" +
              encodeURIComponent(request.itemId);
      callFetch(url);
      return true;  // Will respond asynchronously.
    }
    // Bttv moonmoon_ow emotes
    else if (request.contentScriptQuery === "bttv") {
      let url = "https://api.betterttv.net/2/channels/" +
              encodeURIComponent(request.itemId);
      callFetch(url);
      return true;  // Will respond asynchronously.
    }
    // Bttv global emotes
    else if (request.contentScriptQuery === "bttv_global") {
      let url = "https://api.betterttv.net/2/emotes";
      callFetch(url);
      return true;  // Will respond asynchronously.
    }
    // Twitch emoticons, read from file
    else if (request.contentScriptQuery === "twitch_json") {
      let url = chrome.runtime.getURL('data/twitch_emoticons.json');
      callFetch(url);
      return true;  // Will respond asynchronously.
    }
});
