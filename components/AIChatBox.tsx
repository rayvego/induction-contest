"use client"

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getGroqChatCompletion } from "@/lib/groq";

// Define the structure of your resume data
interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    linkedIn: string;
    github: string;
    phone: string;
  };
  education: Array<{
    institute: string;
    duration: string;
    fieldOfStudy: string;
    gpa: string;
    relevantCoursework: string;
  }>;
  projects: Array<{
    name: string;
    description: string[];
    achievements: string[];
    githubLink: string;
    techStack: string;
    // ... other project fields
  }>;
  skills: {
    programming: string[];
    devFrameworks: string[];
    libraries: string[],
    datebases: string[],
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    location: string;
    description: string[];
  }>;
  certifications: Array<{
    name: string;
    institute: string;
    link: string;
  }>;
}


interface AIChatBoxProps {
  resumeData: ResumeData;
  dispatch: React.Dispatch<any>;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({ resumeData, dispatch }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: data.content }]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  const handleReviewResume = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/review-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages([...messages, { role: "assistant", content: data.content }]);
    } catch (error) {
      console.error("Error reviewing resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionReview = async (section: keyof ResumeData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/review-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, sectionData: resumeData[section] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages([...messages, { role: "assistant", content: data.content }]);
    } catch (error) {
      console.error(`Error reviewing ${section}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefactorContent = async (content: string, section: keyof ResumeData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/refactor-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const refactoredContent = JSON.parse(data.content);
      dispatch({ type: "UPDATE_SECTION", payload: { section, content: refactoredContent } });
    } catch (error) {
      console.error("Error refactoring content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex-grow overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 rounded ${msg.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about resumes..."
          className="flex-grow"
        />
        <Button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleReviewResume} disabled={isLoading}>
          Review Entire Resume
        </Button>
        <Button onClick={() => handleSectionReview("experience")} disabled={isLoading}>
          Review Experience
        </Button>
        <Button onClick={() => handleSectionReview("projects")} disabled={isLoading}>
          Review Projects
        </Button>
      </div>
      {isLoading && <div className="text-center">Processing...</div>}
    </div>
  );
};


export default AIChatBox;