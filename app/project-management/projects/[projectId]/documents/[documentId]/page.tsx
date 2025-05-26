// app/projects/page.tsx
"use client";
import React, { useState } from "react";
import { Project } from "@models/project";
import ButtonComponent from "@components/button.component";
import {
  EyeSlashIcon,
  ChevronUpDownIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import UploadModal from "./upload";
import MeetingCard from "./meetingCard";
import { useGetMeeting } from "@services/meeting";
import DownloadMeetingMinutes from "./downloadMeetingMinutes";
import DownloadSRS from "./DownloadSRS";

const ProjectPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { documentId: id } = useParams();

  const { data: meetingData, loading, mutate } = useGetMeeting(id as string);

  return (
    <div className="min-h-screen bg-gray-50 rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">

        <div className="flex justify-end mb-4 gap-2">
          {meetingData?.meeting && (
            <>
              <DownloadMeetingMinutes meeting={meetingData.meeting} />
              <DownloadSRS 
  title={meetingData.meeting.name || "Meeting"} 
  transcript={meetingData.meeting.transcript || ""} 
  summary={meetingData.meeting.summary || ""} 
/>

            </>
          )}
        </div>

        {loading ? (
          <div className="py-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="w-full py-12 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-300 mt-2 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4">
            {meetingData?.meeting && (
              <MeetingCard meeting={meetingData?.meeting} />
            )}
          </div>
        )}

        {/* <UploadModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            mutate();
          }}
        /> */}
      </div>
    </div>
  );
};

export default ProjectPage;
