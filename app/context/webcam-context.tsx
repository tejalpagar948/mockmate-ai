"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from "react";

interface WebcamContextType {
    stream: MediaStream | null;
    isEnabled: boolean;
    isReady: boolean;
    error: string | null;
    enableCamera: () => Promise<void>;
    disableCamera: () => void;
}

const WebcamContext = createContext<WebcamContextType | undefined>(undefined);

export function WebcamProvider({ children }: { children: React.ReactNode }) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const streamRef = useRef<MediaStream | null>(null);

    const enableCamera = useCallback(async () => {
        // Already enabled
        if (streamRef.current) {
            setIsEnabled(true);
            setIsReady(true);
            return;
        }

        setError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            streamRef.current = mediaStream;
            setStream(mediaStream);
            setIsEnabled(true);
            setIsReady(true);

            localStorage.setItem("cameraEnabled", "true");
        } catch (err) {
            console.error(err);

            setStream(null);
            streamRef.current = null;
            setIsEnabled(false);
            setIsReady(false);
            setError("Camera/mic access denied");

            localStorage.removeItem("cameraEnabled");
        }
    }, []);

    const disableCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());

        streamRef.current = null;
        setStream(null);
        setIsEnabled(false);
        setIsReady(false);

        localStorage.removeItem("cameraEnabled");
    }, []);

    // Auto restore camera after refresh
    useEffect(() => {
        const autoEnableCamera = async () => {
            const shouldEnable = localStorage.getItem("cameraEnabled");

            if (shouldEnable === "true") {
                try {
                    await enableCamera();
                } catch {
                    localStorage.removeItem("cameraEnabled");
                }
            }
        };

        autoEnableCamera();

        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        };
    }, [enableCamera]);

    return (
        <WebcamContext.Provider
            value={{
                stream,
                isEnabled,
                isReady,
                error,
                enableCamera,
                disableCamera,
            }}
        >
            {children}
        </WebcamContext.Provider>
    );
}

export function useWebcam() {
    const ctx = useContext(WebcamContext);

    if (!ctx) {
        throw new Error("useWebcam must be used within a WebcamProvider");
    }

    return ctx;
}