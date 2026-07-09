'use client';

import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Sparkles,
  Clock,
  ArrowRight,
  LoaderCircle,
} from 'lucide-react';

/**
 * JobDetailsModal — "Tell us more about the job you're interviewing for"
 */

export interface JobDetails {
  jobPosition: string;
  skills: string;
  yearsOfExperience: string;
}

interface JobDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (details: JobDetails) => void;
  loading: boolean;
}

const experienceOptions = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-8 years',
  '8+ years',
];

export default function JobDetailsModal({
  open,
  onClose,
  onSubmit,
  loading,
}: JobDetailsModalProps) {
  // Store form values
  const [jobPosition, setJobPosition] = useState('');
  const [skills, setSkills] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  const isValid =
    jobPosition.trim() && skills.trim() && yearsOfExperience.trim();

  const handleSubmit = () => {
    if (!isValid) return;

    onSubmit({
      jobPosition: jobPosition.trim(),
      skills: skills.trim(),
      yearsOfExperience: yearsOfExperience.trim(),
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative flex h-full sm:max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A1428] to-[#0F0B17] shadow-2xl shadow-violet-950/50">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />

        {/* header */}
        <div className="relative flex shrink-0 items-start justify-between border-b border-white/5 p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/15 text-violet-300">
              <Sparkles className="h-5 w-5" />
            </span>

            <div>
              <h2 className="text-lg font-bold text-white">
                Tell us about the job
              </h2>

              <p className="mt-1 text-sm text-slate-400 hidden md:block">
                We'll tailor your mock interview to match the role.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="custom-scrollbar relative space-y-5 overflow-y-auto p-6">
          {/* Job position */}
          <div>
            <label
              htmlFor="jobPosition"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Briefcase className="h-4 w-4 text-violet-400" />
              Job position
            </label>

            <input
              id="jobPosition"
              type="text"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              placeholder="e.g. Frontend Engineer at Google"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Skills */}

          <div>
            <label
              htmlFor="skills"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Sparkles className="h-4 w-4 text-violet-400" />
              Your skills
            </label>

            <textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, System Design, REST APIs"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />

            <p className="mt-1.5 text-xs text-slate-500">
              Separate skills with commas — we'll match questions to these.
            </p>
          </div>

          {/* Experience */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Clock className="h-4 w-4 text-violet-400" />
              Years of experience
            </label>

            <div className="flex flex-wrap gap-2">
              {experienceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setYearsOfExperience(option)}
                  className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${yearsOfExperience === option
                    ? 'border-violet-500/50 bg-violet-600/20 text-violet-200'
                    : 'border-white/10 bg-black/20 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}>
                  {option}
                </button>
              ))}
            </div>

            <input
              id="yearsOfExperience"
              type="text"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              placeholder="Or type your own, e.g. 6 years"
              className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* footer */}

        <div className="relative flex shrink-0 items-center justify-end gap-3 border-t border-white/5 p-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-violet-600">
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Generating from AI
              </>
            ) : (
              <>
                Start interview
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
