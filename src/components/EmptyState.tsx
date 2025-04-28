interface EmptyStateProps {
  onRefresh: () => void;
}

export const EmptyState = ({ onRefresh }: EmptyStateProps) => {
  return (
    <div className="p-4">
      <div className="text-gray-500 mb-4">
        No job details found. Please make sure you're on a Wellfound job page.
      </div>
      <button
        onClick={onRefresh}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
};
