/// <reference types="chrome"/>
import { useEffect, useState } from "react";
import { JobTitle } from "../components/JobTitle";
import { JobDescription } from "../components/JobDescription";
import { JobRequirements } from "../components/JobRequirements";
import { JobLinks } from "../components/JobLinks";
import { ApplicationQuestions } from "../components/ApplicationQuestions";
import { MessagePerson } from "../components/MessagePerson";
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

// Smart content truncation functions
const truncateJobDescription = (description: string): string => {
  if (description.length <= 1000) return description;

  // Split description into sections
  const sections = description.split(/\n\s*\n/);

  // Prioritize sections that might be most relevant
  const priorityKeywords = [
    "responsibilities",
    "requirements",
    "qualifications",
    "what you will do",
    "what you will need",
    "about the role",
  ];

  // Score sections based on relevance
  const scoredSections = sections.map((section) => {
    let score = 0;
    const sectionLower = section.toLowerCase();

    priorityKeywords.forEach((keyword) => {
      if (sectionLower.includes(keyword)) score += 2;
    });

    // Prioritize shorter sections as they're likely more focused
    score += Math.max(0, 5 - section.length / 200);

    return { section, score };
  });

  // Sort by score and take top sections
  scoredSections.sort((a, b) => b.score - a.score);

  let result = "";
  for (const { section } of scoredSections) {
    if ((result + section).length <= 1000) {
      result += section + "\n\n";
    } else {
      break;
    }
  }

  return result || description.substring(0, 1000) + "...";
};

const truncateRequirements = (requirements: string[]): string[] => {
  if (requirements.length <= 10) return requirements;

  // Score requirements based on specificity
  const scoredRequirements = requirements.map((req) => {
    let score = 0;
    const reqLower = req.toLowerCase();

    // Prioritize requirements with specific keywords
    const specificKeywords = [
      "must",
      "should",
      "always",
      "never",
      "specific",
      "example",
      "required",
      "essential",
    ];
    specificKeywords.forEach((keyword) => {
      if (reqLower.includes(keyword)) score += 2;
    });

    // Prioritize shorter requirements
    score += Math.max(0, 3 - req.length / 50);

    return { requirement: req, score };
  });

  // Sort by score and take top 10
  scoredRequirements.sort((a, b) => b.score - a.score);

  return scoredRequirements.slice(0, 10).map((item) => item.requirement);
};

const JobApplier = () => {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initializedData, setInitializedData] = useState<{
    resumeContent: string;
    instructions: string;
  } | null>(null);

  // Initialize data when component mounts
  useEffect(() => {
    const initializeData = () => {
      const resumeContent = localStorage.getItem("resumeContent") || "";
      const instructions = localStorage.getItem("applyInstructions") || "";

      if (resumeContent || instructions) {
        setInitializedData({
          resumeContent: truncateJobDescription(resumeContent),
          instructions: truncateJobDescription(instructions),
        });
      }
    };

    initializeData();
  }, []);

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

      // Process and truncate job details
      if (response) {
        const processedDetails = {
          ...response,
          description: truncateJobDescription(response.description),
          requirements: truncateRequirements(response.requirements),
        };
        setJobDetails(processedDetails);
      }
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
        initializedData={initializedData}
      />
      <MessagePerson
        jobTitle={jobDetails.title}
        jobDescription={jobDetails.description}
        requirements={jobDetails.requirements}
        websiteUrl={jobDetails.websiteUrl}
        initializedData={initializedData}
      />
    </div>
  );
};

export default JobApplier;
