export default function NotificationBell({
    unreadCount,
    showNotif,
    setShowNotif,
    loadingNotif,
    notifications,
}) {
    return (
        <div className="relative">
            <button
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                onClick={() => setShowNotif(!showNotif)}
            >
                <i className="text-gray-700 fa-solid fa-bell"></i>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotif && (
                <div className="absolute right-0 z-20 mt-2 overflow-y-auto text-sm bg-white border border-gray-200 rounded shadow w-80 max-h-80">
                    <div className="px-3 py-2 font-semibold border-b border-gray-200">Notifications</div>

                    {loadingNotif && (
                        <p className="px-3 py-2 text-xs text-gray-500">Loading…</p>
                    )}

                    {!loadingNotif &&
                        notifications.map((n) => (
                            <div key={n.id} className="px-3 py-2 border-b">
                                <b>{n.title}</b>
                                <p className="text-xs text-gray-600">{n.message}</p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}