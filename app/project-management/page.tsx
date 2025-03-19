"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProjectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("project-management/prAnalysis");
  }, []);
  return <></>;
};

export default ProjectPage;
