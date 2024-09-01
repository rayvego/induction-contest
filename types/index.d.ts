declare interface getUserInfoProps {
  userId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare type SignUpParams = {
  email: string;
  username: string;
  password: string;
};

declare interface InitialFileProps {
  initialFiles: any[];
  userId: string;
}

declare interface FileCardProps {
  file: any;
  handleDeleteFile: () => Promise<void>;
  handleOpenFile: () => Promise<void>;
}

declare interface MarkdownRendererProps {
  content: string;
}

// declare interface ResumeData {
//   personalInfo: {
//     name: string;
//     email: string;
//     linkedIn: string;
//     github: string;
//     phone: string;
//   };
//   education: Array<{
//     institute: string;
//     duration: string;
//     fieldOfStudy: string;
//     gpa: string;
//     relevantCoursework: string;
//   }>;
//   projects: Array<{
//     name: string;
//     techStack: string;
//     githubLink: string;
//     description: string[];
//     achievements: string[];
//   }>;
//   skills: {
//     programming: string[];
//     devFrameworks: string[];
//     libraries: string[];
//     datebases: string[];
//   };
//   experience: Array<{
//     company: string;
//     position: string;
//     duration: string;
//     location: string;
//     description: string[];
//   }>;
//   certifications: Array<{
//     name: string;
//     institute: string;
//     link: string;
//   }>;
// }