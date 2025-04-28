import { useState } from "react";

interface JobDescriptionProps {
  description: string;
}

export const JobDescription = ({ description }: JobDescriptionProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getTruncatedDescription = (text: string) => {
    const words = text.split(" ");
    if (words.length <= 100) return text;
    return words.slice(0, 100).join(" ") + "...";
  };

  const displayDescription = showFullDescription
    ? description
    : getTruncatedDescription(description);

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Description</h3>
      <p className="whitespace-pre-wrap">{displayDescription}</p>
      {description.split(" ").length > 100 && (
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          {showFullDescription ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
