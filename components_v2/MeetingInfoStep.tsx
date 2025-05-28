import React from "react";
import InputComponent from "@components/input.component";
import TextAreaComponent from "@components/textArea.component";
import DatePickerComponent from "@components/datePicker.component";
import SelectMeetingComponent from "@components/select.meeting.component"; 
import { MeetingType } from "@models/meeting";

interface MeetingInfoStepProps {
  formData: {
    name: string;
    date: string;
    description: string;
    type: MeetingType; 
  };
  onChange: (data: Partial<MeetingInfoStepProps["formData"]>) => void;
}

const MeetingInfoStep: React.FC<MeetingInfoStepProps> = ({ formData, onChange }) => {
  return (
    <div>
      {/* Meeting Name */}
      <label className="block text-sm font-medium text-gray-700">Meeting Name</label>
      <InputComponent
        type="text"
        value={formData.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Enter Meeting Title"
      />


      <label className="block mt-4 text-sm font-medium text-gray-700">Meeting Type</label>
      <SelectMeetingComponent
        value={formData.type}
        onChange={(e) => onChange({ type: e.target.value as MeetingType })}
        options={[
          { label: "General", value: "General" },
          { label: "Technical", value: "Technical" },
          { label: "Business", value: "Business" },
          { label: "HR", value: "HR" },
          { label: "Training", value: "Training" },
          { label: "Other", value: "Other" },
        ]}
      />


      <label className="block mt-4 text-sm font-medium text-gray-700">Date</label>
      <DatePickerComponent value={formData.date} onChange={(date) => onChange({ date })} />


      <label className="block mt-4 text-sm font-medium text-gray-700">Description</label>
      <TextAreaComponent
        value={formData.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Briefly describe the purpose of the meeting"
      />
    </div>
  );
};

export default MeetingInfoStep;
