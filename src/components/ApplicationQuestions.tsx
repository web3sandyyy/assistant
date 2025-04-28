interface ApplicationQuestionsProps {
  questions: string[];
}

export const ApplicationQuestions = ({
  questions,
}: ApplicationQuestionsProps) => {
  if (questions.length === 0) {
    return (
      <div className="text-gray-500 mb-4">No application questions found.</div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-lg font-semibold mb-4">Application Questions</h2>
      {questions.map((question, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-700 mb-2">{question}</p>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Type your answer here..."
          />
        </div>
      ))}
    </div>
  );
};
