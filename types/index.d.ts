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