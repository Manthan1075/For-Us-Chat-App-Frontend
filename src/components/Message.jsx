import React from "react";
import { Check, CheckCheck, CornerUpLeft, Pen, Reply, Smile, Trash, Highlighter } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import ImagePreview from "./ImagePreview";

function Message({ message, isSender, repliedOfText }) {
    const { text, createdAt, isSeen, isDeleted, image, repliedOf, edits, isHighlighted, } = message;

    const formattedTime = new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const isEdited = edits && edits.length > 0;

    return (
        <div
            className={`flex w-full ${isSender ? "justify-end" : "justify-start"} px-1 ${isHighlighted
                ? "bg-yellow-100 dark:bg-yellow-900/40 ring-2 ring-yellow-400 dark:ring-yellow-500 shadow-[0_2px_12px_0_rgba(255,200,40,0.13)] transition"
                : ""
                }`}
            style={isHighlighted ? { boxShadow: "0 2px 22px 0 rgba(255, 200, 40, 0.16)" } : {}}
        >

            <div
                className={`
                            relative w-full max-w-fit px-4 py-2 rounded-2xl shadow-sm cursor-pointer
                            ${isSender
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }
                        `}
            >
                {/* Reply Preview */}
                {repliedOf && (
                    <div
                        className={`
                                    mb-2 p-2 rounded-xl border-l-4 text-xs
                                    ${isSender
                                ? "border-white/50 bg-primary/40"
                                : "border-primary bg-neutral-100 dark:bg-neutral-700"
                            }
                                `}
                    >
                        <div className="flex items-center gap-1 mb-1 opacity-70">
                            <CornerUpLeft size={12} />
                            <span className="font-semibold">Replying to</span>
                        </div>
                        <p className="opacity-80 truncate">
                            {repliedOfText || "Image"}
                        </p>
                    </div>
                )}

                {/* Image message */}
                {image && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <img
                                src={image}
                                className="rounded-xl mb-2 max-h-60 object-cover shadow-md"
                                alt="message-img"
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <ImagePreview imageUrl={image} />
                        </DialogContent>
                    </Dialog>
                )}

                <p className={`${isDeleted ? "italic opacity-60" : ""}`}>
                    {text}
                </p>

                <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] 
                                ${isSender ? "text-white/80" : "text-gray-500 dark:text-gray-400"}
                            `}
                >
                    {isEdited && <span>(edited)</span>}
                    <span>{formattedTime}</span>

                    {isSender && !isDeleted && (
                        isSeen ? <CheckCheck size={14} /> : <Check size={14} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Message;
