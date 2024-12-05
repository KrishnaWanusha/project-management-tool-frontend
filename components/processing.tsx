export default function ProcessingModal() {
  return (
    <div className="my-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-14 shrink-0 fill-blue-500 animate-spin inline"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray="200"
          strokeDashoffset="150"
        />
      </svg>
      <h4 className="text-xl text-gray-800 font-semibold mt-4">
        Processing...
      </h4>
      <p className="text-sm text-gray-500 leading-relaxed mt-4">
        Please wait while we complete your request.
      </p>
    </div>
  );
}
