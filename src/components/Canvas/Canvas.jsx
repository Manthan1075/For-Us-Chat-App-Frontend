import React, { useEffect, useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Button } from "../ui/button";
import { Eraser, Redo, Undo, Brush, X } from "lucide-react";
import { Input } from "../ui/input";
import { getSocket } from "../../socket/socket";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify'
import { sendDrawing } from "../../services/messageServices.js";
import { useUser } from "../../context/UserContext.jsx";

function Canvas({ showCanvas, setMessage }) {
    const canvasRef = useRef(null);
    const { friendId } = useParams();
    const [color, setColor] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState(4);
    const [eraseMode, setEraseMode] = useState(false);
    const { user } = useUser();


    const typingTimeout = useRef(null);

    const toggleEraser = () => {
        setEraseMode((prev) => !prev);
        canvasRef.current.eraseMode(!eraseMode);
    };

    const handleCanvasChange = () => {
        const socket = getSocket();
        if (!socket) return;

        clearTimeout(typingTimeout.current);

        socket.emit("drawing", {
            receiver: friendId,
            drawing: true,
        });

        typingTimeout.current = setTimeout(() => {
            if (getSocket()) {
                getSocket().emit("drawing", {
                    receiver: friendId,
                    drawing: false,
                });
            }
        }, 800);
    };

    const handleSendDrawing = async () => {
        try {
            const exportedImage = await canvasRef.current.exportImage("jpg");

            if (!exportedImage) {
                toast.error("Nothing to send. Draw something first!");
                return;
            }

            const response = await toast.promise(
                sendDrawing({
                    receiverId: friendId,
                    userId: user._id,
                    image: exportedImage
                }),
                {
                    pending: "Sending drawing...",
                    success: "Drawing sent!",
                    error: "Failed to send drawing."
                }
            );

            if (response && response.success) {
                const socket = getSocket();
                socket.emit("image_message", {
                    message: response.data,
                    receiver: friendId,
                });
                setMessage(prev => [...prev, response.data]);
                canvasRef.current.clearCanvas();
                showCanvas(false);
            } else {
                toast.error(response?.message || "Failed to send drawing.");
            }

        } catch (error) {
            toast.error("An error occurred while sending drawing.");
            console.error("Error sending drawing:", error);
        }
    }

    return (
        <div className="z-50 fixed bottom-0 left-0 w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center px-3 pt-3 pb-2">
                <span className="font-bold text-lg sm:text-base text-neutral-700 dark:text-neutral-200">Drawing Canvas</span>
                <Button
                    onClick={() => showCanvas(false)}
                    className={`
                        h-11 w-11 p-0 rounded-full shadow-md
                        bg-red-500 text-white hover:bg-red-600
                        flex items-center justify-center
                        transition-all duration-150
                        active:scale-95
                        sm:h-9 sm:w-9
                    `}
                    aria-label="Close canvas"
                >
                    <X size={28} />
                </Button>
            </div>
            {/* Toolbar */}
            <div className="flex items-center gap-6 p-4 bg-white/80 dark:bg-neutral-900 backdrop-blur-lg rounded-xl shadow-xl max-w-md mx-auto my-4 justify-center border border-gray-200 dark:border-neutral-800">

                {/* Color Picker */}
                <div className="flex flex-col items-center gap-1">
                    <label className="text-xs font-semibold mb-1">Color</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-9 w-12 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-blue-400 transition p-0 bg-transparent"
                        style={{
                            boxShadow: "0 2px 8px rgba(36,36,36,0.07)",
                        }}
                    />
                </div>

                {/* Tools */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={eraseMode ? "default" : "ghost"}
                        onClick={toggleEraser}
                        className={`rounded-full transition ${eraseMode ? "bg-red-500 text-white" : ""
                            }`}
                    >
                        <Eraser size={20} />
                    </Button>

                    <Button variant="ghost" onClick={() => canvasRef.current.undo()}>
                        <Undo size={20} />
                    </Button>

                    <Button variant="ghost" onClick={() => canvasRef.current.redo()}>
                        <Redo size={20} />
                    </Button>
                </div>

                {/* Brush Size */}
                <div className="flex flex-col items-center gap-1">
                    <label className="text-xs font-semibold">Brush</label>
                    <input
                        type="range"
                        min={1}
                        max={50}
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                        className="w-32 accent-indigo-500"
                    />
                    <span className="text-xs font-bold">{strokeWidth}px</span>
                </div>
            </div>

            {/* Canvas */}
            <ReactSketchCanvas
                ref={canvasRef}
                style={{
                    width: "100vw",
                    height: "60vh",
                    borderTop: "2px solid #333",
                    boxShadow: "0 0 12px rgba(0,0,0,0.5)",
                    background: "linear-gradient(180deg,#fff,#f3f3f3)",
                    cursor: eraseMode ? "crosshair" : "url('/pen.cur'), auto",
                }}
                strokeColor={color}
                strokeWidth={strokeWidth}
                eraserWidth={strokeWidth}
                eraseMode={eraseMode}
                onChange={handleCanvasChange}
            />
            <Button
                className="w-full rounded-lg py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                onClick={handleSendDrawing}
            >
                Send Drawing
            </Button>
        </div>
    );
}

export default Canvas;
