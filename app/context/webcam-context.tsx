"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from "react";
import { toast } from "sonner"

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
        if (
            streamRef.current &&
            streamRef.current.active &&
            streamRef.current.getTracks().every(track => track.readyState === "live")
        ) {
            setIsEnabled(true);
            setIsReady(true);
            return;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setStream(null);
        }

        setError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            // Detect mid-session permission revoke
            mediaStream.getTracks().forEach(track => {
                track.onended = () => {
                    streamRef.current = null;
                    setStream(null);
                    setIsEnabled(false);
                    setIsReady(false);
                    localStorage.removeItem("cameraEnabled");
                };
            });

            streamRef.current = mediaStream;
            setStream(mediaStream);
            setIsEnabled(true);
            setIsReady(true);

            localStorage.setItem("cameraEnabled", "true");
        } catch (err) {
            console.error(err);

            if (err instanceof DOMException) {
                toast.error(`${err.name}: ${err.message}`);
            } else {
                toast.error("Failed to access camera/microphone.");
            }

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