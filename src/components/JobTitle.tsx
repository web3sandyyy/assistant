import { RefreshCcw } from "lucide-react";

interface JobTitleProps {
  title: string;
  onRefresh: () => void;
}

export const JobTitle = ({ title, onRefresh }: JobTitleProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button
        onClick={onRefresh}
        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        title="Refresh job details"
      >
        <RefreshCcw className="w-5 h-5" />
      </button>
    </div>
  );
};
