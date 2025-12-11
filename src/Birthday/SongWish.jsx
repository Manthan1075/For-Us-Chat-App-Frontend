import React from "react";
import { useNavigate } from "react-router-dom";
import TextType from "../components/TextType.jsx";
import { Button } from "@/components/ui/button";

function SongWish() {
    const navigate = useNavigate();

    const handleNavigateHome = () => {
        navigate("/");
    };

    return (
        <div
            className={`
                min-h-screen w-full flex justify-center items-center
                bg-[#f4f4f2] text-[#2c2c2c] overflow-hidden
                dark:bg-[#18181a] dark:text-[#ececec]
                transition-colors duration-500
            `}
        >
            <div
                className={`
                    relative w-4/5 max-w-xl px-5 py-16 
                    text-center flex flex-col items-center justify-center
                    bg-transparent
                `}
            >
                {/* Top lyric line */}
                <div className={`
                    w-10 h-0.5 bg-[#b0b0b0] mb-10
                    transition-all duration-500
                    group-hover:w-20
                    dark:bg-[#3a3a3a]
                `}
                ></div>

                {/* Lyrics typing area */}
                <div className={`w-full flex flex-col items-center`}>
                    <div
                        className={`
                            font-[Montserrat,Lato,Arial,sans-serif]
                            italic text-5xl font-medium leading-snug text-[#1a1a1a] min-h-[150px]
                            flex justify-center items-center
                            dark:text-[#fafaf8]
                            transition-colors duration-500
                            group
                            sm:text-3xl
                        `}
                    >
                        <TextType
                            text={[
                                "Bar Bar Din Ye Aaye",
                                "Bar Bar Dil Ye Gaaye",
                                "Aap Jio Hazaro Sal",
                                "Ye Meri Hai Aarzu!!!",
                                "Happy Birthday to Youuuuuuuuuuuuuuuu!!!",
                                "Happy Birthdat to Youuuuuuuuuuuuuuuu!!!",
                            ]}
                            typingSpeed={80}
                            pauseDuration={1500}
                            showCursor={true}
                            initialDelay={500}
                            cursorCharacter=""
                        />
                    </div>
                </div>

                {/* Bottom lyric line */}
                <div className={`
                    w-10 h-0.5 bg-[#b0b0b0] mt-10
                    transition-all duration-500
                    group-hover:w-20
                    dark:bg-[#3a3a3a]
                `}
                ></div>

                {/* Back button */}
                <div className="w-full flex justify-center mt-8">
                    <Button
                        className={`
                            text-lg rounded-full px-8 py-3 font-bold mt-4
                            bg-[#ececec] text-[#222]
                            hover:bg-[#e0e0dc] hover:scale-105 transition
                            dark:bg-[#23232e] dark:text-[#eaeaea] dark:hover:bg-[#24242a]
                        `}
                        onClick={handleNavigateHome}
                    >
                        Back To For Us
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SongWish;