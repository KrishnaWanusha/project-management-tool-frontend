import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  HomeIcon,
  FolderIcon,
  CreditCardIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const SideNav = () => {
  // const [isProjectsExpanded, setProjectsExpanded] = useState(false);
  const routerPath = usePathname();
  const params = useParams();

  // const toggleProjects = () => {
  //   setProjectsExpanded((prev) => !prev);
  // };

  // Function to check if the current URL matches the given path
  const isActiveLink = (path: string) => {
    return routerPath === path
      ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white"
      : "text-gray-700";
  };

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200">
      <div className="p-4">
        <Link href="/" className="text-xl font-bold">
          Vortexa
        </Link>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">Menu</div>
          <nav className="space-y-1">
            <Link
              href="/project-management/dashboard"
              className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 ${isActiveLink(
                "/project-management/dashboard"
              )}`}
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              Dashboard
            </Link>

            <Link
              href="/project-management/projects"
              className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 ${isActiveLink(
                "/project-management/projects"
              )}`}
            >
              <FolderIcon className="w-5 h-5 mr-3" />
              Projects
            </Link>
            {params?.projectId && (
              <>
                <Link
                  href={`/project-management/projects/${params.projectId}/documents`}
                  className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 ${isActiveLink(
                    `/project-management/projects/${params.projectId}/documents`
                  )}`}
                >
                  <FolderIcon className="w-5 h-5 mr-3" />
                  Document Generation
                </Link>
                <Link
                  href={`/project-management/projects/${params.projectId}/tasks`}
                  className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 ${isActiveLink(
                    `/project-management/projects/${params.projectId}/tasks`
                  )}`}
                >
                  <FolderIcon className="w-5 h-5 mr-3" />
                  Task Management
                </Link>
                <Link
                  href={`/project-management/projects/${params.projectId}/risk`}
                  className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 ${isActiveLink(
                    `/project-management/projects/${params.projectId}/risk`
                  )}`}
                >
                  <FolderIcon className="w-5 h-5 mr-3" />
                  Risk Assessment
                </Link>
                <Link
                  href={`/project-management/projects/${params.projectId}/skills`}
                  className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 ${isActiveLink(
                    `/project-management/projects/${params.projectId}/skills`
                  )}`}
                >
                  <FolderIcon className="w-5 h-5 mr-3" />
                  Skill Assessment
                </Link>
              </>
            )}
            <Link
              href="/team"
              className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 ${isActiveLink(
                "/team"
              )}`}
            >
              <UserIcon className="w-5 h-5 mr-3" />
              Team
            </Link>

            <Link
              href="/payments"
              className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 ${isActiveLink(
                "/payments"
              )}`}
            >
              <CreditCardIcon className="w-5 h-5 mr-3" />
              Payment
            </Link>
          </nav>
        </div>

        <div className="mt-8">
          <div className="text-sm text-gray-500 mb-2">Other</div>
          <nav className="space-y-1">
            <Link
              href="/help"
              className={`flex items-center px-2 py-2 rounded-md hover:bg-gray-100 ${isActiveLink(
                "/help"
              )}`}
            >
              <QuestionMarkCircleIcon className="w-5 h-5 mr-3" />
              Help
            </Link>
            <button className="w-full flex items-center px-2 py-2 text-gray-700 rounded-md hover:bg-gray-100">
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
