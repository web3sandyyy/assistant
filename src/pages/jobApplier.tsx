import { useEffect, useState } from "react";
import { JobTitle } from "../components/JobTitle";
import { JobDescription } from "../components/JobDescription";
import { JobRequirements } from "../components/JobRequirements";
import { JobLinks } from "../components/JobLinks";
import { ApplicationQuestions } from "../components/ApplicationQuestions";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";

interface JobDetails {
  title: string;
  description: string;
  requirements: string[];
  url: string;
  websiteUrl: string;
  applicationQuestions: string[];
}

const JobApplier = () => {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
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

  useEffect(() => {
    fetchJobDetails();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">Loading job details...</div>
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchJobDetails} />;
  }

  if (!jobDetails) {
    return <EmptyState onRefresh={fetchJobDetails} />;
  }

  return (
    <div className="p-4 max-w-full">
      <JobTitle title={jobDetails.title} onRefresh={fetchJobDetails} />
      <JobDescription description={jobDetails.description} />
      <JobRequirements requirements={jobDetails.requirements} />
      <JobLinks url={jobDetails.url} websiteUrl={jobDetails.websiteUrl} />
      <ApplicationQuestions
        questions={jobDetails.applicationQuestions}
        jobTitle={jobDetails.title}
        jobDescription={jobDetails.description}
        requirements={jobDetails.requirements}
        websiteUrl={jobDetails.websiteUrl}
      />
    </div>
  );
};

export default JobApplier;
