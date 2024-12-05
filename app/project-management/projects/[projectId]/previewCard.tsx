import { PreviewIssue } from "@services/issues";
import React from "react";

interface PreviewCardProps {
  issue: PreviewIssue;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ issue }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-300 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{issue.title}</h3>
          <p className="text-sm text-gray-500 flex-wrap">{issue.body}</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
