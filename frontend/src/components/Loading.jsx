function Loading({ message = "Loading..." }) {
  return (
    <div className="loading-container" role="status">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p>{message}</p>
    </div>
  );
}

export default Loading;
