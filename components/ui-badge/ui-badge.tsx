type BadgeProps = {
  text: string;
  className: string;
};
const UiBadge: React.FC<BadgeProps> = ({ text, className }) => {
  if (!text) return <></>;

  return (
    <>
      {text && (
        <span
          className={`${className} md:hidden inline-flex items-center uppercase justify-center px-2 py-1 text-xs font-bold leading-none text-white  rounded`}
        >
          {text.substring(0, 4) + "..."}
        </span>
      )}
      <span
        className={`${className} hidden md:inline-flex items-center uppercase justify-center px-2 py-1 text-xs font-bold leading-none text-white  rounded`}
      >
        {text}
      </span>
    </>
  );
};

export default UiBadge;