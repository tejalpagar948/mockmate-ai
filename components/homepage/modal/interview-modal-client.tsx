'use client';

import dynamic from 'next/dynamic';
import { useInterviewModal } from '@/app/context/interview-modal-context';

const JobDetailsModal = dynamic(
    () => import('@/components/homepage/modal/jobdetailsmodal'),
    { ssr: false }
);

export default function InterviewModalClient() {
    const { isOpen, closeModal, handleStartInterview, loading } =
        useInterviewModal();

    return (
        <JobDetailsModal
            open={isOpen}
            onClose={closeModal}
            onSubmit={handleStartInterview}
            loading={loading}
        />
    );
}