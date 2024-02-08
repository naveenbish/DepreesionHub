import { useEffect, useState } from "react";
import { chatbotsvg } from "../assets";

export default function ChatBot() {
  const [state, setState] = useState(true);
  let messages = [];
  let args = {};
  useEffect(() => {
    args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
    };
  });

  useEffect(() => {
    display();
  });

  function display() {
    const { openButton, chatBox, sendButton } = args;
    if (openButton) {
      openButton.addEventListener("click", () => toggleState(chatBox));
    }

    if (sendButton) {
      sendButton.addEventListener("click", () => onSendButton(chatBox));
    }

    if (chatBox) {
      const node = chatBox.querySelector("input");
      // Check if input element is present before adding event listener
      if (node) {
        node.addEventListener("keyup", ({ key }) => {
          if (key === "Enter") {
            onSendButton(chatBox);
          }
        });
      }
    }
  }

  function toggleState(chatbox) {
    setState(!state);

    // show or hides the box
    if (state) {
      chatbox.classList.add("chatbox--active");
    } else {
      chatbox.classList.remove("chatbox--active");
    }
  }

  function onSendButton(chatbox) {
    var textField = chatbox.querySelector("input");
    let text1 = textField.value;
    if (text1 === "") {
      return;
    }

    let msg1 = { name: "User", message: text1 };
    messages.push(msg1);
    console.log(messages);
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify({ message: text1 }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        let msg2 = { name: "Sam", message: r.answer };
        messages.push(msg2);
        updateChatText(chatbox);
        textField.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        updateChatText(chatbox);
        textField.value = "";
      });
  }

  function updateChatText(chatbox) {
    var html = "";
    messages
      .slice()
      .reverse()
      .forEach(function (item) {
        if (item.name === "Sam") {
          html +=
            '<div class="messages__item messages__item--visitor">' +
            item.message +
            "</div>";
        } else {
          html +=
            '<div class="messages__item messages__item--operator">' +
            item.message +
            "</div>";
        }
      });  
    const chatmessage = chatbox.querySelector(".chatbox__messages");
    chatmessage.innerHTML = html;
  }
  return (
    <>
      <div className="container">
        <div className="chatbox">
          <div className="chatbox__support">
            <div className="chatbox__header">
              <div className="chatbox__image--header">
                <img
                  src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png"
                  alt="image"
                />
              </div>
              <div className="chatbox__content--header">
                <h4 className="chatbox__heading--header">Chat support</h4>
                <p className="chatbox__description--header">
                  Hi. My name is tanmay.How can I help you?
                </p>
              </div>
            </div>
            <div className="chatbox__messages">
              <div></div>
            </div>
            <div className="chatbox__footer">
              <input type="text" placeholder="Write a message..." />
              <button className="chatbox__send--footer send__button">
                Send
              </button>
            </div>
          </div>
          <div className="chatbox__button">
            <button>
              <img src={chatbotsvg} onClick={() => display()} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
