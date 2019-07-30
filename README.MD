# MoonCord and Chill

Enhances ``andchill.tv`` website with global and ``moonmoon_ow`` emotes from Twitch and BTTV. 

Available only for **Chrome** and **Opera** (or in theory any Chromium based browser).

By smiley face mostly *(mikro45l)*.

## How to install

**Disclaimer: This isn't official nor recommended way of installing packages, e.g. ``Chrome Web Store``, but it is currently only way to do so.**

1. [Download the extension](/mikro45/MoonCord-and-Chill/releases/download/v1.0/mooncord_and_chill.zip), *(also possible through releases page)*.
2. Extract the downloaded extension.
2. Enable ``Developer mode`` in ``extensions`` page in your browser by clicking on the button ``Developer mode``.
3. Choose ``Load unpacked`` option and select the inside of the extracted folder.
4. Enjoy :).

Chrome and maybe other browsers will occasionally scream at you for using an extension installed in developer mode.

The reason being, that Chrome doesn't like (support) if you install extensions from outside the ``Chrome Web Store`` by either using the ``Load unpacked`` option or even by manually installing packaged one, ``(*.crx)``.

## How the extension works

Extension is enabled only on the ``https://*.andchill.tv/`` domain.

Then on the page load, it **requests** ``https://api.twitchemotes.com/api/*`` and ``https://api.betterttv.net/2/*`` for emotes through messaging the **background** script, creates a dictionary of the emotes for quick search and **observes** for new messages.

Extension **observes** a chat box **(#chat-messages)** on the page for any changes, that is a new message, that is a new element added to the unordered list **(ul)**.

If it detects a change, it takes the element and searches the emotes dictionary word for word and if it finds a match, it then replaces the word with **img** element, if not, it just appends the text to the element.
