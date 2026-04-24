"use client";

import React from "react";
import {useAudio} from "@/context/audio-context";

export default function VolumeControl() {
    const {volume, isMuted, setVolume, toggleMute} = useAudio();

    const getIcon = () => {
        if (isMuted || volume === 0) return "fa-volume-xmark";
        if (volume < 50) return "fa-volume-low";
        return "fa-volume-high";
    };

    return (
        <div className="flex align-items-center gap-4 p-2 px-3 text-white shadow-lg" style={{
            borderRadius: '5px',
            width: '150px'
        }}>
            <i className={`fa-solid ${getIcon()} text-lg`}></i>
            <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                style={{
                    height: '4px'
                }}
                className="w-full bg-white rounded-lg appearance-none cursor-pointer"
            />

            {/*<span className="text-xs font-bold">{volume}%</span>*/}
        </div>
    );
}