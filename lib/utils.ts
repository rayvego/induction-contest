import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const SignUpFormSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const SignInFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const serializeData = (data: JSON) => JSON.stringify(data);

export const deserializeData = (data: string) => JSON.parse(data);

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString("en-US", dateTimeOptions);

  const formattedDateDay: string = new Date(dateString).toLocaleString("en-US", dateDayOptions);

  const formattedDate: string = new Date(dateString).toLocaleString("en-US", dateOptions);

  const formattedTime: string = new Date(dateString).toLocaleString("en-US", timeOptions);

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};


export const generateResumeMarkdown = (data): string => {
  let markdown = "";

  // Personal Information
  markdown += `# **${data.personalInfo.name}**  \n`;
  markdown += `${data.personalInfo.phone} | [Email](mailto:${data.personalInfo.email}) | [GitHub](${data.personalInfo.github}) | [LinkedIn](${data.personalInfo.linkedIn})\n\n`;

  // Education
  markdown += `### **Education**  \n`;
  data.education.forEach((edu) => {
    markdown += `**${edu.institute}** (${edu.duration})  \n`;
    markdown += `*${edu.fieldOfStudy}, GPA: ${edu.gpa}*  \n`;
    markdown += `*Courses:* ${edu.relevantCoursework}\n\n`;
  });

  // Projects
  markdown += `### **Projects**  \n`;
  data.projects.forEach((project, index) => {
    markdown += `**${project.name}** • [GitHub](${project.githubLink})  \n`;
    markdown += `*Tech:* ${project.techStack}  \n`;
    project.description.concat(project.achievements).forEach((item) => {
      markdown += `- ${item}  \n`;
    });
    if (index < data.projects.length - 1) markdown += "\n";
  });

  // Skills
  markdown += `### **Skills**  \n`;
  markdown += `**Languages:** ${data.skills.programming.join(", ")}  \n`;
  markdown += `**Frameworks:** ${data.skills.devFrameworks.join(", ")}  \n`;
  markdown += `**Libraries:** ${data.skills.libraries.join(", ")}  \n`;
  markdown += `**Databases:** ${data.skills.databases?.join(", ")}  \n\n`;

  // Experience
  markdown += `### **Experience**  \n`;
  data.experience.forEach((exp, index) => {
    markdown += `**${exp.company}** — ${exp.position}, *${exp.location}* (${exp.duration})  \n`;
    exp.description.forEach((desc) => {
      markdown += `- ${desc}  \n`;
    });
    if (index < data.experience.length - 1) markdown += "\n";
  });

  // Certifications
  markdown += `### **Certifications**  \n`;
  data.certifications.forEach((cert) => {
    markdown += `${cert.name}, ${cert.institute} — [Link](${cert.link})  \n`;
  });

  return markdown.trim();
}



// FUCKING LATEX DIDN'T WORK
// export const generateResumeLatex = (data: any): string => {
//   const preamble = `
// %-------------------------
// % Resume in Latex
// % Author : ETH juniors
// % Inspired by: https://github.com/sb2nov/resume
// % License : MIT
// % Website : www.ethjuniors.ch
// %------------------------

// \\documentclass[letterpaper,11pt]{article}
// \\usepackage{fontawesome5}
// \\usepackage{latexsym}
// \\usepackage[empty]{fullpage}
// \\usepackage{titlesec}
// \\usepackage{marvosym}
// \\usepackage[usenames,dvipsnames]{color}
// \\usepackage{verbatim}
// \\usepackage{enumitem}
// \\usepackage[hidelinks]{hyperref}
// \\usepackage{fancyhdr}
// \\usepackage[english]{babel}
// \\usepackage{tabularx}
// \\input{glyphtounicode}

// % Custom commands
// \\newcommand{\\resumeItem}[1]{
//   \\item\\small{
//     {#1 \\vspace{-2pt}}
//   }
// }

// \\newcommand{\\resumeSubheading}[4]{
//   \\vspace{-2pt}\\item
//     \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
//       \\textbf{#1} & #2 \\\\
//       \\textit{\\small#3} & \\textit{\\small #4} \\\\
//     \\end{tabular*}\\vspace{-7pt}
// }

// \\newcommand{\\resumeSubSubheading}[2]{
//     \\item
//     \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
//       \\textit{\\small#1} & \\textit{\\small #2} \\\\
//     \\end{tabular*}\\vspace{-7pt}
// }

// \\newcommand{\\resumeProjectHeading}[2]{
//     \\item
//     \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
//       \\small#1 & #2 \\\\
//     \\end{tabular*}\\vspace{-7pt}
// }

// \\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

// \\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
// \\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
// \\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
// \\newcommand{\\resumeItemListStart}{\\begin{itemize}}
// \\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

// \\definecolor{Black}{RGB}{0, 0, 0}
// \\newcommand{\\seticon}[1]{\\textcolor{Black}{\\csname #1\\endcsname}}

// % Custom font
// \\usepackage[default]{lato}

// \\pagestyle{fancy}
// \\fancyhf{} % clear all header and footer fields
// \\fancyfoot{}
// \\renewcommand{\\headrulewidth}{0pt}
// \\renewcommand{\\footrulewidth}{0pt}

// % Adjust margins
// \\addtolength{\\oddsidemargin}{-0.5in}
// \\addtolength{\\evensidemargin}{-0.5in}
// \\addtolength{\\textwidth}{1in}
// \\addtolength{\\topmargin}{-.5in}
// \\addtolength{\\textheight}{1.0in}

// \\urlstyle{same}

// \\raggedbottom
// \\raggedright
// \\setlength{\\tabcolsep}{0in}

// % Sections formatting
// \\titleformat{\\section}{
//   \\vspace{-4pt}\\scshape\\raggedright\\large
// }{}{0em}{}[\\color{black}\\titlerule\\vspace{-5pt}]

// % Ensure that generate pdf is machine readable/ATS parsable
// \\pdfgentounicode=1

// %-------------------------%
// % Custom commands
// \\begin{document}
// \\include{custom-commands}

// %-------------------------------------------%
// %%%%%%  RESUME STARTS HERE  %%%%%

// `;

//   const heading = `
// %----------HEADING----------%
// \\begin{center}
//     \\textbf{\\Huge \\scshape ${data.personalInfo.name}} \\\\ \\vspace{5pt}
//     \\small ${data.personalInfo.phone} \\quad
//     \\href{mailto:${data.personalInfo.email}}{\\texttt{|} \\quad \\underline{${data.personalInfo.email}}} \\quad
//     \\href{${data.personalInfo.github}}{\\texttt{|} \\quad \\underline{${data.personalInfo.github}}}
//     \\href{${data.personalInfo.linkedIn}}{\\texttt{|} \\quad \\underline{${data.personalInfo.linkedIn}}}
// \\end{center}
// `;

//   const education = `
// %-----------EDUCATION-----------%
// \\section{Education}
// \\resumeSubHeadingListStart
// ${data.education
//   .map(
//     (edu: any) => `
//     \\resumeSubheading
//     {${edu.institute}}{${edu.duration}}
//     {${edu.fieldOfStudy} (GPA: ${edu.gpa})}{}
//     \\resumeItemListStart
//         \\resumeItem{\\textbf{Relevant Coursework:} ${edu.relevantCoursework}}
//     \\resumeItemListEnd
// `
//   )
//   .join("")}
// \\resumeSubHeadingListEnd
// `;

//   const projects = `
// %-----------PROJECTS-----------%
// \\section{Projects}
// \\resumeSubHeadingListStart
// ${data.projects
//   .map(
//     (project: any) => `
//     \\resumeProjectHeading
//     {\\textbf{${project.name}} $|$ \\emph{${project.techStack}} $|$ \\emph{\\href{${
//       project.githubLink
//     }} {\\underline{GitHub}}}}{}
//     \\resumeItemListStart
//         ${project.description.map((desc: string) => `\\resumeItem{${desc}}`).join("\n")}
//         ${project.achievements.map((achieve: string) => `\\resumeItem{${achieve}}`).join("\n")}
//     \\resumeItemListEnd
// `
//   )
//   .join("")}
// \\resumeSubHeadingListEnd
// `;

//   const skills = `
// %-----------SKILLS-----------%
// \\section{Skills}
// \\begin{itemize}[leftmargin=0.15in, label={}]
//   \\small{
//     \\item{
//       \\textbf{Programming Languages}{: ${data.skills.programming.join(", ")}} \\\\
//       \\textbf{Development Frameworks}{: ${data.skills.devFrameworks.join(", ")}} \\\\
//       \\textbf{Development Libraries}{: ${data.skills.libraries.join(", ")}} \\\\
//       \\textbf{Databases}{: ${data.skills.databases?.join(", ")}} \\\\
//     }
//   }
// \\end{itemize}
// `;

//   const experience = `
// %-----------EXPERIENCE-----------%
// \\section{Experience}
// \\resumeSubHeadingListStart
// ${data.experience
//   .map(
//     (exp: any) => `
//     \\resumeSubheading
//     {${exp.company}}{${exp.duration}}
//     {${exp.position}}{${exp.location}}
//     \\resumeItemListStart
//         ${exp.description.map((desc: string) => `\\resumeItem{${desc}}`).join("\n")}
//     \\resumeItemListEnd
// `
//   )
//   .join("")}
// \\resumeSubHeadingListEnd
// `;

//   const certifications = `
// %-----------CERTIFICATIONS-----------%
// \\section{Certifications}
// \\resumeSubHeadingListStart
// ${data.certifications
//   .map(
//     (cert: any) => `
//     \\item \\textbf{${cert.name}} -- ${cert.institute} -- \\href{${cert.link}}{\\underline{Link}}
// `
//   )
//   .join("")}
// \\resumeSubHeadingListEnd
// `;

//   const footer = `
// \\end{document}
// `;

//   // Combine all parts into the final LaTeX document
//   return `${preamble}${heading}${education}${projects}${skills}${experience}${certifications}${footer}`;
// }
