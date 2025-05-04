# Chrome Sidebar Extension

A simple Chrome sidebar extension built with React and Vite.

## Development

```
npm install
npm run dev
```

## Building the Extension

```
npm run build
```

This will create a `dist` folder with the built extension.

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click "Load unpacked" and select the `dist` folder
4. The extension should now be loaded

## Using the Sidebar Extension

1. Click on the extension icon in your toolbar
2. Click "Open side panel" from the popup
3. The sidebar will open on the right side of your browser

## Features

- Simple sidebar UI
- Navigation buttons
- Custom styling
- Application Questions Management

### Application Questions Component

The ApplicationQuestions component provides a comprehensive interface for managing job application questions and generating AI-powered answers. Key features include:

- **Question Management**
  - View pre-existing application questions
  - Add custom questions manually
  - Input field with Enter key support for quick question addition
  - Clean and intuitive UI for question management

- **Answer Generation**
  - AI-powered answer generation for each question
  - Integration with ChatGPT for intelligent responses
  - Support for custom instructions and prompts
  - Answer regeneration with specific prompts

- **Answer Management**
  - Copy answers to clipboard
  - Edit generated answers
  - Regenerate answers with custom instructions
  - Error handling and loading states

- **Context-Aware Responses**
  - Utilizes job title and description
  - Considers company requirements
  - Incorporates resume content
  - Customizable answer length

## Customization

- Modify `src/App.tsx` to change the sidebar content
- Update `src/App.css` for styling
- Edit `public/manifest.json` to change extension metadata
