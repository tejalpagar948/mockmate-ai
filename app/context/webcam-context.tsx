"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
    useMemo,
} from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

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

    const pathname = usePathname();
    const isFeedbackPage = pathname?.endsWith("/feedback");

    const enableCamera = useCallback(async () => {
        if (
            streamRef.current &&
            streamRef.current.active &&
            streamRef.current.getTracks().every(
                (track) => track.readyState === "live"
            )
        ) {
            setIsEnabled(true);
            setIsReady(true);
            return;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            setStream(null);
        }

        setError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            mediaStream.getTracks().forEach((track) => {
                track.onended = () => {
                    streamRef.current = null;
                    setStream(null);
                    setIsEnabled(false);
                    setIsReady(false);
                    sessionStorage.removeItem("cameraEnabled");
                };
            });

            streamRef.current = mediaStream;
            setStream(mediaStream);
            setIsEnabled(true);
            setIsReady(true);

            sessionStorage.setItem("cameraEnabled", "true");
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

            sessionStorage.removeItem("cameraEnabled");
        }
    }, []);

    const disableCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());

        streamRef.current = null;
        setStream(null);
        setIsEnabled(false);
        setIsReady(false);

        sessionStorage.removeItem("cameraEnabled");
    }, []);

    useEffect(() => {
        if (isFeedbackPage) {
            disableCamera();
        }
    }, [isFeedbackPage, disableCamera]);

    useEffect(() => {
        if (isFeedbackPage) return;

        const autoEnableCamera = async () => {
            const shouldEnable = sessionStorage.getItem("cameraEnabled");

            if (shouldEnable === "true") {
                try {
                    await enableCamera();
                } catch {
                    sessionStorage.removeItem("cameraEnabled");
                }
            }
        };

        autoEnableCamera();

        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            setStream(null);
            setIsEnabled(false);
            setIsReady(false);
        };
    }, [enableCamera, isFeedbackPage]);

    const value = useMemo(
        () => ({
            stream,
            isEnabled,
            isReady,
            error,
            enableCamera,
            disableCamera,
        }),
        [stream, isEnabled, isReady, error, enableCamera, disableCamera]
    );

    return (
        <WebcamContext.Provider value={value}>
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