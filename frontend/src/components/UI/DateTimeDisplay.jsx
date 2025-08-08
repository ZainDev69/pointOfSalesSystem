const DateTimeDisplay = () => {
  // Get the current date and time when the component renders
  const currentDateTime = new Date();

  // Format the date and time
  const date = currentDateTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = currentDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Ensures 12-hour format
  });

  return (
    <div>
      <p>
        Date: {date} {time}
      </p>
    </div>
  );
};

export default DateTimeDisplay;
