import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import icon from "../assets/icon-nobg.png";

const Message = () => {
  const [recipient, setRecipient] = useState("");
  const [platform, setPlatform] = useState("");
  const [message, setMessage] = useState("");
  const [size, setSize] = useState("mid");

  const handleGenerate = () => {
    console.log({ recipient, platform, message, size });
  };

  return (
    <div className=" mx-auto p-2 flex flex-col h-full">
      <div className="flex justify-center items-center mb-4">
        <img src={icon} alt="icon" className="w-12 h-12" />
        <h1 className="text-xl font-semibold text-center italic">Job Assistant</h1>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <h2 className="text-lg font-medium">Generate a application msg</h2>

        <div className="space-y-2">
          <label htmlFor="recipient" className="block text-sm font-medium">
            To / Position
          </label>
          <Input
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="platform" className="block text-sm font-medium">
            Platform
          </label>
          <Input
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="linkedin, email, twitter message"
          />
        </div>

        <div className="space-y-2 flex-1">
          <label htmlFor="message" className="block text-sm font-medium">
            Your intent / job application - etc
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message details"
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">size</label>
          <div className="flex gap-2">
            <Button
              variant={size === "small" ? "yellow" : "outline"}
              onClick={() => setSize("small")}
              className="flex-1"
            >
              small
            </Button>
            <Button
              variant={size === "mid" ? "yellow" : "outline"}
              onClick={() => setSize("mid")}
              className="flex-1"
            >
              mid
            </Button>
            <Button
              variant={size === "large" ? "yellow" : "outline"}
              onClick={() => setSize("large")}
              className="flex-1"
            >
              large
            </Button>
          </div>
        </div>

        <Button variant="blue" className="w-full" onClick={handleGenerate}>
          Generate
        </Button>
      </div>
    </div>
  );
};

export default Message;
