import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Loader2, RefreshCw, Plus } from "lucide-react";
import { generateAnswer } from "../services/chatgpt";
import { Input } from "./ui/input";

interface ApplicationQuestionsProps {
  questions: string[];
  jobTitle: string;
  jobDescription: string;
  requirements: string[];
  websiteUrl: string;
  initializedData?: {
    resumeContent: string;
    instructions: string;
  } | null;
}

export const ApplicationQuestions = ({
  questions: initialQuestions,
  jobTitle,
  jobDescription,
  requirements,
  websiteUrl,
  initializedData,
}: ApplicationQuestionsProps) => {
  const [questions, setQuestions] = useState<string[]>(initialQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [regeneratePrompts, setRegeneratePrompts] = useState<{
    [key: string]: string;
  }>({});
  const [isRegenerating, setIsRegenerating] = useState<{
    [key: string]: boolean;
  }>({});

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddQuestion();
    }
  };

  const handleGenerateAnswer = async (question: string) => {
    if (!initializedData) {
      setError({ [question]: "Please upload your resume first" });
      return;
    }

    try {
      setLoading({ ...loading, [question]: true });
      setError({ ...error, [question]: "" });

      const answer = await generateAnswer({
        jobTitle,
        jobDescription,
        requirements,
        companyWebsite: websiteUrl,
        question,
        resumeContent: initializedData.resumeContent,
        instructions: initializedData.instructions,
        answerLength: "medium",
      });

      setAnswers({ ...answers, [question]: answer });
    } catch (err) {
      setError({
        ...error,
        [question]:
          err instanceof Error ? err.message : "Failed to generate answer",
      });
    } finally {
      setLoading({ ...loading, [question]: false });
    }
  };

  const handleRegenerateWithPrompt = async (question: string) => {
    if (!initializedData) {
      setError({ [question]: "Please upload your resume first" });
      return;
    }

    if (!regeneratePrompts[question]?.trim()) {
      setError({ [question]: "Please enter a prompt for regeneration" });
      return;
    }

    try {
      setIsRegenerating({ ...isRegenerating, [question]: true });
      setError({ ...error, [question]: "" });

      const answer = await generateAnswer({
        jobTitle,
        jobDescription,
        requirements,
        companyWebsite: websiteUrl,
        question,
        resumeContent: initializedData.resumeContent,
        instructions: `${initializedData.instructions}\n\nRegeneration prompt: ${regeneratePrompts[question]}`,
        answerLength: "medium",
      });

      setAnswers({ ...answers, [question]: answer });
    } catch (err) {
      setError({
        ...error,
        [question]:
          err instanceof Error ? err.message : "Failed to regenerate answer",
      });
    } finally {
      setIsRegenerating({ ...isRegenerating, [question]: false });
    }
  };

  const handleCopyAnswer = (answer: string) => {
    navigator.clipboard.writeText(answer);
    alert("Answer copied to clipboard!");
  };

  if (!questions.length) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No application questions found.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-lg font-medium">Application Questions</h3>

      {/* Add Custom Question Form */}
      <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-700">
          Add Custom Question
        </div>
        <div className="flex gap-2">
          <Input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question here..."
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleAddQuestion}
            disabled={!newQuestion.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {questions.map((question, index) => (
        <div key={index} className="space-y-2">
          <div className="font-medium text-gray-700">{question}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleGenerateAnswer(question)}
              disabled={loading[question]}
              className="flex-1"
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
            {answers[question] && (
              <Button
                variant="outline"
                onClick={() => handleCopyAnswer(answers[question])}
                className="flex-1"
              >
                Copy Answer
              </Button>
            )}
          </div>
          {error[question] && (
            <div className="text-red-500 text-sm">{error[question]}</div>
          )}
          {answers[question] && (
            <>
              <Textarea
                value={answers[question]}
                onChange={(e) =>
                  setAnswers({ ...answers, [question]: e.target.value })
                }
                className="min-h-[100px]"
              />
              <div className="mt-2 space-y-2">
                <div className="text-sm font-medium">
                  Regenerate with prompt:
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={regeneratePrompts[question] || ""}
                    onChange={(e) =>
                      setRegeneratePrompts({
                        ...regeneratePrompts,
                        [question]: e.target.value,
                      })
                    }
                    placeholder="Enter instructions for regeneration (e.g., 'Make it more formal', 'Focus on my leadership skills')"
                    className="min-h-[60px] flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleRegenerateWithPrompt(question)}
                    disabled={isRegenerating[question]}
                    className="flex-shrink-0"
                  >
                    {isRegenerating[question] ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
