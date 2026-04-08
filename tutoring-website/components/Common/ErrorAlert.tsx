// src/components/Common/ErrorAlert.tsx
interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorAlert({
  message,
  onDismiss,
}: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
      <span className="block sm:inline">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          ✕
        </button>
      )}
    </div>
  );
}