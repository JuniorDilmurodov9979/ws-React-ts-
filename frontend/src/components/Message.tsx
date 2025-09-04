type MessageProps = {
  user: string;
  text: string;
  self: boolean;
};

const Message = ({ user, text, self }: MessageProps) => {
  return (
    <div
      className={`px-3 py-2 rounded-lg max-w-[75%] ${
        self
          ? "bg-blue-500 text-white self-end ml-auto"
          : "bg-gray-200 text-black self-start mr-auto"
      }`}
    >
      <span className="font-semibold">{user}:</span> {text}
    </div>
  );
};

export default Message;
