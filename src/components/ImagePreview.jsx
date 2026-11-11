import React from 'react'

function ImagePreview({ imageUrl }) {
    return (
        <div
            className="flex items-center justify-center w-full h-full p-1 "
        >
            <img
                src={imageUrl || ""}
                alt="Image Not Found"
                className='h-full w-full object-cover rounded-lg'
            />
        </div>
    )
}

export default ImagePreview
