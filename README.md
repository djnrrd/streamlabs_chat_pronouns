# streamlabs_chat_pronouns
Custom Javscript for Streamlabs chat overlays that adds pronouns from [alejo.io](https://pronouns.alejo.io/)

## Background

Many people are using the fantastic Twitch chat pronouns service and plugins from [alejo.io](https://pronouns.alejo.io/), but the embedded browser in OBS studio isn't able to load the plugin to have in-video chat render people's pronouns.

Many people use Streamlabs chat overlays in both OBS Studio and Streamlabs OBS, and they provide the ability to load custom Javascript, HTML and CSS to the overlay.

## Installation

- If you haven't already, sign up for [Streamlabs](https://streamlabs.com/), you do not need to use Streamlabs OBS to sign up and use their services.
- Select "All Widgets" And then find the Chatbox widget

![Screenshot of All Widgets menu option](https://github.com/djnrrd/streamlabs_chat_pronouns/blob/main/res/All_Widgets_Streamlabs.png?raw=true) ![Screenshot of Chatbox option](https://github.com/djnrrd/streamlabs_chat_pronouns/blob/main/res/Select_Chatbox_Streamlabs.png?raw=true)
- Scroll down to the bottom of the Chatbox settings
- Set "Enable Custom HTML/CSS" to "Enabled"
- Select "HTML" and replace the contents of the box with the contents of [sl_overlay_pronouns.html](https://github.com/djnrrd/streamlabs_chat_pronouns/blob/main/sl_overlay_pronouns.html)
- Select "JS" and replace the contents of the box with the contents of [sl_overlay_pronouns.js](https://github.com/djnrrd/streamlabs_chat_pronouns/blob/main/sl_overlay_pronouns.js)

![Screenshot of custom HTML/CSS option](https://github.com/djnrrd/streamlabs_chat_pronouns/blob/main/res/Chat_Box_Streamlabs.png?raw=true)

## Known Issues

- **Pronouns are not displayed on first chat** - To make sure calls to the pronouns service do not lock the obs-browser plugin, they are made asynchronously, updating the cache of pronouns after the first message is sent.  All susbequent messages should render the user's pronouns. 
 
![Screenshot of first message issue](https://github.com/djnrrd/streamlabs_chat_pronouns/blob/main/res/first_load_issue.png?raw=true)

- **Users and Bots who are not registered with the pronouns service display an empty brackets pair** - I'm looking to change this very soon.

![Screenshot of empty bracket issue](https://github.com/djnrrd/streamlabs_chat_pronouns/blob/main/res/unregistered_brackets.png?raw=true)

- **The ends of display names and pronouns are replaced with ellipsis on narrow browsers** - This is a default behaviour of Streamlabs chat overlay. Either make your obs-browser instance wider to accommodate this, or look at using custom CSS. I'm looking to create custom CSS and add this as a suggested extra to this repository.

![Screenshot of ellipsis issue](https://github.com/djnrrd/streamlabs_chat_pronouns/blob/main/res/username_compression.png?raw=true)

## Customisation and Pull Requests

If you wish to do further customations to this code, always respect the 5 minute cache period. Alejo provides this service for free and we should not overload his server.  Please consider donating Alejo some cash via his [Patreon](https://patreon.com/alejo_47) or [Paypal](https://paypal.me/alejo47)
