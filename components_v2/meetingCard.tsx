import BadgeComponent from "@components/badge.component";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Meeting } from "@models/meeting"; // Ensure correct import for your Meeting model
import { useParams, useRouter } from "next/navigation";
import React from "react";

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const params = useParams();
  const router = useRouter();

  // Check if sentimentAnalysis is defined and extract the label
  const sentimentLabel = meeting.sentimentAnalysis?.label || "No Sentiment";

  return (
    <div
      onClick={
        () =>
          router.push(
            `/project-management/projects/${params?.projectId}/documents/${meeting.id}`
          ) // Adjusted URL path for meeting summary
      }
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 cursor-pointer flex"
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {meeting.name}
              </h3>
              <div className="flex flex-row items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 my-2">
                  {meeting.type}
                </span>

                <div className="inline-flex items-center my-2 mx-2">
                  <UsersIcon className="w-5 h-5" />
                  <span className="text-sm text-gray-600 ml-1">
                    {meeting.members?.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Display Sentiment Label inside the Badge */}
            <BadgeComponent
              title={sentimentLabel} // Sentiment analysis label (Positive, Neutral, Negative)
              className={`${
                sentimentLabel === "positive"
                  ? "bg-green-200 text-green-800"
                  : sentimentLabel === "negative"
                  ? "bg-red-200 text-red-800"
                  : sentimentLabel === "neutral"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            />
          </div>
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {meeting.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MeetingCard;
