import React from "react";
import Processing from "../components/Timeline"; // Import the Processing component
import Layout from "../components/Layout"; // Import Layout component
const ProcessingPage = () => {
  return (
    <Layout>
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Processing Your Document</h1>
      <Processing />
    </div>
  </Layout>
  );
};

export default ProcessingPage;
