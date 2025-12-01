import React from "react";
import { Check, CheckCheck, CornerUpLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import ImagePreview from "./ImagePreview";

function Message({ message, isSender, repliedOfText }) {
    const { text, createdAt, isSeen, isDeleted, image, repliedOf, edits, isHighlighted, reaction } = message;

    const formattedTime = new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const isEdited = edits && edits.length > 0;


    return (
        <div
            className={`
                relative w-full max-w-fit px-4 py-2 rounded-2xl shadow-sm cursor-pointer
                ${isSender
                    ? "bg-gradient-to-br from-violet-500 via-violet-600 to-violet-700 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border border-neutral-200 dark:border-neutral-700"
                }
                ${isHighlighted
                    ? "border-4 border-yellow-400 ring-2 ring-yellow-300 bg-yellow-100 dark:bg-yellow-900/40"
                    : ""
                }
            `}
        >
            {/* Reply Preview */}
            {repliedOf && (
                <div
                    className={`
                        mb-2 p-2 rounded-xl border-l-4 text-xs
                        max-w-[75vw] md:max-w-[420px] 
                        overflow-hidden
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
                    <p className="opacity-80 break-words whitespace-pre-line">
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

            {/* Reaction display */}
            {reaction && (
                <div
                    className={`
            absolute -bottom-3 
            ${isSender ? "right-3" : "left-3"}
            bg-white dark:bg-neutral-900
            shadow-md border border-neutral-300 dark:border-neutral-700
            rounded-full px-1.5 py-0.5
            flex items-center justify-center
            text-xl 
            select-none
            z-20
        `}
                    style={{ transform: "translateY(50%)" }}
                >
                    {reaction}
                </div>
            )}


            <div
                className={`flex items-center justify-end gap-1 mt-1 text-[10px] 
                    ${isSender ? "text-white/80" : "text-gray-500 dark:text-gray-400"}
                `}
            >
                {isEdited && <span>(edited)</span>}
                <span>{formattedTime}</span>

                {isSender && !isDeleted && (
                    <span className="flex items-center gap-0.5">
                        {isSeen ? (
                            <>
                                <CheckCheck size={14} className="text-primary" />
                                <span className="ml-0.5 text-white font-medium">Seen</span>
                            </>
                        ) : (
                            <>
                                <Check size={14} className="text-gray-400 dark:text-gray-500" />
                                <span className="ml-0.5 text-gray-400">Sent</span>
                            </>
                        )}
                    </span>
                )}
            </div>
        </div>
    );
}

export default Message;
