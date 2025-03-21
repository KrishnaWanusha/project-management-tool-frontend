"use client";
import { buildRoute } from "@helpers/global";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(buildRoute("/"));
  }, []);
  return <></>;
}
