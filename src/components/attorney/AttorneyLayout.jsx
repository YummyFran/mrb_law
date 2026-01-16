"use client"

import React, { useState } from 'react'
import SideNav from './SideNav'
import { useAuth } from '../../contexts/AuthContext'
import AuthService from '../../services/AuthService'
import { useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'
import ProfileMenu from './ProfileMenu'

const AttorneyLayout = ({ children }) => {
  const [showNotif, setShowNotif] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [loadingNotif, setLoadingNotif] = useState(false)
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const { user, refetch } = useAuth()
  const router = useRouter()

  const initials =
    user?.name
      ?.split(" ")[0][0]
      .toUpperCase() || "U"

  const handleLogout = async () => {
    const [data, err] = await AuthService.logout()

    if (!data.success || err) {
      alert("Logout Error")

      return
    }

    await refetch()
    router.refresh()
  }

  async function handleSearch(value) {
    setSearchQuery(value);

    if (!value || value.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNav />
      <main className="flex flex-col flex-1">
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0">
          <div className="relative w-full max-w-xl">
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search clients, cases, documents, events..."
              className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-full"
            />

            {searchQuery.length >= 2 && (
              <div className="absolute left-0 right-0 z-40 mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow max-h-64">
                {searchLoading && (
                  <div className="px-4 py-2 text-xs text-gray-500">
                    Searching…
                  </div>
                )}

                {!searchLoading && searchResults.length === 0 && (
                  <div className="px-4 py-2 text-xs text-gray-500">
                    No results found
                  </div>
                )}

                {!searchLoading &&
                  searchResults.map((r, i) => (
                    <a
                      key={i}
                      href={r.link}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-gray-500">{r.type}</div>
                    </a>
                  ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* NOTIFICATION */}
            <NotificationBell
              unreadCount={unreadCount}
              showNotif={showNotif}
              setShowNotif={setShowNotif}
              loadingNotif={loadingNotif}
              notifications={notifications}
            />

            {/* PROFILE */}
            <ProfileMenu
              initials={initials}
              user={user}
              showProfile={showProfile}
              setShowProfile={setShowProfile}
              logout={handleLogout}
            />
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}

export default AttorneyLayout