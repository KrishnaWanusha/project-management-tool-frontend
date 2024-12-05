import BadgeComponent from "@components/badge.component";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { Issue } from "@models/issue";
import moment from "moment-timezone";
import React, { useMemo } from "react";

interface IssueCardProps {
  issue: Issue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const dayCount = useMemo(() => {
    const created = moment(issue.created_at ?? moment());
    const closed = moment(issue.closed_at ?? moment());

    const duration = moment.duration((closed ?? moment()).diff(created));

    const days = duration.days();
    const hours = duration.hours();

    if (hours >= 24) {
      return days + 1;
    }

    return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${
      hours !== 1 ? "s" : ""
    }`;
  }, [issue.closed_at, issue.created_at]);
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-300 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{issue.title}</h3>
          <p className="text-sm text-gray-500 flex-wrap">{issue.body}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Task number */}
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800"
          >
            <div className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-gray-800 ">
              <div className="flex items-center px-2 py-1 bg-gray-100 rounded-full hover:shadow-sm hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.16 6.84 9.49.5.09.66-.22.66-.49v-1.7c-2.78.6-3.37-1.35-3.37-1.35-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.88 1.51 2.31 1.08 2.87.83.09-.64.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.338 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.91.68 1.83v2.72c0 .27.16.58.67.49C19.14 20.16 22 16.41 22 12c0-5.52-4.48-10-10-10z" />
                </svg>
                <span className="ml-1 text-sm">{issue.id}</span>
              </div>
            </div>
          </a>

          {/* Comments count */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center px-2 py-1 bg-gray-100 rounded-full">
              <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
              <span className="ml-1 text-sm text-gray-600">
                {issue.comments}
              </span>
            </div>
          </div>

          {/* Status */}
          <BadgeComponent
            title={issue.state}
            className={`${
              issue.state === "open" ? "bg-green-300" : "bg-purple-400"
            }`}
          />

          {/* Priority */}
          <div className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600">
            N/A
          </div>

          {/* Days left */}
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-gray-600">{dayCount}</span>
          </div>

          {/* Menu */}
          <button className="p-1 rounded-full hover:bg-gray-100">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
