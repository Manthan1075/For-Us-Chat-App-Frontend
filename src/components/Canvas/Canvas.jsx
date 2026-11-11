import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Button } from "../ui/button";
import { Eraser, Redo, Undo, X, Palette } from "lucide-react";
import { getSocket } from "../../socket/socket";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { sendDrawing } from "../../services/messageServices.js";
import { useUser } from "../../context/UserContext.jsx";
import { SketchPicker } from "react-color";

function Canvas({ showCanvas, setMessage }) {
    const canvasRef = useRef(null);
    const { friendId } = useParams();
    const [color, setColor] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState(4);
    const [eraseMode, setEraseMode] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const colorPickerRef = useRef(null);
    const { user } = useUser();

    const typingTimeout = useRef(null);

    useEffect(() => {
        if (!showPicker) return;

        function handleClickOutside(event) {
            if (
                colorPickerRef.current &&
                !colorPickerRef.current.contains(event.target)
            ) {
                setShowPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPicker]);

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
            getSocket()?.emit("drawing", {
                receiver: friendId,
                drawing: false,
            });
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
                    image: exportedImage,
                }),
                {
                    pending: "Sending drawing...",
                    success: "Drawing sent!",
                    error: "Failed to send drawing.",
                }
            );

            if (response?.success) {
                getSocket().emit("image_message", {
                    message: response.data,
                    receiver: friendId,
                });

                setMessage((prev) => [...prev, response.data]);
                canvasRef.current.clearCanvas();
                showCanvas(false);
            } else {
                toast.error(response?.message || "Failed to send drawing.");
            }
        } catch (error) {
            toast.error("An error occurred while sending drawing.");
            console.error(error);
        }
    };

    return (
        <div className="z-50 fixed bottom-0 left-0 w-full flex flex-col items-center bg-white dark:bg-neutral-950">

            {/* Top Bar */}
            <Button variant="destructive" onClick={() => showCanvas(false)}>
                Close <X />
            </Button>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 p-3 bg-white dark:bg-neutral-900 shadow-md w-full justify-center">

                {/* Color Picker Button */}
                <div className="relative" ref={colorPickerRef}>
                    <Button
                        variant="outline"
                        onClick={() => setShowPicker(!showPicker)}
                        className="flex gap-2"
                    >
                        <Palette />
                        <div
                            className="h-5 w-5 rounded-full border"
                            style={{ background: color }}
                        />
                    </Button>

                    {showPicker && (
                        <div className="absolute z-50 top-12 left-0">
                            <SketchPicker
                                color={color}
                                onChange={(c) => setColor(c.hex)}
                                disableAlpha
                            />
                        </div>
                    )}
                </div>

                {/* Eraser */}
                <Button
                    onClick={toggleEraser}
                    className={eraseMode ? "bg-red-500 text-white" : ""}
                    variant="outline"
                >
                    <Eraser />
                </Button>

                <Button onClick={() => canvasRef.current.undo()} variant="outline">
                    <Undo />
                </Button>

                <Button onClick={() => canvasRef.current.redo()} variant="outline">
                    <Redo />
                </Button>

                {/* Brush Size */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold">Brush</span>
                    <input
                        type="range"
                        min={1}
                        max={50}
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                        className="w-32"
                    />
                    <span className="text-xs">{strokeWidth}px</span>
                </div>
            </div>

            {/* Canvas */}
            <ReactSketchCanvas
                ref={canvasRef}
                style={{
                    width: "100vw",
                    height: "60vh",
                    background: "#fff",
                }}
                strokeColor={color}
                strokeWidth={strokeWidth}
                eraserWidth={strokeWidth}
                eraseMode={eraseMode}
                onChange={handleCanvasChange}
            />

            {/* Send */}
            <Button
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSendDrawing}
            >
                Send Drawing
            </Button>
        </div>
    );
}

export default Canvas;
