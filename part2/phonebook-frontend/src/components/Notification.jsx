const Notification = ({ message }) => {
  return (
    (message.success || message.failure) && (
      <div className={message.success ? "success" : "failure"}>
        {message.success || message.failure}
      </div>
    )
  );
};

export default Notification;
