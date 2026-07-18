"use client"
import { useEffect, useState } from 'react';

interface Star {
    id: number;
    size: string;
    left: string;
    top: string;
    duration: string;
    delay: string;
    peak: string;
}

export function Stars() {
    const [mounted, setMounted] = useState(false);
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
        setMounted(true);
        const generatedStars = Array.from({ length: 70 }, (_, i) => ({
            id: i,
            size: Math.random() < 0.5 ? 'w-px h-px' : 'w-[1.5px] h-[1.5px]',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: `${(2 + Math.random() * 4).toFixed(1)}s`,
            delay: `-${(Math.random() * 4).toFixed(1)}s`,
            peak: (0.2 + Math.random() * 0.5).toFixed(2),
        }));
        setStars(generatedStars);
    }, []);

    if (!mounted) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-0">
            {stars.map((s) => (
                <span
                    key={s.id}
                    className={`absolute rounded-full bg-white ${s.size}`}
                    style={{
                        left: s.left,
                        top: s.top,
                        animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
                        opacity: 0,
                        ['--peak' as string]: s.peak,
                    }}
                />
            ))}
            <style>{`@keyframes twinkle { 0%,100%{opacity:0} 50%{opacity:var(--peak)} }`}</style>
        </div>
    );
}