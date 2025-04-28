interface JobLinksProps {
  url: string;
  websiteUrl?: string;
}

export const JobLinks = ({ url, websiteUrl }: JobLinksProps) => {
  return (
    <div className="mt-4 space-y-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-blue-500 hover:text-blue-700"
      >
        View on Wellfound
      </a>
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-500 hover:text-blue-700"
        >
          Visit Company Website
        </a>
      )}
    </div>
  );
};
