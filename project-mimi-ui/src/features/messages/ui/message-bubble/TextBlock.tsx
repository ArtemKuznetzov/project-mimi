type TextBlockProps = {
  text: string;
  isDeleted: boolean;
};

export const TextBlock = ({ text, isDeleted }: TextBlockProps) => {
  return text.length > 0 && !isDeleted ? (
    <p className="whitespace-pre-wrap break-words break-all leading-snug">{text}</p>
  ) : null;
};
