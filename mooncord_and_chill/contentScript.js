'use strict';

const BTTV_EMOTE_URL = "https://cdn.betterttv.net/emote/EMOTE_ID/1x";
const TWCH_EMOTE_URL = "https://static-cdn.jtvnw.net/emoticons/v1/EMOTE_ID/1.0";

/*
 * Emotes dictionary related stuff
 */

let emoteDict = {};

let makeEmoteDict = function(responseJson, bttv, twitchGlobalEmotes) {
    // builds emote dict from provided response JSON
    let emoteUrl = TWCH_EMOTE_URL;
    if (bttv) {
        emoteUrl = BTTV_EMOTE_URL;
    }
    if (responseJson && "emotes" in responseJson) {
      let emote;
      for (emote of responseJson.emotes) {
          if (twitchGlobalEmotes && parseInt(emote.id) >= 1 && parseInt(emote.id) <= 14) {
              continue;
          }
          emoteDict[emote.code] = emoteUrl.replace("EMOTE_ID", emote.id);
      }
    }
};

// Send message to a background to fetch the APIs
// We need to use a background to avoid dangerous cross-origin requests
// https://www.chromium.org/Home/chromium-security/extension-content-script-fetches

// Twitch moonmoon_ow emotes
chrome.runtime.sendMessage(
    {contentScriptQuery: "twitch", itemId: 121059319},
    emotes => makeEmoteDict(emotes, false));

// Twitch global emotes
chrome.runtime.sendMessage(
    {contentScriptQuery: "twitch", itemId: 0},
    emotes => makeEmoteDict(emotes, false, true));

// Bttv moonmoon_ow emotes
chrome.runtime.sendMessage(
    {contentScriptQuery: "bttv", itemId: "moonmoon_ow"},
    emotes => makeEmoteDict(emotes, true));

// Bttv global emotes
chrome.runtime.sendMessage(
    {contentScriptQuery: "bttv_global"},
    emotes => makeEmoteDict(emotes, true));

// Twitch emoticons, read from file, full list,
// because twitch normally uses RegEx to read them,
// but we didn't want to use RegEx for security reasons
chrome.runtime.sendMessage(
    {contentScriptQuery: "twitch_json"},
    emotes => makeEmoteDict(emotes, false));


/*
 * Observer related stuff
 */

function constructImgDom(name, url) {
    let img = document.createElement('img');
    img.src = url;
    img.alt = name;
    img.title = name;
    return img;
}

// Subscriber (callback) function to execute when mutations are observed
const subscriber = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.target.nodeName === "UL") {
            // Element structure looks always the same
            // else we got the wrong one
            // tree looks like this:
            // ul.li.p.span
            let element = mutation.target.lastChild.firstChild.lastChild;
            if (element) {
                let msg = element.innerText;
                let msgArray = msg.split(" ");
                let word;
                element.innerText = "";
                // In message replace all potential emotes (words) with <img> element
                // and text with 'text' element and append to original <span>
                for (word of msgArray) {
                    if (word in emoteDict) {
                        element.appendChild(document.createTextNode(" "));
                        element.appendChild(constructImgDom(word, emoteDict[word]));
                    }
                    else {
                        let textNode = document.createTextNode(" " + word);
                        element.appendChild(textNode);
                    }
                }
            }
        }
    }
};

// Select the node that will be observed for mutations
const targetNode = document.getElementById('chat-messages');

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Create an observer instance linked to the subscriber function
const observer = new MutationObserver(subscriber);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
