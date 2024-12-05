import ButtonComponent from "@components/button.component";
import InputComponent from "@components/input.component";
import React, { useState } from "react";

interface MembersStepProps {
  members: string[];
  onChange: (members: string[]) => void;
}

const MembersStep: React.FC<MembersStepProps> = ({ members, onChange }) => {
  const [newMember, setNewMember] = useState("");

  const handleAddMember = () => {
    if (newMember.trim() !== "") {
      onChange([...members, newMember]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    onChange(updatedMembers);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Add Members
      </label>
      <div className="flex mt-1">
        <InputComponent
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <ButtonComponent
          title="Add"
          onClick={handleAddMember}
          className="ml-2 px-4 py-2 text-sm font-medium text-white"
        />
      </div>

      <ul className="mt-4 space-y-2">
        {members.map((member, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded-md bg-gray-100 px-4 py-2"
          >
            {member}
            <ButtonComponent
              title="Remove"
              onClick={() => handleRemoveMember(index)}
              className="text-sm text-red-500 hover:underline"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MembersStep;
