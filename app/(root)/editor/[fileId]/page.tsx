"use client"

import React, { useReducer, useState } from 'react'

const initialState = {
  personalInfo: {
    name: "",
    email: "",
    linkedIn: "",
    github: "",
    phone: "",
  },
  education: [ // array of objects as user can have multiple degrees
    {
      institute: "",
      duration: "",
      fieldOfStudy: "",
      gpa: "",
      relevantCoursework: "",
    },
  ],
  projects: [ // array of objects as user can have multiple projects
    {
      name: "",
      techStack: "",
      githubLink: "",
      description: [""], // each bullet point as a string
      achievements: [""],
    },
  ],
  skills: { // each key is a category of skills
    programming: [""],
    devFrameworks: [""],
    libraries: [""],
    datebases: [""],
  },
  experience: [ // array of objects as user can have multiple experiences
    {
      company: "",
      position: "",
      duration: "",
      location: "",
      description: [""],
    },
  ],
  certifications: [ // array of objects as user can have multiple certifications
    {
      name: "",
      institute: "",
      link: "",
    },
  ],
};

// define action types
const ACTIONS = {
  ADD_SECTION: "ADD_SECTION",
  REMOVE_SECTION: "REMOVE_SECTION",
  UPDATE_PERSONAL_INFO: "UPDATE_PERSONAL_INFO",
  UPDATE_SKILLS: "UPDATE_SKILLS",
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
    default:
      return state;
  }
}


const ResumeEditor = () => {
  const [resumeData, dispatch] = useReducer(resumeReducer, initialState);
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
        <div className="w-1/2 bg-white rounded-xl shadow-lg p-5 overflow-y-scroll">
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
};

// function InputForm({
//   resumeData,
//   activeSection,
//   onPersonalInfoChange,
//   onAddSection,
//   onUpdateSection,
//   onRemoveSection,
//   onSkillsChange,
// }) {
//   const renderPersonalInfo = () => (
//     <div>
//       <h2>Personal Information</h2>
//       {Object.keys(resumeData.personalInfo).map((field) => (
//         <input
//           key={field}
//           type="text"
//           value={resumeData.personalInfo[field]}
//           onChange={(e) => onPersonalInfoChange(field, e.target.value)}
//           placeholder={field}
//         />
//       ))}
//     </div>
//   );

//   const renderEducation = () => (
//     <div>
//       <h2>Education</h2>
//       {resumeData.education.map((edu, index) => (
//         <div key={index}>
//           {Object.keys(edu).map((field) => (
//             <input
//               key={field}
//               type="text"
//               value={edu[field]}
//               onChange={(e) => onUpdateSection("education", index, field, e.target.value)}
//               placeholder={field}
//             />
//           ))}
//           <button onClick={() => onRemoveSection("education", index)}>Remove</button>
//         </div>
//       ))}
//       <button onClick={() => onAddSection("education")}>Add Education</button>
//     </div>
//   );

//   const renderProjects = () => (
//     <div>
//       <h2>Projects</h2>
//       {resumeData.projects.map((project, index) => (
//         <div key={index}>
//           {Object.keys(project).map((field) =>
//             field === "description" || field === "achievements" ? (
//               <div key={field}>
//                 <h4>{field}</h4>
//                 {project[field].map((item, itemIndex) => (
//                   <input
//                     key={itemIndex}
//                     type="text"
//                     value={item}
//                     onChange={(e) => {
//                       const newArray = [...project[field]];
//                       newArray[itemIndex] = e.target.value;
//                       onUpdateSection("projects", index, field, newArray);
//                     }}
//                     placeholder={`${field} ${itemIndex + 1}`}
//                   />
//                 ))}
//                 <button
//                   onClick={() => {
//                     const newArray = [...project[field], ""];
//                     onUpdateSection("projects", index, field, newArray);
//                   }}
//                 >
//                   Add {field}
//                 </button>
//               </div>
//             ) : (
//               <input
//                 key={field}
//                 type="text"
//                 value={project[field]}
//                 onChange={(e) => onUpdateSection("projects", index, field, e.target.value)}
//                 placeholder={field}
//               />
//             )
//           )}
//           <button onClick={() => onRemoveSection("projects", index)}>Remove Project</button>
//         </div>
//       ))}
//       <button onClick={() => onAddSection("projects")}>Add Project</button>
//     </div>
//   );

//   const renderSkills = () => (
//     <div>
//       <h2>Skills</h2>
//       {Object.keys(resumeData.skills).map((skillType) => (
//         <div key={skillType}>
//           <h3>{skillType}</h3>
//           <input
//             type="text"
//             value={resumeData.skills[skillType].join(", ")}
//             onChange={(e) => onSkillsChange(skillType, e.target.value.split(", "))}
//             placeholder={`Enter ${skillType} separated by commas`}
//           />
//         </div>
//       ))}
//     </div>
//   );

//   const renderExperience = () => (
//     <div>
//       <h2>Experience</h2>
//       {resumeData.experience.map((exp, index) => (
//         <div key={index}>
//           {Object.keys(exp).map((field) =>
//             field === "description" ? (
//               <div key={field}>
//                 <h4>{field}</h4>
//                 {exp[field].map((item, itemIndex) => (
//                   <input
//                     key={itemIndex}
//                     type="text"
//                     value={item}
//                     onChange={(e) => {
//                       const newArray = [...exp[field]];
//                       newArray[itemIndex] = e.target.value;
//                       onUpdateSection("experience", index, field, newArray);
//                     }}
//                     placeholder={`${field} ${itemIndex + 1}`}
//                   />
//                 ))}
//                 <button
//                   onClick={() => {
//                     const newArray = [...exp[field], ""];
//                     onUpdateSection("experience", index, field, newArray);
//                   }}
//                 >
//                   Add {field}
//                 </button>
//               </div>
//             ) : (
//               <input
//                 key={field}
//                 type="text"
//                 value={exp[field]}
//                 onChange={(e) => onUpdateSection("experience", index, field, e.target.value)}
//                 placeholder={field}
//               />
//             )
//           )}
//           <button onClick={() => onRemoveSection("experience", index)}>Remove Experience</button>
//         </div>
//       ))}
//       <button onClick={() => onAddSection("experience")}>Add Experience</button>
//     </div>
//   );

//   const renderCertifications = () => (
//     <div>
//       <h2>Certifications</h2>
//       {resumeData.certifications.map((cert, index) => (
//         <div key={index}>
//           {Object.keys(cert).map((field) => (
//             <input
//               key={field}
//               type="text"
//               value={cert[field]}
//               onChange={(e) => onUpdateSection("certifications", index, field, e.target.value)}
//               placeholder={field}
//             />
//           ))}
//           <button onClick={() => onRemoveSection("certifications", index)}>Remove Certification</button>
//         </div>
//       ))}
//       <button onClick={() => onAddSection("certifications")}>Add Certification</button>
//     </div>
//   );

//   return (
//     <div>
//       {renderPersonalInfo()}
//       {renderEducation()}
//       {renderProjects()}
//       {renderSkills()}
//       {renderExperience()}
//       {renderCertifications()}
//     </div>
//   );
// }

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

// Resume Preview component (placeholder for now)
function ResumePreview({ resumeData }) {
  return (
    <div>
      <h2>Resume Preview</h2>
      <pre>{JSON.stringify(resumeData, null, 2)}</pre>
    </div>
  );
}

export default ResumeEditor;