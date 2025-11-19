import { useEffect } from 'react'
import { socket } from './socket'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log("Connected To Backend");
    })

    socket.emit("send_message", {
      username: "Rathod",
    })

    socket.on("receive_message", (data) => {
      console.log(`Message received from ${data.username}: ${data.message}`);
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(`New message from ${data.username}`, {
            body: data.message,
          });
        }
      });
    })


  }, [])

  function sendMessage(txt) {
    socket.emit("send_message", {
      username: "Manthan",
      message: txt,
    })
  }

  return (
    <div>
      Hello World!
      <input type="text" name="message" id="message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(e.target.value);
            e.target.value = "";
          }
        }}
      />

      <EmojiPicker suggestedEmojisMode='recent' onEmojiClick={(emoji) => sendMessage(emoji)} />
    </div>
  )
}

export default App
