"use client";

import React from "react";
import Processing from "@components/timeline"; // Import the Processing component
const ProcessingPage = () => {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Processing Your Document
      </h1>
      <Processing />
    </div>
  );
};

export default ProcessingPage;
