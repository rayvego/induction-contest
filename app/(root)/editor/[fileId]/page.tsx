"use client"

import AIChatBox from '@/components/AIChatBox';
import { Button } from '@/components/ui/button';
import { getDocument, saveDocument } from '@/lib/actions/user.actions';
import { convertMarkdownToPDF, downloadMarkdownFile } from '@/lib/pdfGeneration';
import { deserializeData, generateResumeMarkdown, serializeData } from '@/lib/utils';
import { useParams } from 'next/navigation';
import React, {useEffect, useReducer, useState } from 'react'
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

// empty initial state for the reducer
// const initialState = {
//   personalInfo: {
//     name: "",
//     email: "",
//     linkedIn: "",
//     github: "",
//     phone: "",
//   },
//   education: [ // array of objects as user can have multiple degrees
//     {
//       institute: "",
//       duration: "",
//       fieldOfStudy: "",
//       gpa: "",
//       relevantCoursework: "",
//     },
//   ],
//   projects: [ // array of objects as user can have multiple projects
//     {
//       name: "",
//       techStack: "",
//       githubLink: "",
//       description: [""], // each bullet point as a string
//       achievements: [""],
//     },
//   ],
//   skills: { // each key is a category of skills
//     programming: [""],
//     devFrameworks: [""],
//     libraries: [""],
//     datebases: [""],
//   },
//   experience: [ // array of objects as user can have multiple experiences
//     {
//       company: "",
//       position: "",
//       duration: "",
//       location: "",
//       description: [""],
//     },
//   ],
//   certifications: [ // array of objects as user can have multiple certifications
//     {
//       name: "",
//       institute: "",
//       link: "",
//     },
//   ],
// };

const data = {
  personalInfo: {
    name: "John Doe",
    email: "johndoe@example.com",
    linkedIn: "https://www.linkedin.com/in/johndoe/",
    github: "https://github.com/johndoe",
    phone: "+1 (123) 456-7890",
  },
  education: [
    {
      institute: "Massachusetts Institute of Technology",
      duration: "September 2018 - June 2022",
      fieldOfStudy: "Bachelor of Science in Computer Science",
      gpa: "4.0/4.0",
      relevantCoursework: "Algorithms, Data Structures, Machine Learning, Computer Networks, Operating Systems",
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
    programming: ["JavaScript", "Python", "C++", "Java"],
    devFrameworks: ["React", "Node.js", "Django", "Flask"],
    libraries: ["TensorFlow", "Pandas", "D3.js"],
    databases: ["MongoDB", "MySQL"],
  },
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


// define action types
const ACTIONS = {
  ADD_SECTION: "ADD_SECTION",
  REMOVE_SECTION: "REMOVE_SECTION",
  UPDATE_PERSONAL_INFO: "UPDATE_PERSONAL_INFO",
  UPDATE_SKILLS: "UPDATE_SKILLS",
  UPDATE_RESUME_DATA: "UPDATE_RESUME_DATA",
};

// reducer function to handle all state updates
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
            relevantCoursework: "",
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
  };

  const handleUpdateSection = (section, index, field, value) => {
    dispatch({ type: "UPDATE_SECTION", section, index, field, value });
  };

  const handleRemoveSection = (section, index) => {
    dispatch({ type: "REMOVE_SECTION", section, index });
  };

  const handleSave = async () => {
    try {
      // save resume data to the database
      await saveDocument({fileId: fileId, content: serializeData(resumeData)})
      console.log("Resume data saved successfully!");
    } catch (error : any) {
      console.error("Error saving resume data:", error);
    }
  }

  const handleGeneratePDF = () => {
    const markdownContent = generateResumeMarkdown(resumeData);
    downloadMarkdownFile(markdownContent, "example.md");
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
      } catch (error: any) {
        console.error("Error fetching resume data:", error);
      }
    }
    getData();
  }, [fileId]);

  return (
    <div className="bg-gray-100 size-full p-3">
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
            <Button onClick={handleGeneratePDF} className="absolute top-7 right-32 p-2 rounded-lg shadow-xl">
              Download PDF
            </Button>
          </div>
          <div className="overflow-y-scroll p-5 rounded-xl shadow-lg bg-white h-2/5 w-full">
            <h2>AI Chat Box</h2>
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
    <div className="space-y-4 rounded-md shadow-xl">
      <h2 className="text-24">Personal Information</h2>
      {Object.keys(resumeData.personalInfo).map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <label htmlFor={field} className="text-16 font-medium">
            {field}
          </label>
          <input
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
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <h2 className="text-24 font-semibold">Education</h2>
      {resumeData.education.map((edu, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          {Object.keys(edu).map((field) => (
            <div key={field} className="flex flex-col gap-2">
              <label htmlFor={`${field}-${index}`} className="text-16 font-medium">
                {field}
              </label>
              <input
                id={`${field}-${index}`}
                type="text"
                value={edu[field]}
                onChange={(e) => onUpdateSection("education", index, field, e.target.value)}
                placeholder={field}
                className="input-class"
              />
            </div>
          ))}
          <button
            onClick={() => onRemoveSection("education", index)}
            className="text14_padding10 bg-red-500 text-white rounded-lg"
          >
            Remove
          </button>
        </div>
      ))}
      <button onClick={() => onAddSection("education")} className="text14_padding10 bg-blue-500 text-white rounded-lg">
        Add Education
      </button>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      <h2 className="text-24 font-semibold">Projects</h2>
      {resumeData.projects.map((project, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          {Object.keys(project).map((field) =>
            field === "description" || field === "achievements" ? (
              <div key={field} className="flex flex-col gap-2">
                <h4 className="text-18 font-semibold">{field}</h4>
                {project[field].map((item, itemIndex) => (
                  <input
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
                ))}
                <button
                  onClick={() => {
                    const newArray = [...project[field], ""];
                    onUpdateSection("projects", index, field, newArray);
                  }}
                  className="text14_padding10 bg-gray-300 text-gray-800 rounded-lg"
                >
                  Add {field}
                </button>
              </div>
            ) : (
              <div key={field} className="flex flex-col gap-2">
                <label htmlFor={`${field}-${index}`} className="text-16 font-medium">
                  {field}
                </label>
                <input
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
          <button
            onClick={() => onRemoveSection("projects", index)}
            className="text14_padding10 bg-red-500 text-white rounded-lg"
          >
            Remove Project
          </button>
        </div>
      ))}
      <button onClick={() => onAddSection("projects")} className="text14_padding10 bg-blue-500 text-white rounded-lg">
        Add Project
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <h2 className="text-24 font-semibold">Skills</h2>
      {Object.keys(resumeData.skills).map((skillType) => (
        <div key={skillType} className="flex flex-col gap-2">
          <h3 className="text-18 font-semibold">{skillType}</h3>
          <input
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
    <div className="space-y-4">
      <h2 className="text-24 font-semibold">Experience</h2>
      {resumeData.experience.map((exp, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          {Object.keys(exp).map((field) =>
            field === "description" ? (
              <div key={field} className="flex flex-col gap-2">
                <h4 className="text-18 font-semibold">{field}</h4>
                {exp[field].map((item, itemIndex) => (
                  <input
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
                ))}
                <button
                  onClick={() => {
                    const newArray = [...exp[field], ""];
                    onUpdateSection("experience", index, field, newArray);
                  }}
                  className="text14_padding10 bg-gray-300 text-gray-800 rounded-lg"
                >
                  Add {field}
                </button>
              </div>
            ) : (
              <div key={field} className="flex flex-col gap-2">
                <label htmlFor={`${field}-${index}`} className="text-16 font-medium">
                  {field}
                </label>
                <input
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
          <button
            onClick={() => onRemoveSection("experience", index)}
            className="text14_padding10 bg-red-500 text-white rounded-lg"
          >
            Remove Experience
          </button>
        </div>
      ))}
      <button onClick={() => onAddSection("experience")} className="text14_padding10 bg-blue-500 text-white rounded-lg">
        Add Experience
      </button>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-4">
      <h2 className="text-24 font-semibold">Certifications</h2>
      {resumeData.certifications.map((cert, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          {Object.keys(cert).map((field) => (
            <div key={field} className="flex flex-col gap-2">
              <label htmlFor={`${field}-${index}`} className="text-16 font-medium">
                {field}
              </label>
              <input
                id={`${field}-${index}`}
                type="text"
                value={cert[field]}
                onChange={(e) => onUpdateSection("certifications", index, field, e.target.value)}
                placeholder={field}
                className="input-class"
              />
            </div>
          ))}
          <button
            onClick={() => onRemoveSection("certifications", index)}
            className="text14_padding10 bg-red-500 text-white rounded-lg"
          >
            Remove Certification
          </button>
        </div>
      ))}
      <button
        onClick={() => onAddSection("certifications")}
        className="text14_padding10 bg-blue-500 text-white rounded-lg"
      >
        Add Certification
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderPersonalInfo()}
      {renderEducation()}
      {renderProjects()}
      {renderSkills()}
      {renderExperience()}
      {renderCertifications()}
    </div>
  );
}

// Sample data for resume preview

// Resume Preview component (placeholder for now)
function ResumePreview({ resumeData }) {
  const markdownContent = generateResumeMarkdown(resumeData);

  return (
    <div>
      <h2>Resume Preview</h2>
      {/* <pre>{JSON.stringify(resumeData, null, 2)}</pre> */}
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
