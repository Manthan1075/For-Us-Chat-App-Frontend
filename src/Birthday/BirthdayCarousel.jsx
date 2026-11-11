import React from "react";
import "./birthdayCarousel.css";
import { Button } from "../components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

function BirthdayCard() {
    const navigate = useNavigate();

    const wish = {
        emoji: "🎂",
        title: "Happy Birthday",
        text: "Happiest Birthday to the most beautiful cute amazing person I Ever Met! Wishing you a day filled with Happiness and joy. (Flirt Nahi Tarif Hai!)",
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden bg-mainGradient font-sans">
            <div className="glassCard rounded-3xl max-w-xs w-[85%] py-10 px-6 flex flex-col items-center shadow-xl relative animate-popIn">

                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-emoji mb-6 relative">
                    <div className="text-6xl animate-bounceSlow">
                        {wish.emoji}
                    </div>
                </div>

                <h2 className="titleText text-center mb-2">
                    {wish.title}
                </h2>

                <div className="w-16 h-[3px] bg-pink-300 rounded-full mb-4"></div>

                <p className="text-[17px] text-gray-700 text-center font-medium leading-relaxed">
                    {wish.text}
                </p>

                <Button
                    variant="outline"
                    className="mt-10 px-10 py-3 rounded-full shadow-lg text-lg font-semibold bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white border-none hover:brightness-110 transition focus:ring-2 focus:ring-pink-200"
                    onClick={() => navigate('/birthday/song-wish')}
                    style={{
                        letterSpacing: "0.5px"
                    }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default BirthdayCard;
