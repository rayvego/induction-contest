"use client"

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getGroqChatCompletion } from "@/lib/groq";
import ReactMarkdown from "react-markdown";

// Define the structure of your resume data


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

  const handleGenerateSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-skills", {
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
      console.error("Error generating skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-questions", {
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
      console.error("Error generating skills:", error);
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

  // const handleRefactorContent = async (content: string, section: keyof ResumeData) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch("/api/refactor-content", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ content }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     const refactoredContent = JSON.parse(data.content);
  //     dispatch({ type: "UPDATE_SECTION", payload: { section, content: refactoredContent } });
  //   } catch (error) {
  //     console.error("Error refactoring content:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 w-full">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI anything about resumes!"
              className="flex-grow placeholder:gradient gradient"
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              Send
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-scroll space-y-2">
        <div className="space-y-2 p-2 border rounded-xl h-full bg-gray-50 overflow-y-scroll">
          <div className="overflow-y-auto space-y-2 ">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded ${msg.role === "user" ? "bg-white text-black" : "bg-gray-200"}`}>
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown className="prose max-w-none">{msg.content}</ReactMarkdown>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center gap-y-2">
        <div className="flex items-center space-x-2">
          <span className="gradient">Review:</span>
          <div className="flex justify-between w-full space-x-2">
            <Button onClick={handleReviewResume} disabled={isLoading} variant="secondary">
              Entire Resume
            </Button>
            <Button onClick={() => handleSectionReview("experience")} disabled={isLoading} variant="secondary">
              Experience
            </Button>
            <Button onClick={() => handleSectionReview("projects")} disabled={isLoading} variant="secondary">
              Projects
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="gradient">Generate:</span>
          <div className="flex justify-between w-full space-x-2">
            <Button onClick={handleGenerateSkills} disabled={isLoading} variant="secondary">
              Skills
            </Button>
            <Button onClick={handleGenerateQuestions} disabled={isLoading} variant="secondary">
              Questions
            </Button>
          </div>
        </div>
      </div>

      {isLoading && <div className="text-center">Processing...</div>}
    </div>
  );
};


export default AIChatBox;