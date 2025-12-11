import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./popupWish.css";
import { useNavigate } from "react-router-dom";

function PopupWish() {
    const [showButton, setShowButton] = useState(false);
    const [windowDimension, setWindowDimension] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const navigate = useNavigate();

    const detectSize = () => {
        setWindowDimension({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    useEffect(() => {
        window.addEventListener("resize", detectSize);

        const timer = setTimeout(() => {
            setShowButton(true);
        }, 3000);

        return () => {
            window.removeEventListener("resize", detectSize);
            clearTimeout(timer);
        };
    }, []);


    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black/95 flex items-center justify-center flex-col z-[9999] overflow-hidden">

            {/* CONFETTI */}
            <Confetti
                width={windowDimension.width}
                height={windowDimension.height}
                numberOfPieces={800}
                gravity={0.15}
            />

            {/* TEXT SECTION */}
            <div className="text-center px-6 z-[10000]">
                <h1 className="birthdayText">
                    Happy Birthday <br />
                    <span className="goldText">Madam Jiiiiiiiiii</span>
                </h1>

                {/* BUTTON */}
                <div
                    className={`transition-all duration-1000 mt-10 ${showButton
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                        }`}
                >
                    <button
                        onClick={() => navigate("/birthday/card-wish")}
                        className="nextBtn"
                    >
                        Next ➜
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PopupWish;
