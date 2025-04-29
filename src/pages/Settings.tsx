import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

interface ResumeData {
  aboutMe: string;
  professionalExperience: string;
  projects: string;
  skills: string;
  additionalInstructions: string;
}

const Settings = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    aboutMe: "",
    professionalExperience: "",
    projects: "",
    skills: "",
    additionalInstructions: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedResumeData = localStorage.getItem("resumeData");
    const savedInstructions = localStorage.getItem("applyInstructions");

    if (savedResumeData) {
      setResumeData((prevData) => ({
        ...prevData,
        ...JSON.parse(savedResumeData),
      }));
    }

    if (savedInstructions) {
      setResumeData((prevData) => ({
        ...prevData,
        additionalInstructions: savedInstructions,
      }));
    }
  }, []);

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Combine all resume sections into a formatted string
      const formattedResume = `
About Me:
${resumeData.aboutMe}

Professional Experience:
${resumeData.professionalExperience}

Projects:
${resumeData.projects}

Skills:
${resumeData.skills}
      `.trim();

      // Save formatted resume and individual sections
      localStorage.setItem("resumeContent", formattedResume);
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
      localStorage.setItem(
        "applyInstructions",
        resumeData.additionalInstructions
      );

      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 flex flex-col h-full">
      <h1 className="text-xl font-semibold mb-6">Resume Settings</h1>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="block text-sm font-medium">About Me</label>
          <Textarea
            value={resumeData.aboutMe}
            onChange={(e) => handleInputChange("aboutMe", e.target.value)}
            placeholder="Write a brief introduction about yourself, your career objectives, and what makes you unique..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Professional Experience
          </label>
          <Textarea
            value={resumeData.professionalExperience}
            onChange={(e) =>
              handleInputChange("professionalExperience", e.target.value)
            }
            placeholder="List your work experience with company names, dates, and key achievements..."
            className="min-h-[200px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Projects</label>
          <Textarea
            value={resumeData.projects}
            onChange={(e) => handleInputChange("projects", e.target.value)}
            placeholder="Describe your notable projects, including technologies used and outcomes achieved..."
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Skills</label>
          <Textarea
            value={resumeData.skills}
            onChange={(e) => handleInputChange("skills", e.target.value)}
            placeholder="List your technical skills, tools, programming languages, and other relevant abilities..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Additional Instructions for AI
          </label>
          <Textarea
            value={resumeData.additionalInstructions}
            onChange={(e) =>
              handleInputChange("additionalInstructions", e.target.value)
            }
            placeholder="Provide specific instructions on how the AI should use your information when generating responses..."
            className="min-h-[100px]"
          />
        </div>

        <Button
          variant="blue"
          className="w-full"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Resume Data"}
        </Button>

        {/* Preview Section */}
        <div className="mt-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-medium mb-4">Resume Preview</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {`About Me:
${resumeData.aboutMe}

Professional Experience:
${resumeData.professionalExperience}

Projects:
${resumeData.projects}

Skills:
${resumeData.skills}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Settings;
