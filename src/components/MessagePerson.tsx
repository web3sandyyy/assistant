import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2, RefreshCw } from "lucide-react";
import { OPENAI_API_KEY } from "@/config";

type MessageSize = "small" | "mid" | "large";

interface MessagePersonProps {
  jobTitle: string;
  jobDescription: string;
  requirements: string[];
  websiteUrl: string;
  initializedData?: {
    resumeContent: string;
    instructions: string;
  } | null;
}

const getSizeInstructions = (size: MessageSize): string => {
  switch (size) {
    case "small":
      return "Please provide a concise message in 2-3 sentences.";
    case "mid":
      return "Please provide a detailed message in 4-6 sentences.";
    case "large":
      return "Please provide a comprehensive message in 7-10 sentences.";
    default:
      return "Please provide a detailed message in 4-6 sentences.";
  }
};

const getPlatformInstructions = (platform: string): string => {
  const platformLower = platform.toLowerCase();

  if (platformLower.includes("linkedin")) {
    return "Write in a professional LinkedIn style, highlighting your professional background and interest in the position.";
  } else if (platformLower.includes("email")) {
    return "Write in a formal email style with a clear subject line suggestion and proper email formatting.";
  } else if (platformLower.includes("twitter") || platformLower.includes("x")) {
    return "Write in a concise Twitter style, keeping it brief and engaging.";
  } else if (
    platformLower.includes("whatsapp") ||
    platformLower.includes("message")
  ) {
    return "Write in a conversational but professional style suitable for messaging apps.";
  } else {
    return "Write in a professional tone appropriate for business communication.";
  }
};

export const MessagePerson = ({
  jobTitle,
  jobDescription,
  requirements,
  websiteUrl,
  initializedData,
}: MessagePersonProps) => {
  const [recipient, setRecipient] = useState("");
  const [platform, setPlatform] = useState("");
  const [message, setMessage] = useState("");
  const [size, setSize] = useState<MessageSize>("mid");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regeneratePrompt, setRegeneratePrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleGenerate = async () => {
    if (!recipient || !platform || !message) {
      setError("Please fill in all fields");
      return;
    }

    if (!initializedData) {
      setError("Please upload your resume first");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
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
                content: `You are an AI assistant helping to generate job application messages.
              Use the provided resume content and instructions to tailor your response.
              ${getSizeInstructions(size)}
              ${getPlatformInstructions(platform)}
              Be professional and confident in your tone.
              If this is for a specific job application, highlight relevant experience and skills.`,
              },
              {
                role: "user",
                content: `Recipient: ${recipient}
              
Platform: ${platform}

Message Intent: ${message}

Job Title: ${jobTitle}

Job Description: ${jobDescription}

Required Skills: ${requirements.join(", ")}

Company Website: ${websiteUrl}

Resume Content: ${initializedData.resumeContent}

Additional Instructions: ${initializedData.instructions}

Please generate a tailored message based on the above information.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          throw new Error(
            "Rate limit exceeded. Please try again in a few minutes."
          );
        }
        throw new Error(
          `API request failed: ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      setGeneratedMessage(data.choices[0].message.content);
    } catch (error) {
      console.error("Error generating message:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateWithPrompt = async () => {
    if (!initializedData) {
      setError("Please upload your resume first");
      return;
    }

    if (!regeneratePrompt.trim()) {
      setError("Please enter a prompt for regeneration");
      return;
    }

    try {
      setIsRegenerating(true);
      setError(null);

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
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
                content: `You are an AI assistant helping to generate job application messages.
              Use the provided resume content and instructions to tailor your response.
              ${getSizeInstructions(size)}
              ${getPlatformInstructions(platform)}
              Be professional and confident in your tone.
              If this is for a specific job application, highlight relevant experience and skills.
              
              Regeneration prompt: ${regeneratePrompt}`,
              },
              {
                role: "user",
                content: `Recipient: ${recipient}
              
Platform: ${platform}

Message Intent: ${message}

Job Title: ${jobTitle}

Job Description: ${jobDescription}

Required Skills: ${requirements.join(", ")}

Company Website: ${websiteUrl}

Resume Content: ${initializedData.resumeContent}

Additional Instructions: ${initializedData.instructions}

Please generate a tailored message based on the above information.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          throw new Error(
            "Rate limit exceeded. Please try again in a few minutes."
          );
        }
        throw new Error(
          `API request failed: ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      setGeneratedMessage(data.choices[0].message.content);
    } catch (error) {
      console.error("Error regenerating message:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to regenerate message. Please try again."
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    alert("Message copied to clipboard!");
  };

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-medium">Message Person</h3>

      {!initializedData && (
        <div className="text-yellow-600 bg-yellow-50 p-3 rounded-lg">
          Please upload your resume first to generate messages.
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="recipient" className="block text-sm font-medium">
          To / Position
        </label>
        <Input
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="e.g., CEO John, HR Manager Sarah"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="platform" className="block text-sm font-medium">
          Platform
        </label>
        <Input
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          placeholder="LinkedIn, Email, Twitter, WhatsApp, etc."
        />
      </div>

      <div className="space-y-2 flex-1">
        <label htmlFor="message" className="block text-sm font-medium">
          Your intent / job application details
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your intent, the job you're applying for, and any specific points you want to include"
          className="min-h-[120px]"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Message Size</label>
        <div className="flex gap-2">
          <Button
            variant={size === "small" ? "yellow" : "outline"}
            onClick={() => setSize("small")}
            className="flex-1"
          >
            Small
          </Button>
          <Button
            variant={size === "mid" ? "yellow" : "outline"}
            onClick={() => setSize("mid")}
            className="flex-1"
          >
            Medium
          </Button>
          <Button
            variant={size === "large" ? "yellow" : "outline"}
            onClick={() => setSize("large")}
            className="flex-1"
          >
            Large
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button
        variant="blue"
        className="w-full"
        onClick={handleGenerate}
        disabled={isLoading || !initializedData}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Message"
        )}
      </Button>

      {generatedMessage && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium">Generated Message</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {generatedMessage}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              Copy to Clipboard
            </Button>
          </div>
          <div className="mt-2 space-y-2">
            <div className="text-sm font-medium">Regenerate with prompt:</div>
            <div className="flex gap-2">
              <Textarea
                value={regeneratePrompt}
                onChange={(e) => setRegeneratePrompt(e.target.value)}
                placeholder="Enter instructions for regeneration (e.g., 'Make it more formal', 'Focus on my leadership skills')"
                className="min-h-[60px] flex-1"
              />
              <Button
                variant="outline"
                onClick={handleRegenerateWithPrompt}
                disabled={isRegenerating}
                className="flex-shrink-0"
              >
                {isRegenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
