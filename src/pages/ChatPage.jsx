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
import UserChat from "../components/UserChat.jsx";
import { fetchProfile } from "../services/userServices.js";
import ImagePreview from '../components/ImagePreview.jsx'
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog.js";
import { Avatar } from "../components/ui/avatar.js";

function ChatPage() {
  const { user } = useUser();
  const { friendId } = useParams();
  const [friendProfile, setFriendProfile] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState({
    fetchProfile: false,
    fetchMessages: false,
    sendMessage: false,
    sendImage: false,
  })
  const [inputMessageData, setInputMessageData] = useState({
    text: "",
    repliedOf: null,
  });
  const [image, setImage] = useState(null);

  const getFriendProfile = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetchProfile: true }));
      const response = await fetchProfile(friendId, user?._id);
      console.log("FRIEND PROFILE RESPONSE :", response);
      if (response.success) setFriendProfile(response.user);
      else setFriendProfile(null)
    } catch (error) {
      console.log("ERROR FETCHING FRIEND PROFILE :", error);
    } finally {
      setLoading((prev) => ({ ...prev, fetchProfile: false }));
    }
  }

  const fetchMessages = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetchMessages: true }));
      const response = await getMessages({
        senderId: friendId,
        page: 1,
        limit: 25,
        userId: user?._id,
      });

      setMessages(response.data.reverse());
    } catch (error) {
      console.log("ERROR GETTING MESSAGES :", error);
    } finally {
      setLoading((prev) => ({ ...prev, fetchMessages: false }));
    }
  };

  const handleSendMsg = async (e) => {
    try {
      e.preventDefault();
      setLoading(prev => ({ ...prev, sendMessage: true }))
      const response = await sendMessage({
        text: inputMessageData.text,
        receiver: friendId,
        repliedOf: "",
        userid: user._id,
      });

      console.log("SEND MESSAGE RESPONSE :", response);
      setMessages(prev => [...prev, response]);
      setInputMessageData({ text: "", repliedOf: null });
    } catch (error) {
      console.log("ERROR SENDING MESSAGE :", error);
    } finally {
      setLoading(prev => ({ ...prev, sendMessage: false }))
    }
  };

  const handleSendImage = async () => {
    if (!image) return;
    try {
      setLoading(prev => ({ ...prev, sendImage: true }))
      const response = await sendImage({
        receiverId: friendId,
        image: image,
        userId: user._id,
      });
      console.log("SEND IMAGE RESPONSE :", response);
      setImage(null);
    } catch (error) {
      console.log("ERROR SENDING IMAGE :", error);
    } finally {
      setLoading(prev => ({ ...prev, sendImage: false }))
    }

  };

  useEffect(() => {
    getFriendProfile();
    fetchMessages()
  }, [friendId]);

  useEffect(() => {
    const handlers = {};

    handlers.handleReceiveMessage = ({ message }) => {
      console.log("Received message:");
      console.log("Received message:", message);
      Optionally: setMessages(prev => [...prev, message]);
    };

    handlers.handleEditReceiveMessage = ({ message }) => {
      console.log("Received edit message:", message);
      // Optionally: Update the edited message in state
    };

    handlers.handleDeleteMsg = ({ message }) => {
      console.log("Received delete message:");
      console.log("Received delete message:", message);
    };

    handlers.handleMsgSeen = ({ message }) => {
      console.log("Received messages seen:", message);
    };

    handlers.handleReactOnMsg = ({ message }) => {
      console.log("Received message reaction:", message);
    };

    handlers.handleTypingStatus = ({ isTyping }) => {
      console.log("Typing status:", isTyping);
    };

    handlers.handleHighlightMsg = ({ message }) => {
      console.log("Received highlight message:", message);
    };

    handlers.handleImageMsg = ({ image }) => {
      console.log("Received image message:", image);
    };

    subscribe("receive_message", handlers.handleReceiveMessage);
    subscribe("edit_message", handlers.handleEditReceiveMessage);
    subscribe("delete_message", handlers.handleDeleteMsg);
    subscribe("messages_seen", handlers.handleMsgSeen);
    subscribe("message_reacted", handlers.handleReactOnMsg);
    subscribe("highlight_message", handlers.handleHighlightMsg);
    subscribe("image_message", handlers.handleImageMsg);

    return () => {
      unsubscribe("receive_message", handlers.handleReceiveMessage);
      unsubscribe("edit_message", handlers.handleEditReceiveMessage);
      unsubscribe("delete_message", handlers.handleDeleteMsg);
      unsubscribe("messages_seen", handlers.handleMsgSeen);
      unsubscribe("message_reacted", handlers.handleReactOnMsg);
      unsubscribe("highlight_message", handlers.handleHighlightMsg);
      unsubscribe("image_message", handlers.handleImageMsg);
    };
  }, []);

  return (
    <div className="flex flex-col h-[100vh]">

      {loading.fetchProfile ? "Loading..." :
        <div className="sticky top-0 z-20 w-full bg-white dark:bg-neutral-900 shadow-sm px-2 py-1 border-b">
          <UserChat
            profilePhoto={friendProfile.profilePhoto}
            username={friendProfile.username}
          />
        </div>
      }

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

      {image && (
        <div className="px-4 pb-3">
          <div className="relative max-w-xl mx-auto overflow-hidden rounded-2xl shadow-xl border bg-white dark:bg-neutral-900">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full max-h-80 object-contain bg-neutral-100 dark:bg-neutral-800"
                />
              </DialogTrigger>
              <DialogContent>
                <ImagePreview imageUrl={URL.createObjectURL(image)} />
              </DialogContent>
            </Dialog>

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

      {!image && (
        <div className="p-4 border-t bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
          <div className="max-w-xl mx-auto flex gap-2 items-center">

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