// DownloadMeetingMinutes.tsx

"use client";
import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Meeting } from "@models/meeting";

interface DownloadProps {
  meeting: Meeting;
}

const DownloadMeetingMinutes: React.FC<DownloadProps> = ({ meeting }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const marginLeft = 10;
    let currentY = 20;

    // Title Centered
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Meeting Minutes", doc.internal.pageSize.getWidth() / 2, currentY, { align: "center" });
    currentY += 12;

    // Basic Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${meeting.name}`, marginLeft, currentY);
    currentY += 6;
    doc.text(`Type: ${meeting.type}`, marginLeft, currentY);
    currentY += 6;
    doc.text(`Date: ${new Date(meeting.date).toLocaleDateString()}`, marginLeft, currentY);
    currentY += 6;
    doc.text(`Sentiment: ${meeting.sentimentAnalysis?.label || "N/A"}`, marginLeft, currentY);
    currentY += 10;

    // Summary - Justified
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", marginLeft, currentY);
    currentY += 4;
    autoTable(doc, {
      startY: currentY,
      theme: "plain",
      body: [
        [{ content: meeting.summary || "No summary available", styles: { halign: "justify" } }],
      ],
      styles: { fontSize: 11, cellPadding: 2 },
      margin: { left: marginLeft, right: marginLeft }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    // Transcript - Justified
    doc.setFont("helvetica", "bold");
    doc.text("Transcript:", marginLeft, currentY);
    currentY += 4;
    autoTable(doc, {
      startY: currentY,
      theme: "plain",
      body: [
        [{ content: meeting.transcript || "No transcript available", styles: { halign: "justify" } }],
      ],
      styles: { fontSize: 11, cellPadding: 2 },
      margin: { left: marginLeft, right: marginLeft }
    });

    // Footer with page number
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    }

    doc.save(`${meeting.name}_MeetingMinutes.pdf`);
  };

  return (
    <div className="flex justify-end mb-2">
      <button
        onClick={generatePDF}
        className="text-sm px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
      >
        Download Meeting Minutes
      </button>
    </div>
  );
};

export default DownloadMeetingMinutes;
