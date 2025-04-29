import { OPENAI_API_KEY } from "@/config";

export type AnswerLength = "small" | "medium" | "large";

interface GenerateAnswerParams {
  jobTitle: string;
  jobDescription: string;
  requirements: string[];
  companyWebsite?: string;
  question: string;
  resumeContent: string;
  instructions: string;
  answerLength: AnswerLength;
}

const getLengthInstructions = (length: AnswerLength): string => {
  switch (length) {
    case "small":
      return "Please provide a concise answer in 2-3 sentences.";
    case "medium":
      return "Please provide a detailed answer in 4-6 sentences.";
    case "large":
      return "Please provide a comprehensive answer in 7-10 sentences.";
    default:
      return "Please provide a detailed answer in 4-6 sentences.";
  }
};

// Simple truncation function for resume content
const truncateResumeContent = (resume: string): string => {
  if (resume.length <= 1000) return resume;
  return resume.substring(0, 1000) + "...";
};

// Simple truncation function for instructions
const truncateInstructions = (instructions: string): string => {
  if (instructions.length <= 300) return instructions;
  return instructions.substring(0, 300) + "...";
};

export const generateAnswer = async ({
  jobTitle,
  jobDescription,
  requirements,
  companyWebsite,
  question,
  resumeContent,
  instructions,
  answerLength,
}: GenerateAnswerParams): Promise<string> => {
  try {
    // Use simple truncation
    const truncatedResume = truncateResumeContent(resumeContent);
    const truncatedInstructions = truncateInstructions(instructions);

    // Limit requirements to first 10
    const limitedRequirements = requirements.slice(0, 10);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant helping to generate job application answers. 
            Use the provided resume content and instructions to tailor your response.
            ${getLengthInstructions(answerLength)}
            Focus on highlighting relevant experience and skills that match the job requirements.
            Be professional and confident in your tone.`,
          },
          {
            role: "user",
            content: `Job Title: ${jobTitle}
            
Job Description: ${jobDescription}

Required Skills: ${limitedRequirements.join(", ")}

${companyWebsite ? `Company Website: ${companyWebsite}` : ""}

Application Question: ${question}

Resume Content: ${truncatedResume}

Additional Instructions: ${truncatedInstructions}

Please generate a tailored answer to the application question based on the above information.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 429) {
        throw new Error(
          "Rate limit exceeded. Please try again in a few minutes."
        );
      }
      throw new Error(
        `API request failed: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating answer:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to generate answer. Please try again.");
  }
};
