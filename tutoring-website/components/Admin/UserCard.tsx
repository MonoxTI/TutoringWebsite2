// src/components/Admin/UserCard.tsx
interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserCardProps {
  user: User;
  onApprove: () => void;
  onRevoke: () => void;
  isLoading?: boolean;
}

export default function UserCard({
  user,
  onApprove,
  onRevoke,
  isLoading = false,
}: UserCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 text-white">
        <h3 className="text-lg font-semibold">@{user.username}</h3>
        <p className="text-yellow-100 text-sm mt-1">
          Registered: {formatDate(user.createdAt)}
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-3">
        {/* Email */}
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase">Email</p>
          <a
            href={`mailto:${user.email}`}
            className="text-blue-600 hover:underline text-sm break-all"
          >
            {user.email}
          </a>
        </div>

        {/* Role */}
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase">Status</p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
              user.role
            )}`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>

        {/* User ID */}
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase">ID</p>
          <p className="text-gray-700 text-xs font-mono break-all">
            {user._id}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-2">
        <button
          onClick={onApprove}
          disabled={isLoading}
          className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          {isLoading ? '⏳' : '✓ Approve'}
        </button>
        <button
          onClick={onRevoke}
          disabled={isLoading}
          className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          {isLoading ? '⏳' : '✕ Reject'}
        </button>
      </div>
    </div>
  );
}