import React, { useEffect, useState, useRef } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Image, Send, Smile, X, Highlighter, Pen, Reply, Trash, RotateCw, Brush, Plus } from "lucide-react";
import Message from "../components/Message.jsx";
import { getMessages, sendImage, sendMessage, editMessage, deleteMessage, reactOnMessage, toggleHighlightMsg } from "../services/messageServices.js";
import { useUser } from "../context/UserContext.jsx";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { getSocket, subscribe, unsubscribe } from '../socket/socket.js'
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog.js";
import { toast } from "react-toastify";
import Spinner from "../components/Loaders/Spinner.jsx";
import MessageSkeleton from "../components/Loaders/MessageSkeleton.jsx";
import Canvas from "../components/Canvas/Canvas.jsx";
import { Menubar, MenubarTrigger, MenubarItem, MenubarMenu, MenubarContent } from '../components/ui/menubar'

function ChatPage() {
  const { user } = useUser();
  const { friendId } = useParams();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const [repliedOf, setRepliedOf] = useState(null);
  const [pages, setPages] = useState({
    current: 1,
    max: null,
  })
  const [isTyping, setIsTyping] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [openReactionPopover, setOpenReactionPopover] = useState(null);
  const [CanvasOpen, setCanvasOpen] = useState(false);
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [emojiPickerSize, setEmojiPickerSize] = useState({
    width: window.innerWidth < 640 ? Math.min(320, window.innerWidth - 16) : 300,
    height: window.innerWidth < 640 ? 320 : 350
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, image, inputMessageData.repliedOf]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setEmojiPickerSize({
        width: mobile ? Math.min(320, window.innerWidth - 16) : 300,
        height: mobile ? 320 : 350
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(prev => ({ ...prev, fetchMessages: true }));

      const response = await getMessages({
        senderId: friendId,
        page: pages.current,
        limit: 30,
        userId: user?._id,
      });

      if (!response.success) {
        toast.error("Failed To Get Messages Please Try Again");
        return;
      }

      setMessages(prevMessages => {
        const existingIds = new Set(prevMessages.map(msg => msg?._id));
        const batch = response.data.slice().reverse();
        const filtered = batch.filter(msg => !existingIds.has(msg._id));

        if (pages.current > 1) {
          return [...filtered, ...prevMessages];
        }
        return [...prevMessages, ...filtered];
      });

      setPages(prev => ({
        ...prev,
        max: response.pagination.totalPages
      }));

    } catch (error) {
      console.log("ERROR GETTING MESSAGES :", error);
    } finally {
      setLoading(prev => ({ ...prev, fetchMessages: false }));
    }
  };

  const loadMoreMessage = () => {
    if (pages.current < pages.max && !loading.fetchMessages) {
      setPages(prev => ({ ...prev, current: prev.current + 1 }));
      fetchMessages();
    }
  }

  const handleTypingMessage = (text) => {
    setInputMessageData(prev => ({ ...prev, text: text }));

    const socket = getSocket();
    if (!isTyping) {
      socket.emit("typing", {
        receiver: friendId,
        isTyping: true,
      });
    }

    let typingTimeout;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("typing", {
        receiver: friendId,
        isTyping: false,
      });
    }, 1000);
  }

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
      if (response.success) {

        const socket = getSocket();
        socket.emit("send_message", {
          message: response.data,
          receiver: friendId,
        });

        setMessages(prev => [...prev, response.data]);
        setInputMessageData({ text: "", repliedOf: null });
        setRepliedOf(null);
      }
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

      if (response.success) {
        const socket = getSocket();
        socket.emit("image_message", {
          message: response.data,
          receiver: friendId,
        });
        setMessages(prev => [...prev, response.data]);
        setImage(null);
      } else {
        toast.error(response.message || "Failed To Send Image.")
      }
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
      });

      if (response.success) {
        setMessages(prev =>
          prev.map(msg =>
            msg._id === editMsg._id
              ? { ...msg, ...response.data }
              : msg
          )
        );
        const socket = getSocket();
        socket.emit("edit_message", {
          message: response.data,
          receiver: friendId,
        });
        toast.success(response.message || "Message Edited");
      } else {
        toast.error(response.message || "Failed To Edit Message");
      }
      setEditMsg({ _id: null, text: "" });
    } catch (error) {
      toast.error("Failed To Edit Message");
      console.log("Error While Edit Message :", error);
    }
  }

  const handleDeleteMsg = async (messageId) => {
    await toast.promise(
      deleteMessage({
        messageId: messageId,
        userId: user._id
      }).then(response => {
        if (response.success) {
          setMessages(prev => prev.filter(msg => msg._id !== messageId));
          const socket = getSocket();
          socket.emit("image_message", {
            message: response.data,
            receiver: friendId,
          });
        } else {
          throw new Error(response.message || "Failed To Delete");
        }
      }),
      {
        pending: "Deleting...",
        success: (response) => response?.message || "Message Deleted",
        error: (err) => err.message || "Failed To Delete"
      }
    );
  }

  const handleReplyOf = (msg) => {
    setInputMessageData(prev => ({ ...prev, repliedOf: msg._id }));
    setRepliedOf(msg.text)
  }

  const handleReaction = async (messageId, emoji) => {
    setOpenReactionPopover(null);

    const response = await toast.promise(
      reactOnMessage({
        senderId: friendId,
        messageId: messageId,
        reaction: emoji,
        userId: user._id
      }),
      {
        pending: "Reacting...",
        success: "Reaction added!",
        error: "Failed to react on message"
      }
    );

    setMessages(prev =>
      prev.map(msg =>
        msg._id === messageId
          ? { ...msg, reaction: emoji }
          : msg
      )
    );

    const socket = getSocket();
    socket.emit("message_reacted", {
      message: response.data,
      receiver: friendId,
    });
  };

  const handleHighlightMsg = async (msgId) => {
    const response = await toast.promise(
      toggleHighlightMsg({
        messageId: msgId,
        userId: user._id
      }),
      {
        pending: "Highlighting...",
        success: "Message highlight toggled!",
        error: "Error while highlighting message"
      }
    );

    if (response?.success && response.data) {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === msgId
            ? { ...msg, isHighlighted: response.data.isHighlighted }
            : msg
        )
      );
      const socket = getSocket();
      socket.emit("highlight_message", {
        message: response.data,
        receiver: friendId
      });
    }
  };


  useEffect(() => {
    setMessages([]);
    fetchMessages();
  }, [friendId]);

  useEffect(() => {
    const handlers = {};


    handlers.handleReceiveMessage = ({ message }) => {
      setMessages(prev => {
        if (prev.find(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (message.sender === friendId) {
        const socket = getSocket();
        socket.emit("seen_message", {
          message,
          receiver: friendId,
        });
      }
    };

    handlers.handleEditReceiveMessage = (data) => {
      setMessages(prev => prev.map(msg =>
        msg._id === data.message._id ? { ...msg, ...data.message } : msg
      ));
    };

    handlers.handleDeleteMsg = (data) => {
      console.log("Received delete message:", data);
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.message._id ? { ...msg, isDeleted: true } : msg
        )
      );
    };

    handlers.handleMsgSeen = ({ message }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === message._id
            ? { ...msg, isSeen: true }
            : msg
        )
      );
    };

    handlers.handleMsgDelivered = ({ message }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === message._id
            ? { ...msg, isDelivered: true }
            : msg
        )
      );
    }

    handlers.handleReactOnMsg = ({ message }) => {
      setMessages(prev => prev.map(msg =>
        msg._id === message._id ? { ...msg, reaction: message.reaction } : msg
      ));
    };

    handlers.handleDrawingStatus = (data) => {
      setIsDrawing(data.drawing || false)
    };

    handlers.handleTypingStatus = (data) => {
      setIsTyping(data.isTyping || false)
    };

    handlers.handleHighlightMsg = ({ message }) => {
      setMessages(prev => prev.map(msg =>
        msg._id === message._id ? { ...msg, isHighlighted: message.isHighlighted } : msg
      ));
    };

    handlers.handleImageMsg = (data) => {
      console.log("Image MEssage Received :", data);

      setMessages(prev => [...prev, data.message]);
    };

    subscribe("receive_message", handlers.handleReceiveMessage);
    subscribe("edit_message", handlers.handleEditReceiveMessage);
    subscribe("delete_message", handlers.handleDeleteMsg);
    subscribe("seen_message", handlers.handleMsgSeen);
    subscribe("message_reacted", handlers.handleReactOnMsg);
    subscribe("highlight_message", handlers.handleHighlightMsg);
    subscribe("image_message", handlers.handleImageMsg);
    subscribe("typing", handlers.handleTypingStatus);
    subscribe("delivered_message", handlers.handleMsgDelivered);
    subscribe("drawing", handlers.handleDrawingStatus);

    return () => {
      unsubscribe("receive_message", handlers.handleReceiveMessage);
      unsubscribe("edit_message", handlers.handleEditReceiveMessage);
      unsubscribe("delete_message", handlers.handleDeleteMsg);
      unsubscribe("seen_message", handlers.handleMsgSeen);
      unsubscribe("message_reacted", handlers.handleReactOnMsg);
      unsubscribe("highlight_message", handlers.handleHighlightMsg);
      unsubscribe("image_message", handlers.handleImageMsg);
      unsubscribe("typing", handlers.handleTypingStatus);
      unsubscribe("drawing", handlers.handleDrawingStatus);
    };
  }, []);

  return (
    <div className="flex flex-col h-dvh bg-white dark:bg-black relative">

      <Button
        variant="outline"
        className="fixed top-20 right-4 z-20 p-2 rounded-full h-9 w-9 flex items-center justify-center shadow-md bg-white/80 dark:bg-black/80 backdrop-blur"
        onClick={fetchMessages}
        aria-label="Refresh messages"
        title="Refresh messages"
      >
        <RotateCw size={18} />
      </Button>

      <div
        className="flex-1 overflow-y-auto px-2 py-4 space-y-4 scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex justify-center items-center w-full z-10 pointer-events-none">
          <div className="pointer-events-auto bg-gradient-to-b from-white/80 dark:from-black/80 via-white dark:via-black p-2 rounded-b-xl sticky top-0 z-20 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-5 text-sm font-medium shadow border border-blue-300 dark:border-blue-900 hover:bg-blue-100/80 dark:hover:bg-blue-900/40 transition"
              disabled={loading.fetchMessages || pages.current >= pages.max}
              onClick={() => loadMoreMessage()}
            >
              {loading.fetchMessages ? "Loading..." : pages.current >= pages.max ? "No more messages" : "Load More messages"}
            </Button>
          </div>
        </div>

        {loading.fetchMessages ? (
          <div className="space-y-3">
            <MessageSkeleton amount={10} />
          </div>
        ) : messages.length > 0 ? (
          messages.filter(Boolean).map((msg) => {
            const isSender = msg?.sender === user._id;

            if (msg.isDeleted) {
              return (
                <div key={msg._id} className={`flex w-full my-2 ${isSender ? "justify-end" : "justify-start"}`}>
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
                        msg.repliedOf
                          ? (messages.find(m => m && m._id === msg.repliedOf)?.text || null)
                          : null
                      }
                    />
                  </div>
                </PopoverTrigger>


                <PopoverContent className="w-40 p-1 rounded-lg shadow-lg">
                  {/* Popover content logic same as before... */}
                  <div className="flex flex-col gap-1.5 py-2 px-1 rounded-xl bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md shadow-lg ring-1 ring-indigo-200/60 dark:ring-indigo-600/20 transition-all">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 pb-2">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Unknown"}
                    </div>
                    {isSender ? (
                      <>
                        {msg.image ? (
                          <Button variant="ghost" className="justify-start flex items-center gap-2 h-9 px-3 text-sm text-rose-700 dark:text-rose-400 font-semibold hover:bg-rose-100/70 dark:hover:bg-rose-900/60 rounded-lg transition group" onClick={() => handleDeleteMsg(msg._id)} disabled={loading.deleteMessage}>
                            <Trash size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" /> <span>Delete</span>
                          </Button>
                        ) : (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" className="justify-start flex items-center gap-2 h-9 px-3 text-sm text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 rounded-lg transition group">
                                  <Pen size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" /> {loading.editMessage ? "Editing..." : <span>Edit</span>}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="flex flex-col gap-4 p-6 rounded-lg bg-white dark:bg-neutral-900 shadow-xl">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor={`edit-msg-${msg.id}`}>Edit message</label>
                                <Input id={`edit-msg-${msg.id}`} value={editMsg.text || msg.text} onChange={(e) => setEditMsg({ _id: msg._id, text: e.target.value })} placeholder={msg.text || "Type New Message..."} className="mb-2 w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                <Button className="w-full font-semibold py-2 rounded-lg transition" disabled={loading.editMessage} onClick={handleEditMsg}>{loading.editMessage ? <Spinner /> : "Save Changes"}</Button>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" className="justify-start flex items-center gap-2 h-9 px-3 text-sm text-rose-700 dark:text-rose-400 font-semibold hover:bg-rose-100/70 dark:hover:bg-rose-900/60 rounded-lg transition group" onClick={() => handleDeleteMsg(msg._id)} disabled={loading.deleteMessage}>
                              <Trash size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" /> {loading.deleteMessage ? "Deleting..." : <span>Delete</span>}
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" className="justify-start flex items-center gap-2 h-9 px-3 text-sm text-yellow-700 dark:text-yellow-400 font-semibold hover:bg-yellow-100/70 dark:hover:bg-yellow-900/60 rounded-lg transition group" onClick={() => handleHighlightMsg(msg._id)}>
                          <Highlighter size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" /> <span>Highlight</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" className="justify-start flex items-center gap-2 h-9 px-3 text-sm text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100/70 dark:hover:bg-blue-900/60 rounded-lg transition group" onClick={() => handleReplyOf(msg)}>
                          <Reply size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" /> <span>Reply</span>
                        </Button>
                        <Popover open={openReactionPopover === msg._id} onOpenChange={(open) => setOpenReactionPopover(open ? msg._id : null)}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="justify-start flex items-center gap-2 h-9 px-3 text-sm text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-100/70 dark:hover:bg-purple-900/60 rounded-lg transition group" onClick={(e) => e.stopPropagation()}>
                              <Smile size={16} className="stroke-current opacity-80 group-hover:scale-110 transition" /> <span>React</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none z-[100] sm:z-50 max-h-[calc(100vh-8rem)] overflow-hidden" align={isMobile ? "center" : "start"} side={isMobile ? "bottom" : "left"} sideOffset={isMobile ? 12 : 4} alignOffset={isMobile ? 0 : 0} collisionPadding={isMobile ? 8 : 4} onClick={(e) => e.stopPropagation()}>
                            <EmojiPicker
                              onEmojiClick={(emojiObj) => handleReaction(msg._id, emojiObj.emoji)}
                              previewConfig={{ showPreview: false }}
                              theme="auto" width={emojiPickerSize.width}
                              height={emojiPickerSize.height}
                              reactionsDefaultOpen={true}
                            />
                          </PopoverContent>
                        </Popover>
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
        )}
        {/* Animated Typing/Drawing Status */}
        <div className="relative min-h-[28px]">
          {(isTyping || isDrawing) && (
            <div
              className={`
                flex items-center px-5 gap-2
                transition-all duration-300
                ${isTyping || isDrawing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
                animate-in fade-in slide-in-from-bottom-2
                absolute left-0 w-full
              `}
              style={{ pointerEvents: "none" }}
            >
              {isTyping && (
                <div className="flex items-center mr-2">
                  <span className="animate-bounce w-2 h-2 bg-blue-500 rounded-full mr-1" />
                  <span className="animate-bounce w-2 h-2 bg-blue-500 rounded-full mr-1" style={{ animationDelay: "0.2s" }} />
                  <span className="animate-bounce w-2 h-2 bg-blue-500 rounded-full" style={{ animationDelay: "0.4s" }} />
                  <span className="ml-2 text-xs text-blue-600 dark:text-blue-300 font-medium">Typing...</span>
                </div>
              )}
              {isDrawing && (
                <div className="flex items-center">
                  <span className="animate-spin w-2.5 h-2.5 mr-2 rounded-full border-2 border-pink-500 border-t-transparent" />
                  <span className="text-xs text-pink-600 dark:text-pink-300 font-medium">Drawing...</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT AREA: Fixed at bottom of Flex Column (Shrink-0 prevents crushing) */}
      <div className="shrink-0 z-20 bg-white/90 border-t-2 dark:bg-black/90 backdrop-blur-lg  border-neutral-200 dark:border-neutral-800">

        {/* 1. Reply Preview Banner */}
        {inputMessageData.repliedOf && (
          <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-b dark:border-neutral-800 text-xs sm:text-sm animate-in slide-in-from-bottom-2 fade-in">
            <div className="flex flex-col border-l-2 border-blue-500 pl-2">
              <span className="text-blue-500 font-semibold">Replying to</span>
              <span className="truncate max-w-[200px] sm:max-w-md opacity-70">
                {repliedOf || "Media"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full"
              onClick={() => {
                setInputMessageData({ ...inputMessageData, repliedOf: null });
                setRepliedOf(null);
              }}
            >
              <X size={14} />
            </Button>
          </div>
        )}



        {/* 2. Image Upload Preview Mode */}
        {image ? (
          <div className="p-4 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-5">
            <div className="relative w-full max-w-sm aspect-video bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-hidden border shadow-sm group">
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-contain" />
              <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md" onClick={() => setImage(null)}>
                <X size={16} />
              </Button>
            </div>
            <Button onClick={handleSendImage} disabled={loading.sendImage} className="w-full max-w-sm rounded-full">
              {loading.sendImage ? "Sending..." : "Send Image"} <Send className="ml-2 w-4 h-4" />
            </Button>
          </div>
        ) : (
          /* 3. Standard Text Input Mode */
          <div className="p-2 sm:p-3 max-w-4xl mx-auto w-full">
            <div className="flex items-end gap-2">
              {/* Emoji Picker */}

              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger className="
      h-10 w-10 flex items-center justify-center
      rounded-full 
      bg-blue-600 text-white
      hover:bg-blue-700
      shadow-md hover:shadow-lg
      transition-all duration-200
    ">
                    <Plus size={18} />
                  </MenubarTrigger>

                  <MenubarContent
                    className="
        mt-3
        min-w-[180px]
        p-2
        rounded-2xl
        bg-white dark:bg-neutral-900
        backdrop-blur-md
        shadow-xl
        border border-neutral-200 dark:border-neutral-800
        animate-in fade-in zoom-in
      "
                  >

                    {/* DRAW OPTION */}
                    <MenubarItem
                      onClick={() => setCanvasOpen(prev => !prev)}
                      className="
          group
          flex items-center gap-3
          px-4 py-3
          rounded-xl
          cursor-pointer
          hover:bg-blue-50 dark:hover:bg-blue-900
          transition-all
        "
                    >
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800">
                        <Brush size={18} className="text-blue-600 dark:text-blue-300" />
                      </div>

                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        Draw
                      </span>
                    </MenubarItem>

                    {/* IMAGE UPLOAD */}
                    <MenubarItem
                      className="px-0 py-0 mt-1"
                      onSelect={(e) => {
                        e.preventDefault();
                        // Use setTimeout to ensure the menu closes before opening file dialog
                        setTimeout(() => {
                          fileInputRef.current?.click();
                        }, 0);
                      }}
                    >
                      <div
                        className="
            group
            flex items-center gap-3
            px-4 py-3
            rounded-xl
            cursor-pointer
            hover:bg-purple-50 dark:hover:bg-purple-900
            transition-all
            w-full
          "
                      >
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800">
                          <Image size={18} className="text-purple-600 dark:text-purple-300" />
                        </div>

                        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                          Image
                        </span>
                      </div>
                    </MenubarItem>

                  </MenubarContent>
                </MenubarMenu>
              </Menubar>

              {/* Hidden file input for image upload */}
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                  }
                  // Reset input value to allow selecting the same file again
                  e.target.value = '';
                }}
              />

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 text-neutral-500 hover:text-blue-500 h-10 w-10 rounded-full">
                    <Smile size={24} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 border-none bg-transparent shadow-none" align="start" side="top">
                  <EmojiPicker onEmojiClick={(emoji) => setInputMessageData(prev => ({ ...prev, text: prev.text + emoji.emoji }))} searchDisabled previewConfig={{ showPreview: false }} theme="auto" width={300} height={350} />
                </PopoverContent>
              </Popover>

              {/* Image Attachment Trigger */}


              {/* Text Input */}
              <form onSubmit={handleSendMsg} className="flex-1 flex gap-2 items-end">
                <Input
                  placeholder="Message..."
                  className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 border-transparent focus:border-blue-500/50 py-3 min-h-[44px] max-h-32 resize-none"
                  value={inputMessageData.text}
                  onChange={(e) => handleTypingMessage(e.target.value)}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputMessageData.text.trim() || loading.sendMessage}
                  className={`rounded-full shrink-0 h-10 w-10 transition-all ${inputMessageData.text.trim() ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"}`}
                >
                  {
                    loading.sendMessage ? <Spinner size={18} /> :
                      <Send size={18} className={inputMessageData.text.trim() ? "ml-0.5" : ""} />
                  }
                </Button>


              </form>
            </div>
          </div>
        )}
        {
          CanvasOpen && <Canvas showCanvas={setCanvasOpen} setMessage={setMessages} />
        }
      </div>
    </div>
  );
}

export default ChatPage;