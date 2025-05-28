"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components_v2/ui/card";
import { Button } from "@/components_v2/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components_v2/ui/tabs";
import { FileIcon, FileTextIcon, FileCodeIcon } from "lucide-react";
import { useGetMeetings } from "@services/meeting"; 
import CreateMeetingModal from "../../components_v2/createMeeting"; 
import {
  EyeSlashIcon,
  ChevronUpDownIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import MeetingCard from "@/components_v2/meetingCard"; 
import ButtonComponent from "@components/button.component";
import moment from 'moment';


export function DocumentGeneration() {
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: state, loading, mutate } = useGetMeetings(); // Change to useGetMeetings

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Document Generation
        </h2>
        <p className="text-muted-foreground">
          Generate documentation for your project based on repository content.
        </p>
      </div>

       <ButtonComponent
            title="New Meeting"
            icon={<PlusIcon />}
            onClick={() => setIsCreateModalOpen(true)}
      />

      <Tabs defaultValue="readme" className="space-y-4">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>README Generator</CardTitle>
              <CardDescription>
                Create a comprehensive README file for your repository
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-gray-600" />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state?.meetings
              ?.slice()
              .sort((a, b) =>
                moment((b as any).createdAt).isAfter(
                  moment((a as any).createdAt)
                )
                  ? 1
                  : -1
              )
              .map((meeting) => (
                <MeetingCard key={meeting.displayId} meeting={meeting} />
              ))}
          </div>
        )}
         <CreateMeetingModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            mutate(); // Refresh the meeting list after a new meeting is created
          }}
          />
              </div>
             
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  );
}
