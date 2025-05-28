"use client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";

interface Props {
  transcript: string;
  summary: string;
  title: string;
}

const DownloadSRS: React.FC<Props> = ({ transcript, summary, title }) => {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/generate-srs", {
        transcript,
        summary,
      });

      const srs = response.data;

      const doc = new jsPDF();
      const marginLeft = 15;
      const marginTop = 20;
      const marginBottom = 20;
      let currentY = marginTop;
      const pageWidth = doc.internal.pageSize.getWidth() - marginLeft * 2;
      const getPageHeight = () => doc.internal.pageSize.getHeight();
      const lineHeight = 6;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(
        "Software Requirements Specification (SRS)",
        doc.internal.pageSize.getWidth() / 2,
        currentY,
        { align: "center" }
      );
      currentY += 20;

      // Helper to wrap text and add page if needed
      const addWrappedText = (text: string, y: number): number => {
        const lines: string[] = doc.splitTextToSize(text, pageWidth);
        let currentLineY = y;
        lines.forEach((line) => {
          // If next line is outside margin, add page and reset Y
          if (currentLineY + lineHeight > getPageHeight() - marginBottom) {
            doc.addPage();
            currentLineY = marginTop;
          }
          doc.text(line, marginLeft, currentLineY);
          currentLineY += lineHeight;
        });
        return currentLineY;
      };

      const addSection = (sectionTitle: string, content: string | string[]) => {
        // Check if section title fits, else add page
        if (currentY + 8 > getPageHeight() - marginBottom) {
          doc.addPage();
          currentY = marginTop;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(sectionTitle, marginLeft, currentY);
        currentY += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        // Always treat content as array of lines
        const lines = Array.isArray(content)
          ? content.length > 0
            ? content
            : ["No data provided."]
          : content
          ? [content]
          : ["No data provided."];

        lines.forEach((line) => {
          currentY = addWrappedText(line, currentY);
        });

        currentY += 10; // Space between sections
      };

      // Add SRS sections
      addSection("1.1 Purpose", srs["1.1 Purpose"]);
      addSection("1.2 Scope", srs["1.2 Scope"]);
      addSection("2.1 Product Functions", srs["2.1 Product Functions"]);
      addSection("3.1 Functional Requirements", srs["3.1 Functional Requirements"]);
      addSection("3.2 Non-Functional Requirements", srs["3.2 Non-Functional Requirements"]);

      // Add page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          getPageHeight() - 10,
          { align: "center" }
        );
      }

      doc.save(`${title}_SRS.pdf`);
    } catch (error) {
      console.error("SRS Generation Error:", error);
      alert("Failed to generate the SRS document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end mb-2">
      <button
        onClick={generatePDF}
        className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? "Generating..." : "Download SRS Document"}
      </button>
    </div>
  );
};

export default DownloadSRS;
