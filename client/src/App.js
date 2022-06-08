import React, { useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import $ from "jquery";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
// import ReactTextFormat from 'react-text-format';

var markup, appendMesage, sendMessage;
const socket = io.connect("http://localhost:4000");
let name;
do {
  name = prompt("please enter ur name:");
} while (!name);
let textarea = document.querySelector("#textarea");

const handleEnter = (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
};

// receiver message

socket.on("message", (msg) => {
  appendMesage(msg, "incoming");
  scrollToBottom();
});

const scrollToBottom = () => {
  let messageArea = document.querySelector(".message__area");
  messageArea.scrollTop = messageArea.scrollHeight;
};

const App = () => {
  let count = 1;
  var [bold, setBold] = useState(false);
  var [italics, setItalics] = useState(false);
  var [strike, setStrike] = useState(false);
  var [link, setLink] = useState(false);
  var [quote, setQuote] = useState(false);
  var [bullets, setBullets] = useState(false);
  var [numbers, setNumbers] = useState(false);
  var [code, setCode] = useState(false);
  var [emoji, setEmoji] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    let textarea = document.querySelector("#textarea");

    textarea.value += emojiObject.emoji;
  };

  if (bold === true) $(".bold").css("border", "1px solid black");
  else $(".bold").css("border", "none");
  if (italics === true) $(".italic").css("border", "1px solid black");
  else $(".italic").css("border", "none");
  if (strike === true) $(".strike").css("border", "1px solid black");
  else $(".strike").css("border", "none");
  if (link === true) $(".link").css("border", "1px solid black");
  else $(".link").css("border", "none");
  if (quote === true) $(".quote").css("border", "1px solid black");
  else $(".quote").css("border", "none");
  if (bullets === true) $(".bullets").css("border", "1px solid black");
  else $(".bullets").css("border", "none");
  if (code === true) $(".code").css("border", "1px solid black");
  else $(".code").css("border", "none");
  if (numbers === true) $(".numbers").css("border", "1px solid black");
  else {
    $(".numbers").css("border", "none");
    count = 0;
  }

  appendMesage = (msg, type) => {
    let messageArea = document.querySelector(".message__area");
    let mainDiv = document.createElement("div");
    let className = type;
    mainDiv.classList.add(className, "message");
    let chat = `<p>${msg.message}</p>`;
    if (msg.quote === true) chat = `<p> "${msg.message}" </p>`;
    if (msg.bullets === true) chat = chat.replace("<p>", "<p>⚫");
    if (msg.code === true) {
      chat = chat.replace("<p>", "<code>");
      chat = chat.replace("</p>", "</code>");
    }
    if (msg.numbers === true) chat = chat.replace("<p>", `<p>${count++}. `);
    if (msg.bold === true) chat = "<strong>" + chat + "</strong>";
    if (msg.italics === true) chat = "<i>" + chat + "</i>";
    if (msg.strike === true) chat = '<div class="striked">' + chat + "</div>";
    if (msg.link === true)
      chat = `<a href="https://${msg.message}">` + chat + "</a>";

    markup = `
    <h4>${msg.user}</h4>
    ${chat}
    `;

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
  };
  sendMessage = (message) => {
    let textarea = document.querySelector("#textarea");

    let msg = {
      user: name,
      message: message.trim(),
      bold: bold,
      italics: italics,
      strike: strike,
      link: link,
      quote: quote,
      bullets: bullets,
      numbers: numbers,
      code: code,
    };
    //append
    appendMesage(msg, "outgoing");
    textarea.value = "";
    scrollToBottom();
    //send to server

    socket.emit("message", msg);
  };

  return (
    <div>
      <section class="chat__section">
        <div class="brand">
          <img height="40" src="/whats.png" alt="" />
          <h1>Baatein</h1>
        </div>
        <div class="message__area"></div>
        <div id="inputArea">
          <div className="format">
            <div
              class="bold"
              onClick={() => {
                bold ? setBold(false) : setBold(true);
              }}
            >
              <img src="/bold.png" height="25" alt="" />
            </div>
            <div
              class="italic"
              onClick={() => {
                italics ? setItalics(false) : setItalics(true);
              }}
            >
              <img src="/italics.png" height="25" alt="" />
            </div>
            <div
              class="strike"
              onClick={() => {
                strike ? setStrike(false) : setStrike(true);
              }}
            >
              <img src="/strike.png" height="25" alt="" />
            </div>
            <div
              class="link"
              onClick={() => {
                link ? setLink(false) : setLink(true);
              }}
            >
              <img src="/link.png" height="25" alt="" />
            </div>
            <div
              class="quote"
              onClick={() => {
                quote ? setQuote(false) : setQuote(true);
              }}
            >
              <img src="/quote.png" height="25" alt="" />
            </div>
            <div
              class="bullets"
              onClick={() => {
                bullets ? setBullets(false) : setBullets(true);
              }}
            >
              <img src="/bullets.png" height="25" alt="" />
            </div>
            <div
              class="numbers"
              onClick={() => {
                numbers ? setNumbers(false) : setNumbers(true);
              }}
            >
              <img src="/numbers.png" height="25" alt="" />
            </div>
            <div
              class="code"
              onClick={() => {
                code ? setCode(false) : setCode(true);
              }}
            >
              <img src="/code.png" height="25" alt="" />
            </div>
          </div>

          <textarea
            id="textarea"
            cols="30"
            rows="1"
            placeholder="Write a message..."
            onKeyUp={handleEnter}
          ></textarea>
          <div className="format">
            <div class="emoji">
              <img
                onClick={() => {
                  emoji ? setEmoji(false) : setEmoji(true);
                }}
                src="/emoji.png"
                height="25"
                alt=""
              />
              {emoji && (
                <Picker
                  onEmojiClick={onEmojiClick}
                  disableAutoFocus={true}
                  skinTone={SKIN_TONE_MEDIUM_DARK}
                  groupNames={{ smileys_people: "PEOPLE" }}
                  native
                />
              )}
            </div>
            <div className="send">
              <img src="/send.png" alt="" height="25" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
