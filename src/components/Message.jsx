import React from 'react'
import { Skeleton } from './ui/skeleton'

function Message({ message }) {
    const { text, createdAt, isHighlighted, isSeen, isDeleted, reaction, edits, image, repliedOf } = message || {};
    return (
        <div>
            <Skeleton className='h-6 w-32 mb-2' />
        </div>
    )
}

export default Message
