"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AudioContextType {
    volume: number; // 0 a 100
    isMuted: boolean;
    setVolume: (v: number) => void;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [volume, setVolumeState] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const [prevVolume, setPrevVolume] = useState(50);

    const setVolume = (v: number) => {
        setVolumeState(v);
        if (v > 0) setIsMuted(false);
        else setIsMuted(true);
    };

    const toggleMute = () => {
        if (isMuted) {
            setVolumeState(prevVolume);
            setIsMuted(false);
        } else {
            setPrevVolume(volume);
            setVolumeState(0);
            setIsMuted(true);
        }
    };

    return (
        <AudioContext.Provider value={{ volume, isMuted, setVolume, toggleMute }}>
            {children}
        </AudioContext.Provider>
    );
}

// Hook customizado para facilitar o uso
export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio deve ser usado dentro de um AudioProvider");
    return context;
};