type Props = { typingUsers: Set<string> };

const TypingIndicator = ({ typingUsers }: Props) => {
  if (typingUsers.size === 0) return null;

  const users = Array.from(typingUsers);
  let text = "";
  if (users.length === 1) text = `${users[0]} is typing...`;
  else if (users.length === 2)
    text = `${users[0]} and ${users[1]} are typing...`;
  else text = `${users.length} people are typing...`;

  return <div className="text-sm text-gray-500 italic mb-2">{text}</div>;
};

export default TypingIndicator;
