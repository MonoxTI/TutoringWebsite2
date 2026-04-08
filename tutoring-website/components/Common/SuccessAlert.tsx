// src/components/Common/SuccessAlert.tsx
interface SuccessAlertProps {
  message: string;
  onDismiss?: () => void;
}

export default function SuccessAlert({
  message,
  onDismiss,
}: SuccessAlertProps) {
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
      <p className="font-semibold">✅ {message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="mt-2 text-green-600 hover:text-green-800 text-sm"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}