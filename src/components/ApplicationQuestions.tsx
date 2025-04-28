import { useState } from "react";
import { generateAnswer, AnswerLength } from "../services/chatgpt";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface ApplicationQuestionsProps {
  questions: string[];
  jobTitle: string;
  jobDescription: string;
  requirements: string[];
  websiteUrl?: string;
}

export const ApplicationQuestions = ({
  questions,
  jobTitle,
  jobDescription,
  requirements,
  websiteUrl,
}: ApplicationQuestionsProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedLength, setSelectedLength] = useState<AnswerLength>("medium");

  const handleGenerateAnswer = async (question: string) => {
    try {
      setLoading((prev) => ({ ...prev, [question]: true }));

      // Get resume content and instructions from localStorage
      const resumeContent = localStorage.getItem("resumeContent") || "";
      const instructions = localStorage.getItem("applyInstructions") || "";

      const answer = await generateAnswer({
        jobTitle,
        jobDescription,
        requirements,
        companyWebsite: websiteUrl,
        question,
        resumeContent,
        instructions,
        answerLength: selectedLength,
      });

      setAnswers((prev) => ({ ...prev, [question]: answer }));
    } catch (error) {
      console.error("Error generating answer:", error);
      alert("Failed to generate answer. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [question]: false }));
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-gray-500 mb-4">No application questions found.</div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Application Questions</h2>
        <div className="flex gap-2">
          <Button
            variant={selectedLength === "small" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLength("small")}
          >
            Small
          </Button>
          <Button
            variant={selectedLength === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLength("medium")}
          >
            Medium
          </Button>
          <Button
            variant={selectedLength === "large" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLength("large")}
          >
            Large
          </Button>
        </div>
      </div>

      {questions.map((question, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-700 mb-2">{question}</p>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 mb-2"
            rows={4}
            placeholder="Type your answer here..."
            value={answers[question] || ""}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [question]: e.target.value }))
            }
          />
          <Button
            onClick={() => handleGenerateAnswer(question)}
            disabled={loading[question]}
            className="w-full"
          >
            {loading[question] ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Answer"
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};
