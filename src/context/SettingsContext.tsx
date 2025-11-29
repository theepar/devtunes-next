"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SettingsContextType {
    performanceMode: boolean;
    setPerformanceMode: (value: boolean) => void;
    spatialAudio: boolean;
    setSpatialAudio: (value: boolean) => void;
    crossfade: number;
    setCrossfade: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [performanceMode, setPerformanceMode] = useState(false);
    const [spatialAudio, setSpatialAudio] = useState(true);
    const [crossfade, setCrossfade] = useState(5);
    const [mounted, setMounted] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedPerf = localStorage.getItem("devtunes_perf");
        const savedSpatial = localStorage.getItem("devtunes_spatial");
        const savedCrossfade = localStorage.getItem("devtunes_crossfade");

        if (savedPerf !== null) setPerformanceMode(JSON.parse(savedPerf));
        if (savedSpatial !== null) setSpatialAudio(JSON.parse(savedSpatial));
        if (savedCrossfade !== null) setCrossfade(Number(savedCrossfade));
        setMounted(true);
    }, []);

    // Save settings when they change
    useEffect(() => {
        if (mounted) {
            localStorage.setItem("devtunes_perf", JSON.stringify(performanceMode));
            localStorage.setItem("devtunes_spatial", JSON.stringify(spatialAudio));
            localStorage.setItem("devtunes_crossfade", String(crossfade));
        }
    }, [performanceMode, spatialAudio, crossfade, mounted]);

    return (
        <SettingsContext.Provider
            value={{
                performanceMode,
                setPerformanceMode,
                spatialAudio,
                setSpatialAudio,
                crossfade,
                setCrossfade,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
