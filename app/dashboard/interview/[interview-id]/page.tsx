"use client"
import { useWebcam } from "@/app/context/webcam-context";
import { Video, WebcamIcon, ShieldCheck, Briefcase, FileText, Clock, ArrowRight } from "lucide-react";
import { useInterview } from "@/app/context/interview-data-context"
import InterviewLoader from "@/components/loader/interview-loader "
import LiveVideo from "@/components/interview/live-video";
import Link from "next/link";

export default function InterviewPage() {
	const { interviewData, loading, interviewId } = useInterview()
	const { isEnabled, isReady, enableCamera } = useWebcam();

	if (loading) {
		return <InterviewLoader />;
	}

	if (!interviewData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#050408] text-white">
				<p>Interview not found.</p>
			</div>
		);
	}

	const { jobPosition, jobDesc, jobExperience } = interviewData;

	return (
		<div className="min-h-screen bg-[#050408] text-white font-sans relative overflow-hidden">
			<div
				className="absolute inset-0 opacity-[0.15] pointer-events-none"
				style={{
					backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
					backgroundSize: "48px 48px",
				}}
			/>

			<main className="relative max-w-6xl mx-auto px-6 py-10">
				<div className="mb-8">
					<h1 className="text-3xl font-semibold tracking-tight">Let's Get Started</h1>
				</div>

				<div className="grid lg:grid-cols-2 gap-6">
					{/* Left column — role details */}
					<div className="flex flex-col gap-5">
						<div
							className="rounded-3xl p-7 border border-white/5"
							style={{
								background:
									"radial-gradient(120% 100% at 0% 0%, rgba(124,58,237,0.22) 0%, rgba(124,58,237,0.05) 45%, rgba(255,255,255,0.02) 100%)",
							}}
						>
							<div className="flex flex-col gap-7">
								<div>
									<span className="flex items-center gap-2 text-sm font-semibold tracking-wide text-violet-400 uppercase mb-2">
										<Briefcase size={16} />
										Job Role / Position
									</span>
									<p className="text-[15px] text-gray-100 font-semibold">{jobPosition}</p>
								</div>

								<div>
									<span className="flex items-center gap-2 text-sm font-semibold tracking-wide text-violet-400 uppercase mb-2">
										<FileText size={16} />
										Job Description / Tech Stack
									</span>
									<p className="text-[15px] text-gray-300 leading-relaxed font-semibold">{jobDesc}</p>
								</div>

								<div>
									<span className="flex items-center gap-2 text-sm font-semibold tracking-wide text-violet-400 uppercase mb-2">
										<Clock size={16} />
										Years of Experience
									</span>
									<p className="text-[15px] text-gray-100 font-semibold">{jobExperience}</p>
								</div>
							</div>
						</div>

						<div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-2xl p-5 flex gap-3">
							<div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
								<ShieldCheck size={13} className="text-emerald-400" />
							</div>
							<div className="text-sm text-gray-300 leading-relaxed">
								<span className="font-semibold text-emerald-400">Information: </span>
								Enable your video, webcam, and microphone to start your AI-generated mock
								interview. It has 5 questions you can answer, and at the end you'll get a
								report based on your answers.
								<p className="text-gray-500 mt-2 text-[13px]">
									NOTE: We never record your video. Webcam access can be disabled at any
									time if you want.
								</p>
							</div>
						</div>
					</div>

					{/* Right column — camera */}
					<div className="flex flex-col gap-4">
						<div className="relative aspect-video rounded-3xl bg-[#111017] border border-white/5 overflow-hidden flex items-center justify-center">
							{isEnabled ? (
								<LiveVideo className="w-full h-full object-cover" />
							) : (
								<div className="flex flex-col items-center gap-4">
									<WebcamIcon size={64} className="text-white/30" />
									<button
										onClick={enableCamera}
										className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
									>
										<Video size={16} />
										Enable Camera & Mic
									</button>
								</div>
							)}

							{isEnabled && !isReady && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/40">
									<span className="text-xs text-gray-400">Requesting access…</span>
								</div>
							)}
						</div>

						{/* Start button — camera ke neeche, sirf jab ready ho */}
						{isReady && (
							<Link
								href={`/dashboard/interview/${interviewId}/start`}
								className="flex items-center justify-center gap-2 rounded-full py-3.5 font-medium text-[15px] bg-violet-600 text-white hover:bg-violet-500 transition-colors"
							>
								Start Interview
								<ArrowRight size={16} />
							</Link>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}