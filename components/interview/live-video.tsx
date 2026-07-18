"use client"

import { useEffect, useRef } from "react";
import { useWebcam } from "@/app/context/webcam-context";

interface LiveVideoProps {
    className?: string;
}

export default function LiveVideo({ className }: LiveVideoProps) {
    const { stream } = useWebcam();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={className}
            style={{ transform: "scaleX(-1)" }} // mirrored, as it was in react-webcam
        />
    );
}