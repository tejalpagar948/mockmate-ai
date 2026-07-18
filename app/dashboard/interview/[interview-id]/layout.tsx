import { WebcamProvider } from "@/app/context/webcam-context";
import { Toaster } from "sonner";

export default function InterviewLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <WebcamProvider>
            {children}
            <Toaster
                theme="dark"
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#111017",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "white",
                    },
                }}
            />
        </WebcamProvider>
    );
}
