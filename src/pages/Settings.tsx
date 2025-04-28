import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Upload } from "lucide-react";

const Settings = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedInstructions = localStorage.getItem("applyInstructions");
    const savedResumeName = localStorage.getItem("resumeName");

    if (savedInstructions) {
      setInstructions(savedInstructions);
    }

    if (savedResumeName) {
      setResumeName(savedResumeName);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if file is PDF or DOC/DOCX
      if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setResume(file);
        setResumeName(file.name);
      } else {
        alert("Please upload a PDF or Word document");
      }
    }
  };

  const handleSave = () => {
    // Save resume name and instructions to localStorage
    if (resumeName) {
      localStorage.setItem("resumeName", resumeName);
    }

    localStorage.setItem("applyInstructions", instructions);

    // Store the file in localStorage as base64 if selected
    if (resume) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          localStorage.setItem("resumeFile", e.target.result as string);
        }
      };
      reader.readAsDataURL(resume);
    }

    alert("Settings saved successfully!");
  };

  return (
    <div className="container max-w-md mx-auto p-4 flex flex-col h-full">
      <h1 className="text-xl font-semibold mb-6">Settings</h1>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            please attach your resume
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer flex items-center justify-center gap-2 w-full h-12 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent"
            >
              {resumeName ? resumeName : "Please select your resume"}
              <Upload size={16} />
            </label>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <label htmlFor="instructions" className="block text-sm font-medium">
            Please train ai how should it apply and things to mention
          </label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter instructions for how AI should apply and what to highlight from your resume"
            className="min-h-[180px]"
          />
        </div>

        <Button variant="blue" className="w-full" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Settings;
