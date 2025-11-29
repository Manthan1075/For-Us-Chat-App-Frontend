import React, { useEffect, useState, useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Image, Send, Smile, X, Highlighter, Pen, Reply, Trash, EllipsisVertical, Rotate3D, RotateCw } from "lucide-react";
import Message from "../components/Message.jsx";
import { getMessages, sendImage, sendMessage, editMessage, deleteMessage, reactOnMessage, toggleHighlightMsg } from "../services/messageServices.js";
import { useUser } from "../context/UserContext.jsx";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { subscribe, unsubscribe } from '../socket/socket.js'
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog.js";
import { toast } from "react-toastify";


function ChatPage() {
  const { user } = useUser();
  const { friendId } = useParams();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const [repliedOf, setRepliedOf] = useState(null);
  const [pages, setPages] = useState({
    current: 1,
    max: null,
  })
  const [reaction, setReaction] = useState({
    reaction: "",
    messageId: ""
  });
  const [editMsg, setEditMsg] = useState({
    _id: null,
    text: "",
  });
  const [loading, setLoading] = useState({
    fetchMessages: false,
    sendMessage: false,
    sendImage: false,
    deleteMessage: false,
    editMessage: false,
  })
  const [inputMessageData, setInputMessageData] = useState({
    text: "",
    repliedOf: null,
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, image, inputMessageData.repliedOf]);



  const fetchMessages = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetchMessages: true }));
      const response = await getMessages({
        senderId: friendId,
        page: pages.current,
        limit: 25,
        userId: user?._id,
      });

      if (response.success) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(msg => msg._id));
          const newMessages = response.data
            .reverse()
            .filter(msg => !existingIds.has(msg._id));
          return [...newMessages, ...prev];
        });
        setPages(prev => ({ ...prev, max: response.pagination.totalPages }));
      } else {
        toast.error("Failed To Get Messages Please Try Again");
      }
    } catch (error) {
      console.log("ERROR GETTING MESSAGES :", error);
    } finally {
      setLoading((prev) => ({ ...prev, fetchMessages: false }));
    }
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();
    if (!inputMessageData.text.trim()) return;

    try {
      setLoading(prev => ({ ...prev, sendMessage: true }))
      const response = await sendMessage({
        text: inputMessageData.text,
        receiver: friendId,
        repliedOf: inputMessageData.repliedOf || "",
        userid: user._id,
      });

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
      setMessages(prev => [...prev, response]);
      setImage(null);
    } catch (error) {
      console.log("ERROR SENDING IMAGE :", error);
    } finally {
      setLoading(prev => ({ ...prev, sendImage: false }))
    }
  };

  const handleEditMsg = async () => {
    try {
      const response = await editMessage({
        messageId: editMsg._id,
        text: editMsg.text,
        userId: user._id
      })
      if (response.success) {
        setMessages(prev => prev.map(msg =>
          msg._id === editMsg._id
            ? { ...msg, text: editMsg.text, isEdited: true }
            : msg
        ));
        toast.success(response.message || "Message Edited")
      } else {
        toast.error(response.message || "Failed To Edit Message")
      }
      setEditMsg({ _id: null, text: "" });
    } catch (error) {
      toast.error(response.message || "Failed To Edit Message")
      console.log("Error While Edit Message :", error);
    }
  }

  const handleDeleteMsg = async (messageId) => {
    try {
      const response = await deleteMessage({
        messageId: messageId,
        userId: user._id
      })
      if (response.success) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      } else { toast.error(response.message || "Failed To Delete") }

    } catch (error) {
      console.log("Error While Delete Message :", error);
      toast.error(error.message || "Failed To Delete")
    }
  }

  const handleReplyOf = (msg) => {
    setInputMessageData(prev => ({ ...prev, repliedOf: msg._id }));
    setRepliedOf(msg.text)
  }

  const handleReaction = async () => {
    try {
      const response = await reactOnMessage({
        senderId: friendId,
        messageId: reaction.messageId,
        reaction: reaction.reaction,
        userId: user._id
      })
      console.log("React On Message : ", response);
    } catch (error) {
      console.log("Error While React On Message :", error);

    }
  }

  const handleHighlightMsg = async (msgId) => {
    try {
      const response = await toggleHighlightMsg({
        messageId: msgId,
        userId: user._id
      })
      console.log("High Light Res :", response);

    } catch (error) {
      console.log("Error While Highlight Message :", error);

    }
  }

  useEffect(() => {
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
    <div className="flex flex-col h-dvh bg-white dark:bg-black pt-1.5">
      <Button
        variant="outline"
        className="fixed top-20 right-4 z-30 p-2 rounded-full h-9 w-9 flex items-center justify-center"
        onClick={fetchMessages}
        aria-label="Refresh messages"
        title="Refresh messages"
      >
        <RotateCw />
      </Button>
      <div
        className="flex-1 overflow-y-auto px-2 py-4 space-y-4  scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex justify-center pt-2 pb-4 sticky top-0 z-10 bg-gradient-to-b from-white/80 dark:from-black/80 via-white dark:via-black">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-5 text-sm font-medium shadow border border-blue-300 dark:border-blue-900 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 transition"
            disabled={loading.fetchMessages || pages.current >= pages.max}
            onClick={() => {
              if (pages.current < pages.max && !loading.fetchMessages) {
                setPages(prev => ({ ...prev, current: prev.current + 1 }));
                fetchMessages();
              }
            }}
          >
            {loading.fetchMessages ? "Loading..." : pages.current >= pages.max ? "No more messages" : "Load More messages"}
          </Button>
        </div>
        {
          loading.fetchMessages ? (
            <div className="space-y-3">
              {[...Array(7)].map((_, i) => {
                const isSender = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`flex w-full items-start gap-2 animate-pulse ${isSender
                      ? "justify-end sm:pr-8"
                      : "justify-start sm:pl-8"
                      }`}
                  >
                    {!isSender && (
                      <div className="rounded-full bg-slate-200 dark:bg-neutral-800 w-8 h-8 shrink-0" />
                    )}
                    <div
                      className={`space-y-2 max-w-[78vw] sm:max-w-xs ${isSender
                        ? "bg-blue-200 dark:bg-blue-900 ml-auto rounded-xl rounded-br-none sm:rounded-tr-none px-3 py-2"
                        : "bg-slate-200 dark:bg-neutral-800 mr-auto rounded-xl rounded-bl-none sm:rounded-tl-none px-3 py-2"
                        }`}
                    >
                      <div className="h-3 w-24 rounded bg-slate-300 dark:bg-neutral-700" />
                      <div className="h-3 w-40 rounded bg-slate-300 dark:bg-neutral-700" />
                    </div>
                    {isSender && (
                      <div className="hidden sm:block rounded-full bg-blue-200 dark:bg-blue-900 w-8 h-8 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          ) :
            messages.length > 0 ? (
              messages.map((msg) => {
                const isSender = msg.sender === user._id;

                if (msg.isDeleted) {
                  return (
                    <div key={msg._id} className={`flex w-full  my-2 ${isSender ? "justify-end" : "justify-start"}`}>
                      <div className="bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-4 py-2 rounded-xl text-sm italic opacity-90 flex items-center gap-2 shadow-sm">
                        <span>This message was deleted</span>
                      </div>
                    </div>)
                }

                return (
                  <Popover key={`${msg._id}-${msg.createdAt || ""}-${msg.updatedAt || ""}`}>
                    <PopoverTrigger asChild>
                      <div className={`w-fit ${isSender ? "ml-auto" : "mr-auto"}`}>
                        <Message
                          message={msg}
                          isSender={isSender}
                          repliedOfText={
                            messages.find(m => m._id === msg.repliedOf)?.text || null
                          }
                        />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent className="w-40 p-1 rounded-lg shadow-lg">
                      <div
                        className="
                          flex flex-col gap-1.5 py-2 px-1
                          rounded-xl
                          bg-white/60 dark:bg-neutral-900/60
                          backdrop-blur-md shadow-lg
                          ring-1 ring-indigo-200/60 dark:ring-indigo-600/20
                          transition-all
                        "
                        style={{
                          boxShadow:
                            "0 2px 18px 0 rgba(80,80,200,0.07), 0 2px 6px 0 rgba(0,0,0,.03)",
                        }}
                      >
                        {isSender ? (
                          <>
                            {msg.image ? (
                              <Button
                                variant="ghost"
                                className="
                                  justify-start flex items-center gap-2 h-9 px-3 text-sm
                                  text-rose-700 dark:text-rose-400 font-semibold
                                  hover:bg-rose-100/70 dark:hover:bg-rose-900/60
                                  rounded-lg transition group
                                "
                              >
                                <Trash size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" />
                                <span>Delete</span>
                              </Button>
                            ) : (
                              <>
                                <Dialog>
                                  <DialogTrigger>
                                    <Button
                                      variant="ghost"
                                      className="
                                    justify-start flex items-center gap-2 h-9 px-3 text-sm
                                    text-indigo-700 dark:text-indigo-300 font-semibold
                                    hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60
                                    rounded-lg transition group
                                    "
                                    >
                                      <Pen size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" />
                                      <span>Edit</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="flex flex-col gap-4 p-6 rounded-lg bg-white dark:bg-neutral-900 shadow-xl">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor={`edit-msg-${msg.id}`}>
                                      Edit message
                                    </label>
                                    <Input
                                      id={`edit-msg-${msg.id}`}
                                      value={editMsg.text}
                                      onChange={(e) => setEditMsg({ _id: msg._id, text: e.target.value })}
                                      className="mb-2 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-neutral-800"
                                    />
                                    <Button className="w-full font-semibold py-2 rounded-lg transition" onClick={handleEditMsg}>
                                      Save Changes
                                    </Button>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  className="
                                    justify-start flex items-center gap-2 h-9 px-3 text-sm
                                    text-rose-700 dark:text-rose-400 font-semibold
                                    hover:bg-rose-100/70 dark:hover:bg-rose-900/60
                                    rounded-lg transition group
                                  "
                                  onClick={() => handleDeleteMsg(msg._id)}
                                >
                                  <Trash size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" />
                                  <span>Delete</span>
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              className="
                                justify-start flex items-center gap-2 h-9 px-3 text-sm
                                text-yellow-700 dark:text-yellow-400 font-semibold
                                hover:bg-yellow-100/70 dark:hover:bg-yellow-900/60
                                rounded-lg transition group
                              "
                              onClick={() => handleHighlightMsg(msg._id)}
                            >
                              <Highlighter size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" />
                              <span>Highlight</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              className="
                                justify-start flex items-center gap-2 h-9 px-3 text-sm
                                text-blue-700 dark:text-blue-300 font-semibold
                                hover:bg-blue-100/70 dark:hover:bg-blue-900/60
                                rounded-lg transition group
                              "
                              onClick={() => handleReplyOf(msg)}
                            >
                              <Reply size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" />
                              <span>Reply</span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="
                                justify-start flex items-center gap-2 h-9 px-3 text-sm
                                text-purple-700 dark:text-purple-300 font-semibold
                                hover:bg-purple-100/70 dark:hover:bg-purple-900/60
                                rounded-lg transition group
                              "
                            >
                              <Smile size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" />
                              <span>React</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })
            ) : (
              <div className="flex h-full items-center justify-center opacity-50 text-sm">
                No messages yet. Say hi!
              </div>
            )
        }

        <div ref={bottomRef}></div >

        <div className="sticky bottom-0 z-20 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800">

          {/* 1. Reply Preview Banner */}
          {inputMessageData.repliedOf && (
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-b dark:border-neutral-800 text-xs sm:text-sm">
              <div className="flex flex-col border-l-2 border-blue-500 pl-2">
                <span className="text-blue-500 font-semibold">Replying to</span>
                <span className="truncate max-w-[200px] sm:max-w-md opacity-70">
                  {repliedOf || "Media"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setInputMessageData({ ...inputMessageData, repliedOf: null })}
              >
                <X size={14} />
              </Button>
            </div>
          )}

          {/* 2. Image Upload Preview Mode */}
          {image ? (
            <div className="p-4 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-5">
              <div className="relative w-full max-w-sm aspect-video bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-hidden border shadow-sm group">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
                  onClick={() => setImage(null)}
                >
                  <X size={16} />
                </Button>
              </div>
              <Button
                onClick={handleSendImage}
                disabled={loading.sendImage}
                className="w-full max-w-sm rounded-full"
              >
                {loading.sendImage ? "Sending..." : "Send Image"} <Send className="ml-2 w-4 h-4" />
              </Button>
            </div>
          ) : (
            /* 3. Standard Text Input Mode */
            <div className="p-2 sm:p-3 max-w-4xl mx-auto w-full">
              <div className="flex items-end gap-2">

                {/* Emoji Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 text-neutral-500 hover:text-blue-500">
                      <Smile size={24} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 border-none bg-transparent shadow-none" align="start" side="top">
                    <EmojiPicker
                      onEmojiClick={(emoji) =>
                        setInputMessageData(prev => ({ ...prev, text: prev.text + emoji.emoji }))
                      }
                      searchDisabled
                      previewConfig={{ showPreview: false }}
                      theme="auto"
                      width={300}
                      height={350}
                    />
                  </PopoverContent>
                </Popover>

                {/* Image Attachment Trigger */}
                <label className="cursor-pointer flex items-center justify-center h-10 w-10 shrink-0 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors">
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) setImage(e.target.files[0]);
                    }}
                  />
                  <Image size={24} />
                </label>

                {/* Text Input */}
                <form onSubmit={handleSendMsg} className="flex-1 flex gap-2 items-end">
                  <Input
                    placeholder="Message..."
                    className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 border-transparent focus:border-blue-500/50 py-5 resize-none"
                    value={inputMessageData.text}
                    onChange={(e) => setInputMessageData({ ...inputMessageData, text: e.target.value })}
                  />

                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputMessageData.text.trim() || loading.sendMessage}
                    className={`rounded-full shrink-0 transition-all ${inputMessageData.text.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
                      }`}
                  >
                    <Send size={18} className={inputMessageData.text.trim() ? "ml-0.5" : ""} />
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div >
    </div>
  );
}

export default ChatPage;