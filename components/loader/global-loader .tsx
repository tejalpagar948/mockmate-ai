export default function GlobalLoader() {
    return (
        <div className="min-h-screen text-white font-sans relative overflow-hidden flex items-center justify-center">
            {/* ambient dot texture, matches Dashboard bg */}
            <div
                className="absolute inset-0 opacity-[0.15] pointer-events-none"
            />
            <div className="text-center relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-violet-600/30 border-t-violet-500 animate-spin" />
                <p className="text-gray-400 text-sm font-medium animate-pulse">Loading interview details...</p>
            </div>
        </div>
    )
}