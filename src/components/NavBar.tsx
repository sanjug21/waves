'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
    AiFillHome, 
    AiOutlineSearch, 
     AiOutlineBell,  AiOutlinePlusCircle, 
    AiOutlineLogout, 
    AiOutlineUser 
} from 'react-icons/ai';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoggedOut } from '@/store/slices/authSlice';
import API from '@/utils/api';
import { SearchedUser } from '@/types/types';
import { useDebounce, useClickOutside } from '@/hooks/navHooks';

export const NavBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const inputRef = useRef<HTMLInputElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchedUser[] | null>(null);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const debouncedSearchText = useDebounce(searchText, 300);
    const defaultDp = "/def.png";

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (debouncedSearchText) {
                setSearchLoading(true);
                setSearchError(null);
                try {
                    const response = await API.get(`/user/search?query=${debouncedSearchText}`);
                    setSearchResults(response.data.users);
                } catch (err: any) {
                    setSearchError(err.message || "An error occurred");
                    setSearchResults(null);
                } finally {
                    setSearchLoading(false);
                }
            } else {
                setSearchResults(null);
                setSearchError(null);
            }
        };
        fetchSearchResults();
    }, [debouncedSearchText]);

    const handleLogout = async () => {
        try {
            await API.post('/auth/logout');
            dispatch(setLoggedOut());
            router.push('/auth/login');
        } catch (error) {
            console.error("Failed to log out:", error);
        } finally {
            setShowProfileMenu(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleSearchIconClick = () => {
        setShowSearchInput(prev => !prev);
        if (!showSearchInput) {
            setSearchText('');
            setSearchResults(null);
            setShowProfileMenu(false);
        }
    };

    const handleNavIconClick = () => {
        if (showSearchInput) {
            setShowSearchInput(false);
            setSearchText('');
            setSearchResults(null);
        }
        setShowProfileMenu(false);
    };

    const handleProfileClick = () => {
        setShowProfileMenu(prev => !prev);
        if (showSearchInput) {
            setShowSearchInput(false);
            setSearchText('');
            setSearchResults(null);
        }
    };

    const clearSearch = useCallback(() => {
        setSearchText('');
        setSearchResults(null);
        setShowSearchInput(false);
    }, []);

    useEffect(() => {
        if (showSearchInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearchInput]);

    useClickOutside([inputRef, searchResultsRef], clearSearch);
    useClickOutside([profileMenuRef], () => setShowProfileMenu(false));

    const showResultsDropdown = searchText.length > 0;
    const profilePath = `/home/profile/${user?._id}`;

 return (
  <>
    <nav className="z-50 px-4 py-3 text-white shadow-cyan-800 shadow-lg NavBg h-[75px]">
      <div className="mx-auto flex items-center justify-between flex-wrap gap-4">
        {/* Logo */}
        <Link
          href="/home"
          className="text-2xl sm:text-3xl font-medium bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
          onClick={clearSearch}
        >
          Waves
        </Link>

        {/* Nav Icons */}
        <div className="flex items-center space-x-4 sm:space-x-6 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-full py-2 px-4 overflow-x-auto">
          <Link
            href="/home"
            className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
              pathname === '/home' ? 'bg-[rgb(0,12,60)]' : ''
            }`}
            aria-label="Home"
            onClick={handleNavIconClick}
          >
            <AiFillHome className="h-6 w-6" />
          </Link>

          {/* Search */}
          <div className="flex items-center relative">
            <div
              className={`flex items-center transition-all duration-200 ease-in-out ${
                showSearchInput ? 'w-48 opacity-100' : 'w-0 opacity-0 overflow-hidden'
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search users..."
                className="w-full p-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(0,12,60)] pl-10"
                value={searchText}
                onChange={handleSearchChange}
              />
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 pointer-events-none" />
            </div>
            <button
              onClick={handleSearchIconClick}
              className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
                showSearchInput ? 'ml-2 hidden' : ''
              }`}
              aria-label="Toggle Search"
            >
              <AiOutlineSearch className="h-6 w-6" />
            </button>
          </div>

          <Link
            href={profilePath}
            className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
              pathname === profilePath ? 'bg-[rgb(0,12,60)]' : ''
            }`}
            aria-label="Profile"
            onClick={handleNavIconClick}
          >
            <AiOutlineUser className="h-6 w-6" />
          </Link>
          <Link
            href="/home/notifications"
            className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
              pathname === '/home/notifications' ? 'bg-[rgb(0,12,60)]' : ''
            }`}
            aria-label="Notifications"
            onClick={handleNavIconClick}
          >
            <AiOutlineBell className="h-6 w-6" />
          </Link>
          <Link
            href="/home/create"
            className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
              pathname === '/home/create' ? 'bg-[rgb(0,12,60)]' : ''
            }`}
            aria-label="Create Post"
            onClick={handleNavIconClick}
          >
            <AiOutlinePlusCircle className="h-6 w-6" />
          </Link>
        </div>

        {/* Profile Section */}
        <div className="relative flex items-center" ref={profileMenuRef}>
          <span className="font-semibold text-lg hidden md:block pr-2">{user?.name}</span>
          <button
            className="rounded-full focus:outline-none"
            onClick={handleProfileClick}
            aria-label="Open Profile Menu"
          >
            <img
              src={user?.dp || defaultDp}
              alt={user?.name}
              className="w-10 h-10 rounded-full border border-black object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultDp;
              }}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 bg-opacity-95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden z-50">
              <Link
                href={profilePath}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center p-3 hover:bg-gray-700 transition-colors duration-200"
              >
                <img
                  src={user?.dp || defaultDp}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                  onError={(e) => {
                    e.currentTarget.src = defaultDp;
                  }}
                />
                <span className="text-white font-medium">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left p-3 hover:bg-gray-700 transition-colors duration-200 text-white flex items-center"
              >
                <AiOutlineLogout className="h-5 w-5 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>

    {/* Search Results Dropdown */}
    {showResultsDropdown && (
      <div
        className="absolute top-20 left-0 right-0 z-40 bg-[rgb(0,7,35)] p-4 pt-8 shadow-lg max-h-80 overflow-y-auto md:max-w-md mx-auto rounded-b-lg"
        ref={searchResultsRef}
      >
        {searchLoading && <p className="text-center text-white py-4">Loading...</p>}
        {searchError && <p className="text-center text-red-400 py-4">Error fetching users.</p>}
        {searchResults && searchResults.length > 0 ? (
          <div className="max-w-md mx-auto">
            {searchResults.map((result) => (
              <Link
                href={`/home/profile/${result._id}`}
                key={result._id}
                onClick={clearSearch}
              >
                <div className="flex items-center p-3 rounded-lg hover:bg-[rgb(10,20,50)] transition-colors duration-200 cursor-pointer mb-2">
                  <img
                    src={result.dp || defaultDp}
                    alt={result.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                    onError={(e) => {
                      e.currentTarget.src = defaultDp;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-white">{result.name}</p>
                    <p className="text-sm text-gray-400">{result.email}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          !searchLoading &&
          !searchError && <p className="text-center text-gray-400 py-4">No user found.</p>
        )}
      </div>
    )}
  </>
);


};