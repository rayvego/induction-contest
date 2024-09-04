"use client"

import AIChatBox from '@/components/AIChatBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getDocument, saveDocument } from '@/lib/actions/user.actions';
import { convertMarkdownToPDF, downloadMarkdownFile } from '@/lib/pdfGeneration';
import { deserializeData, generateResumeMarkdown, serializeData } from '@/lib/utils';
import { useParams } from 'next/navigation';
import React, {useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast';
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

// Sample data for resume editor
const data = {
  personalInfo: {
    name: "Example",
    email: "themohit27@gmail.com",
    linkedIn: "https://www.linkedin.com/in/mohit-panchal-18835to5329/",
    github: "https://github.com/rayvego",
    phone: "+91 8263003413",
  },
  education: [
    {
      institute: "Indian Institute of Technology, Gandhinagar",
      duration: "Aug 2023 - Present",
      fieldOfStudy: "Bachelor of Technology in Computer Science and Engineering",
      gpa: "9.41/10",
      coursework:
        "Data Structures and Algorithms I, Computer Networks, Computer Organization & Architecture, Operating Systems, Theory of Computing, Databases",
    },
  ],
  experience: [
    {
      company: "Tech Innovators Inc.",
      position: "Software Engineer",
      duration: "July 2022 - Present",
      location: "San Francisco, CA",
      description: [
        "Developed and maintained web applications using React and Node.js.",
        "Collaborated with cross-functional teams to design and implement new features.",
      ],
    },
    {
      company: "Startup Labs",
      position: "Intern",
      duration: "June 2021 - August 2021",
      location: "New York, NY",
      description: [
        "Assisted in the development of a mobile app using React Native.",
        "Conducted unit testing and debugging for the application.",
      ],
    },
  ],
  projects: [
    {
      name: "Personal Finance Tracker",
      techStack: "React, Node.js, Express, MongoDB",
      githubLink: "https://github.com/johndoe/finance-tracker",
      description: ["Developed a web application for tracking personal expenses and generating financial reports."],
      achievements: [
        "Implemented data visualization using D3.js to provide insights into spending patterns.",
        "Integrated OAuth2 for secure login using Google and Facebook.",
      ],
    },
    {
      name: "AI-Powered Chatbot",
      techStack: "Python, TensorFlow, Flask",
      githubLink: "https://github.com/johndoe/ai-chatbot",
      description: ["Created an AI-powered chatbot that provides customer support for e-commerce websites."],
      achievements: [
        "Deployed a deep learning model using TensorFlow that achieved 90 accuracy on test data.",
        "Reduced customer service response time by 50.",
      ],
    },
  ],
  skills: {
    programming: ["TypeScript", "Python", "C++", "Java", "Rust", "Solidity"],
    frameworks: ["Nextjs", "Express", "React", "Node.js", "Flask"],
    libraries: ["Socket.io", "Numpy", "Matplotlib", "Pandas", "Prisma", "Scikit Learn", "Pandas"],
    databases: ["AWS S3", "MongoDB", "MySQL", "PostgreSQL"],
  },

  certifications: [
    {
      name: "Certified Kubernetes Administrator",
      institute: "Linux Foundation",
      link: "https://www.credly.com/badges/example",
    },
    {
      name: "AWS Certified Solutions Architect",
      institute: "Amazon Web Services",
      link: "https://www.credly.com/badges/example",
    },
  ],
};


// define action types for state updates
const ACTIONS = {
  ADD_SECTION: "ADD_SECTION",
  REMOVE_SECTION: "REMOVE_SECTION",
  UPDATE_PERSONAL_INFO: "UPDATE_PERSONAL_INFO",
  UPDATE_SKILLS: "UPDATE_SKILLS",
  UPDATE_RESUME_DATA: "UPDATE_RESUME_DATA",
};

// reducer function to handle all state updates
// haven't utilized typescript much here
function resumeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_SECTION:
      return { ...state, [action.section]: [...state[action.section], action.value] };
    case ACTIONS.REMOVE_SECTION:
      return {
        ...state,
        [action.section]: state[action.section].filter((_, index) => index !== action.index),
      };
    case "UPDATE_SECTION":
      return {
        ...state,
        [action.section]: state[action.section].map((item, index) =>
          index === action.index ? { ...item, [action.field]: action.value } : item
        ),
      };
    case ACTIONS.UPDATE_PERSONAL_INFO:
      return { ...state, personalInfo: { ...state.personalInfo, [action.field]: action.value } };
    case ACTIONS.UPDATE_SKILLS:
      return {
        ...state,
        skills: {
          ...state.skills,
          [action.skillType]: action.value,
        },
      };
    case ACTIONS.UPDATE_RESUME_DATA:
      return action.value;
    default:
      return state;
  }
}

const ResumeEditor = () => {
  const {fileId} : {fileId: string} = useParams()
  // use reducer to manage state updates as the resume data is complex
  const [resumeData, dispatch] = useReducer(resumeReducer, data);
  const [activeSection, setActiveSection] = useState("personalInfo");

  const handlePersonalInfoChange = (field, value) => {
    dispatch({ type: "UPDATE_PERSONAL_INFO", field, value });
  };

  const handleSkillsChange = (skillType, value) => {
    dispatch({ type: "UPDATE_SKILLS", skillType, value });
  };

  const handleAddSection = (section) => {
    const newSection =
      section === "education"
        ? {
            institute: "",
            duration: "",
            fieldOfStudy: "",
            gpa: "",
            coursework: "",
          }
        : section === "projects"
        ? {
            name: "",
            techStack: "",
            githubLink: "",
            description: [""],
            achievements: [""],
          }
        : section === "experience"
        ? {
            company: "",
            position: "",
            duration: "",
            location: "",
            description: [""],
          }
        : { // certifications
            name: "",
            institute: "",
            link: "",
          }

    dispatch({ type: "ADD_SECTION", section, value: newSection });
    toast.success(`${section} added successfully!`);
  };

  const handleUpdateSection = (section, index, field, value) => {
    dispatch({ type: "UPDATE_SECTION", section, index, field, value });
  };

  const handleRemoveSection = (section, index) => {
    dispatch({ type: "REMOVE_SECTION", section, index });
    toast.success(`${section} removed successfully!`);
  };

  const handleSave = async () => {
    try {
      // save resume data to the database
      await saveDocument({fileId: fileId, content: serializeData(resumeData)})
      console.log("Resume data saved successfully!");
      toast.success("Resume data saved successfully!");
    } catch (error : any) {
      console.error("Error saving resume data:", error);
      toast.error("Error saving resume data");
    }
  }

  const handleGeneratePDF = () => {
    const markdownContent = generateResumeMarkdown(resumeData);
    downloadMarkdownFile(markdownContent, "example.md");
    toast.success("Markdown file downloaded successfully!");
  };

  useEffect(() => {
    // fetch resume data from the database
    // setResumeData(data);
    async function getData() {
      try {
        const resumeData = await getDocument(fileId);
        const content = deserializeData(resumeData.content);
        // set the resume data in the state using the reducer, if it is null then use the initial data
        dispatch({ type: "UPDATE_RESUME_DATA", value: content || data });
        toast.success("Welcome back!", { icon: "🔮" });
      } catch (error: any) {
        console.error("Error fetching resume data:", error);
      }
    }
    getData();
  }, [fileId]);

  return (
    <div className="bg-gray-100 p-3 max-xl:max-h-screen overflow-y-scroll no-scrollbar">
      <div className="flex space-x-3 size-full">
        <div className="w-1/2 bg-white rounded-xl shadow-lg p-5 overflow-y-scroll">
          <InputForm
            resumeData={resumeData}
            activeSection={activeSection}
            onPersonalInfoChange={handlePersonalInfoChange}
            onAddSection={handleAddSection}
            onUpdateSection={handleUpdateSection}
            onRemoveSection={handleRemoveSection}
            onSkillsChange={handleSkillsChange}
          />
        </div>
        <div className="w-1/2 flex flex-col justify-between items-center gap-y-3">
          <div className="relative overflow-y-scroll p-5  rounded-xl shadow-lg bg-white h-3/5">
            <ResumePreview resumeData={resumeData} />
            <Button onClick={handleSave} className="absolute top-7 right-5 p-2 rounded-lg shadow-xl w-24">
              Save
            </Button>
            <Button
              onClick={handleGeneratePDF}
              className="absolute top-7 right-32 p-2 rounded-lg shadow-xl"
              variant={"destructive"}
            >
              Download MD
            </Button>
          </div>
          <div className="p-2 rounded-xl shadow-lg bg-white h-2/5 w-full">
            <AIChatBox resumeData={resumeData} dispatch={dispatch} />
          </div>
        </div>
      </div>
    </div>
  );
};

function InputForm({
  resumeData,
  activeSection,
  onPersonalInfoChange,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onSkillsChange,
}) {
  const renderPersonalInfo = () => (
    <div className="section-outer">
      <h2 className="text-24 font-semibold gradient">Personal Information</h2>
      <div className="space-y-4">
        {Object.keys(resumeData.personalInfo).map((field) => (
          <div key={field} className="flex flex-col gap-1">
            <Label htmlFor={field} className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Label>
            <Input
              id={field}
              type="text"
              value={resumeData.personalInfo[field]}
              onChange={(e) => onPersonalInfoChange(field, e.target.value)}
              placeholder={field}
              className="input-class"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="section-outer">
      <h2 className="text-24 font-semibold gradient">Education</h2>
      {resumeData.education.map((edu, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4 section-outer">
          {Object.keys(edu).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <Label htmlFor={`${field}-${index}`} className="form-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={`${field}-${index}`}
                type="text"
                value={edu[field]}
                onChange={(e) => onUpdateSection("education", index, field, e.target.value)}
                placeholder={field}
                className="input-class"
              />
            </div>
          ))}
          {resumeData.education.length > 1 && (
            <Button
              onClick={() => onRemoveSection("education", index)}
              variant={"secondary"}
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button onClick={() => onAddSection("education")}>
        Add Education
      </Button>
    </div>
  );

  const renderProjects = () => (
    <div className="section-outer">
      <h2 className="text-24 font-semibold gradient">Projects</h2>
      {resumeData.projects.map((project, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4 section-outer">
          {Object.keys(project).map((field) =>
            field === "description" || field === "achievements" ? (
              <div key={field} className="flex flex-col gap-1">
                <h4 className="text-18 font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</h4>
                {project[field].map((item, itemIndex) => (
                  <div className="flex space-x-2 justify-between items-center">
                    <Input
                      key={itemIndex}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newArray = [...project[field]];
                        newArray[itemIndex] = e.target.value;
                        onUpdateSection("projects", index, field, newArray);
                      }}
                      placeholder={`${field} ${itemIndex + 1}`}
                      className="input-class"
                    />
                    <Button
                      onClick={() => {
                        const newArray = [...project[field]];
                        newArray.splice(itemIndex, 1);
                        onUpdateSection("projects", index, field, newArray);
                      }}
                      variant={"secondary"}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    const newArray = [...project[field], ""];
                    onUpdateSection("projects", index, field, newArray);
                  }}
                >
                  Add {field}
                </Button>
              </div>
            ) : (
              <div key={field} className="flex flex-col gap-1">
                <Label htmlFor={`${field}-${index}`} className="text-16 font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={`${field}-${index}`}
                  type="text"
                  value={project[field]}
                  onChange={(e) => onUpdateSection("projects", index, field, e.target.value)}
                  placeholder={field}
                  className="input-class"
                />
              </div>
            )
          )}
          {resumeData.projects.length > 1 && (
            <Button onClick={() => onRemoveSection("projects", index)} variant={"secondary"}>
              Remove Project
            </Button>
          )}
        </div>
      ))}
      <Button onClick={() => onAddSection("projects")}>Add Project</Button>
    </div>
  );

  const renderSkills = () => (
    <div className="section-outer">
      <h2 className="text-24 font-semibold gradient">Skills</h2>
      {Object.keys(resumeData.skills).map((skillType) => (
        <div key={skillType} className="flex flex-col gap-2">
          <h3 className="text-18 font-semibold form-label">{skillType.charAt(0).toUpperCase() + skillType.slice(1)}</h3>
          <Input
            type="text"
            value={resumeData.skills[skillType].join(", ")}
            onChange={(e) => onSkillsChange(skillType, e.target.value.split(", "))}
            placeholder={`Enter ${skillType} separated by commas`}
            className="input-class"
          />
        </div>
      ))}
    </div>
  );

  const renderExperience = () => (
    <div className="section-outer">
      <h2 className="text-24 font-semibold gradient">Experience</h2>
      {resumeData.experience.map((exp, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4 section-outer">
          {Object.keys(exp).map((field) =>
            field === "description" ? (
              <div key={field} className="flex flex-col gap-1">
                <h4 className="text-18 font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</h4>
                {exp[field].map((item, itemIndex) => (
                  <div className="flex space-x-2 justify-between items-center">
                    <Input
                      key={itemIndex}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newArray = [...exp[field]];
                        newArray[itemIndex] = e.target.value;
                        onUpdateSection("experience", index, field, newArray);
                      }}
                      placeholder={`${field} ${itemIndex + 1}`}
                      className="input-class"
                    />
                    <Button onClick={() => {
                      const newArray = [...exp[field]];
                      newArray.splice(itemIndex, 1);
                      onUpdateSection("experience", index, field, newArray);
                    }} variant="secondary">Delete</Button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    const newArray = [...exp[field], ""];
                    onUpdateSection("experience", index, field, newArray);
                  }}
                >
                  Add {field}
                </Button>
              </div>
            ) : (
              <div key={field} className="flex flex-col gap-1">
                <Label htmlFor={`${field}-${index}`} className="text-16 font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={`${field}-${index}`}
                  type="text"
                  value={exp[field]}
                  onChange={(e) => onUpdateSection("experience", index, field, e.target.value)}
                  placeholder={field}
                  className="input-class"
                />
              </div>
            )
          )}
          {resumeData.experience.length > 1 && (
            <Button onClick={() => onRemoveSection("experience", index)} variant={"secondary"}>
              Remove Experience
            </Button>
          )}
        </div>
      ))}
      <Button onClick={() => onAddSection("experience")}>Add Experience</Button>
    </div>
  );

  const renderCertifications = () => (
    <div className="section-outer">
      <h2 className="text-24 font-semibold gradient">Certifications</h2>
      {resumeData.certifications.map((cert, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4 section-outer">
          {Object.keys(cert).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <Label htmlFor={`${field}-${index}`} className="text-16 font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={`${field}-${index}`}
                type="text"
                value={cert[field]}
                onChange={(e) => onUpdateSection("certifications", index, field, e.target.value)}
                placeholder={field}
                className="input-class"
              />
            </div>
          ))}
          {resumeData.certifications.length > 1 && (
          <Button
            onClick={() => onRemoveSection("certifications", index)}
            variant={"secondary"}
          >
            Remove Certification
          </Button>
          )}
        </div>
      ))}
      <Button
        onClick={() => onAddSection("certifications")}
      >
        Add Certification
      </Button>
    </div>
  );

  return (
    <div className="space-y-8 flex flex-col">
      {renderPersonalInfo()}
      {renderEducation()}
      {renderExperience()}
      {renderProjects()}
      {renderSkills()}
      {renderCertifications()}
    </div>
  );
}

// Sample data for resume preview

// Resume Preview component (placeholder for now)
function ResumePreview({ resumeData }) {
  const markdownContent = generateResumeMarkdown(resumeData);

  return (
    <div className="p-2">
      <MarkdownRenderer content={markdownContent} />
    </div>
  );
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-body prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mb-4 pb-2 border-b" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold mt-8 mb-4" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" className="rounded-md" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 rounded-md px-1 py-0.5" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};



export default ResumeEditor;
