type Props = { status: string };

const StatusBar = ({ status }: Props) => {
  const color =
    status === "Connected!"
      ? "text-green-600"
      : status === "Error"
      ? "text-red-600"
      : "text-yellow-600";

  return (
    <div className={`text-center font-medium mb-2 ${color}`}>{status}</div>
  );
};

export default StatusBar;
