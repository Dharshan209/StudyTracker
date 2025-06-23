
const ErrorBanner = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-700">
      <p className="text-sm">
        Authentication issue: {error}
        <button onClick={onDismiss} className="ml-2 underline">Dismiss</button>
      </p>
    </div>
  );
};

export default ErrorBanner;