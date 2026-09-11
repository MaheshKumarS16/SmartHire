function ErrorMessage({
  message,
  onRetry
}) {
  if (!message) {
    return null;
  }

  return (
    <div>
      <p>{message}</p>

      {onRetry && (
        <button onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;