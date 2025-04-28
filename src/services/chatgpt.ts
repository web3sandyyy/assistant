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

// Function to truncate text to a maximum number of characters
const truncateText = (text: string, maxLength: number = 2000): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
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
    // Truncate long texts to reduce token count
    const truncatedResume = truncateText(resumeContent, 1500);
    const truncatedDescription = truncateText(jobDescription, 1000);
    const truncatedInstructions = truncateText(instructions, 500);

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
            
Job Description: ${truncatedDescription}

Required Skills: ${requirements.slice(0, 10).join(", ")}

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
