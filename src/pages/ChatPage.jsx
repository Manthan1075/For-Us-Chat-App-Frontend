import React, { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Image, Send, Smile, X } from "lucide-react";
import Message from "../components/Message.jsx";
import { getMessages, sendImage, sendMessage } from "../services/messageServices.js";
import { useUser } from "../context/UserContext.jsx";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { subscribe, getSocket, unsubscribe } from '../socket/socket.js'

function ChatPage() {
  const { user } = useUser();
  const friendId = useParams().friendId || "691bfce4fec5b1e4a3e70594";

  const [messages, setMessages] = useState([]);
  const [inputMessageData, setInputMessageData] = useState({
    text: "",
    repliedOf: null,
  });
  const [image, setImage] = useState(null);

  const fetchMessages = async () => {
    try {
      const response = await getMessages({
        senderId: friendId,
        page: 1,
        limit: 25,
        userId: user?._id,
      });

      // setMessages(response.data);
    } catch (error) {
      console.log("ERROR GETTING MESSAGES :", error);
    }
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();

    try {
      const response = await sendMessage({
        text: inputMessageData.text,
        receiver: friendId,
        repliedOf: "",
        userid: user._id,
      });

      setInputMessageData({ text: "", repliedOf: null });
    } catch (error) {
      console.log("ERROR SENDING MESSAGE :", error);
    }
  };

  const handleSendImage = async () => {
    if (!image) return;
    try {
      const response = await sendImage({
        receiverId: friendId,
        image: image,
        userId: user._id,
      });

      setImage(null);
    } catch (error) { }
  };

  const handleReceiveMessage = ({ message }) => { }
  const handleReactOnMsg = ({ message }) => { }
  const handleDeleteMsg = ({ message }) => { }
  const handleMsgSeen = ({ message }) => { }
  const handleTypingStatus = ({ isTyping }) => { }

  useEffect(() => { })

  return (
    <div className="flex flex-col h-[100dvh]">

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 custom-scrollbar">
        {messages.length > 0 &&
          messages.map((msg) => (
            <Message
              key={msg._id}
              message={msg}
              isSender={msg?.sender === user._id}
            />
          ))}
      </div>

      {/* REPLY PREVIEW */}
      {inputMessageData.repliedOf && (
        <div className="px-4 py-2 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-md border-t">
          <div className="max-w-xl mx-auto p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs opacity-70">Replying to</p>
              <p className="text-sm font-medium">
                {inputMessageData.repliedOf?.text || "Image"}
              </p>
            </div>
            <button
              onClick={() =>
                setInputMessageData({ ...inputMessageData, repliedOf: null })
              }
              className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {image && (
        <div className="px-4 pb-3">
          <div className="relative max-w-xl mx-auto overflow-hidden rounded-2xl shadow-xl border bg-white dark:bg-neutral-900">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full max-h-80 object-contain bg-neutral-100 dark:bg-neutral-800"
            />

            <Button
              variant="ghost"
              className="absolute top-2 right-2 rounded-full"
              onClick={() => setImage(null)}
            >
              <X />
            </Button>

            <div className="flex justify-center p-2">
              <Button onClick={handleSendImage}>
                SEND <Send className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* INPUT BAR (fixed perfectly at bottom) */}
      {!image && (
        <div className="p-4 border-t bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
          <div className="max-w-xl mx-auto flex gap-2 items-center">

            {/* Emoji Picker */}
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost" size="icon">
                  <Smile size={22} />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="p-0 border-none bg-transparent">
                <div className="rounded-xl shadow-lg bg-white dark:bg-neutral-900 p-2">
                  <EmojiPicker
                    onEmojiClick={(emoji) =>
                      setInputMessageData({
                        ...inputMessageData,
                        text: inputMessageData.text + emoji.emoji,
                      })
                    }
                    searchDisabled
                    previewConfig={{ showPreview: false }}
                    theme="dark"
                  />
                </div>
              </PopoverContent>
            </Popover>

            {/* INPUT + SEND + IMAGE */}
            <form onSubmit={handleSendMsg} className="flex w-full gap-2">
              <Input
                placeholder="Type a message..."
                className="rounded-xl"
                value={inputMessageData.text}
                onChange={(e) =>
                  setInputMessageData({
                    ...inputMessageData,
                    text: e.target.value,
                  })
                }
                required
              />

              <label className="bg-primary px-3 rounded-xl flex items-center cursor-pointer hover:bg-primary/90 text-white">
                <Input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) setImage(e.target.files[0]);
                  }}
                />
                <Image size={18} />
              </label>

              <Button type="submit">
                <Send />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
