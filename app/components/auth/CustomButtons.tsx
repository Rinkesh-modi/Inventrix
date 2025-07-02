import { FiLoader } from "react-icons/fi";
import { ButtonProps } from "~/types/auth";

const CustomButtons = ({ loading, text, className, ...props }: ButtonProps) => {
  return (
    <>
      <button
        type="submit"
        {...props}
        disabled={loading}
        className={`w-full py-3 bg-black disabled:bg-slate-800 text-white flex items-center gap-2 justify-center ${className}`}
      >
        <span>{text}</span>
        {loading ? <FiLoader className="text-white animate-spin text-xl" /> : ""}
      </button>
    </>
  );
};

export default CustomButtons;
