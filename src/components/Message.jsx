import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Check, CheckCheck, CornerUpLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog.tsx";
import ImagePreview from "./ImagePreview.jsx";

function Message({ message, isSender }) {
    if (!message) {
        return (
            <div
                className={`flex w-full ${isSender ? "justify-end" : "justify-start"} mb-3`}
            >
                <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
        );
    }

    const { text, createdAt, isSeen, isDeleted, image, repliedOf, edits } = message;

    const formattedTime = new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const isEdited = edits && edits.length > 0;

    return (
        <div className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}>
            <div
                className={`
          max-w-[75%] px-4 py-2 rounded-2xl shadow-sm
          ${isSender
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }
        `}
            >

                {repliedOf && (
                    <div
                        className={`
              mb-2 p-2 rounded-xl border-l-4 
              ${isSender ? "border-white/60 bg-primary/40" : "border-primary bg-neutral-100 dark:bg-neutral-700"}
            `}
                    >
                        <div className="flex items-center gap-1 mb-1 opacity-70">
                            <CornerUpLeft size={12} />
                            <span className="text-xs font-semibold">Replying to</span>
                        </div>
                        <p className="text-xs opacity-80">
                            {repliedOf.text || "Image"}
                        </p>
                    </div>
                )}

                {image && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <img
                                src={image}
                                className="rounded-xl mb-2 max-h-64 object-cover shadow"
                                alt="msg"
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <ImagePreview imageUrl={image} />
                        </DialogContent>
                    </Dialog>
                )}

                {/* TEXT MESSAGE */}
                <p className={`leading-relaxed ${isDeleted && "italic opacity-60"}`}>
                    {isDeleted ? "This message was deleted" : text}
                </p>

                {/* TIME + STATUS */}
                <div
                    className={`
            flex items-center justify-end gap-1 mt-1 text-[10px]
            ${isSender ? "text-white/80" : "text-gray-500 dark:text-gray-400"}
          `}
                >
                    {isEdited && <span>(edited)</span>}
                    <span>{formattedTime}</span>

                    {isSender && !isDeleted && (
                        isSeen ? (
                            <CheckCheck size={14} />
                        ) : (
                            <Check size={14} />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default Message;
