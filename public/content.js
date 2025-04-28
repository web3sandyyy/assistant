// Function to extract job details from the page
function extractJobDetails() {
  const jobDetails = {
    title: "",
    description: "",
    requirements: [],
    url: window.location.href,
    websiteUrl: "",
    applicationQuestions: [],
  };

  // Extract job title
  const titleElement = document.querySelector("h1");
  if (titleElement) {
    jobDetails.title = titleElement.textContent.trim();
  }

  // Extract job description using the correct class
  const descriptionElement = document.querySelector(
    ".styles_description__36q7q"
  );
  if (descriptionElement) {
    jobDetails.description = descriptionElement.textContent.trim();
  }

  // Extract skills/requirements from the dd element
  const skillsContainer = document.querySelector(
    ".styles_skillPillTags__Zv_Uv"
  );
  if (skillsContainer) {
    const skillSpans = skillsContainer.querySelectorAll("span");
    skillSpans.forEach((span) => {
      jobDetails.requirements.push(span.textContent.trim());
    });
  }

  // Extract website URL from button text content
  const websiteElement = document.querySelector(".styles_websiteLink___Rnfc");
  if (websiteElement) {
    const websiteUrl = websiteElement.textContent.trim();
    // Add https:// if the URL doesn't start with a protocol
    jobDetails.websiteUrl = websiteUrl.startsWith("http")
      ? websiteUrl
      : `https://${websiteUrl}`;
  }

  // Extract application questions from the modal
  const modal = document.querySelector('[data-test="JobApplication-Modal"]');
  if (modal) {
    const questionElements = modal.querySelectorAll(".mb-2 label");
    questionElements.forEach((element) => {
      const questionText = element
        .querySelector(".text-dark-aaaa.text-md.font-medium")
        ?.textContent.trim();
      if (questionText) {
        jobDetails.applicationQuestions.push(questionText);
      }
    });
  }

  return jobDetails;
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getJobDetails") {
    const jobDetails = extractJobDetails();
    sendResponse(jobDetails);
  }
  return true;
});

// Log when content script is loaded
console.log("Content script: Loaded and ready");
