"use client";

import { ReactNode } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavControlButtonProps {
    label: string;
    icon: LucideIcon;
    iconPosition?: "left" | "right";
    onClick: () => void;    
    disabled?: boolean;
    variant?: "default" | "end";
}

export default function NavControlButton({
    label,
    icon: Icon,
    iconPosition = "left",
    onClick,
    disabled = false,
    variant = "default",
}: NavControlButtonProps) {

    const baseClasses =
        "flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

    const variantClasses =
        variant === "end"
            ? "text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20"
            : "text-white/70 bg-white/5 border border-white/10 hover:bg-white/10";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses}`}
        >
            {iconPosition === "left" && <Icon size={variant === "end" ? 14 : 15} />}
            {label}
            {iconPosition === "right" && <Icon size={15} />}
        </button>
    );
}