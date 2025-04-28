interface JobRequirementsProps {
  requirements: string[];
}

export const JobRequirements = ({ requirements }: JobRequirementsProps) => {
  if (requirements.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
      <div className="flex flex-wrap gap-2">
        {requirements.map((req, index) => (
          <span
            key={index}
            className="mb-1 inline-flex flex-row items-center mr-2 last:mr-0 rounded-full align-middle bg-gray-200 text-gray-700 gap-2 text-xs px-3 py-1"
          >
            {req}
          </span>
        ))}
      </div>
    </div>
  );
};
