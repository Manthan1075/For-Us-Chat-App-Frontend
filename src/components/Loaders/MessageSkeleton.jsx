import React from 'react'

function MessageSkeleton({ amount = 7 }) {
    return (
        <>
            {[...Array(amount)].map((_, i) => {
                const isSender = i % 2 === 0;
                return (
                    <div
                        key={i}
                        className={`flex w-full items-start gap-2 animate-pulse ${isSender ? "justify-end sm:pr-8" : "justify-start sm:pl-8"}`}
                    >
                        {!isSender && (
                            <div className="rounded-full bg-slate-200 dark:bg-neutral-800 w-8 h-8 shrink-0" />
                        )}
                        <div className={`space-y-2 max-w-[78vw] sm:max-w-xs ${isSender ? "bg-blue-200 dark:bg-blue-900 ml-auto rounded-xl rounded-br-none sm:rounded-tr-none px-3 py-2" : "bg-slate-200 dark:bg-neutral-800 mr-auto rounded-xl rounded-bl-none sm:rounded-tl-none px-3 py-2"}`}>
                            <div className="h-3 w-24 rounded bg-slate-300 dark:bg-neutral-700" />
                            <div className="h-3 w-40 rounded bg-slate-300 dark:bg-neutral-700" />
                        </div>
                        {isSender && (
                            <div className="hidden sm:block rounded-full bg-blue-200 dark:bg-blue-900 w-8 h-8 shrink-0" />
                        )}
                    </div>
                );
            })}
        </>
    )
}

export default MessageSkeleton
