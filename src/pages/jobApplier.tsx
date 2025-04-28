import { useEffect, useState } from "react";

interface JobDetails {
  title: string;
  description: string;
  requirements: string[];
  url: string;
  websiteUrl: string;
}

const JobApplier = () => {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab.id) {
          throw new Error("No active tab found");
        }

        const response = await chrome.tabs.sendMessage(tab.id, {
          action: "getJobDetails",
        });
        setJobDetails(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch job details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, []);

  const getTruncatedDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length <= 100) return description;
    return words.slice(0, 100).join(" ") + "...";
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">Loading job details...</div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!jobDetails) {
    return (
      <div className="p-4">
        No job details found. Please make sure you're on a Wellfound job page.
      </div>
    );
  }

  const displayDescription = showFullDescription
    ? jobDetails.description
    : getTruncatedDescription(jobDetails.description);

  return (
    <div className="p-4 max-w-full">
      <h1 className="text-2xl font-bold mb-4">{jobDetails.title}</h1>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="whitespace-pre-wrap">{displayDescription}</p>
        {jobDetails.description.split(" ").length > 100 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            {showFullDescription ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {jobDetails.requirements.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {jobDetails.requirements.map((req, index) => (
              <span
                key={index}
                className="mb-1 inline-flex flex-row items-center mr-2 last:mr-0 rounded-full align-middle bg-gray-200 text-gray-700 gap-2 text-xs px-3 py-1"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <a
          href={jobDetails.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-500 hover:text-blue-700"
        >
          View on Wellfound
        </a>
        {jobDetails.websiteUrl && (
          <a
            href={jobDetails.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-500 hover:text-blue-700"
          >
            Visit Company Website
          </a>
        )}
      </div>
    </div>
  );
};

export default JobApplier;
