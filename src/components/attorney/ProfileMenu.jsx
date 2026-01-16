export default function ProfileMenu({ initials, user, showProfile, setShowProfile, logout }) {
    
    return (
        <div className="relative">
            <button
                className="flex items-center px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                onClick={() => setShowProfile(!showProfile)}
            >
                <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-purple-600 rounded-full">
                    {initials}
                </div>
                <span className="ml-2">{user?.name}</span>
                <i className="ml-2 text-xs text-gray-600 fa-solid fa-chevron-down"></i>
            </button>

            {showProfile && (
                <div className="absolute right-0 z-20 w-40 mt-2 text-sm bg-white border border-gray-200 rounded shadow">
                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                        Profile
                    </button>
                    <button
                        onClick={logout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}