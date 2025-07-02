export interface RegisterProps {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff";
}
export interface LoginProps {
  email: string;
  password: string;
  role: "admin" | "staff";
}

export interface UserProps{
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  loading?: boolean;
  className?: string;
}
