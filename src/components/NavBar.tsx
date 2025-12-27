"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlinePlusCircle,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineClose,
} from "react-icons/ai";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setLoggedOut } from "@/store/slices/authSlice";
import API from "@/utils/api";
import { SearchedUser } from "@/types/SearchUser.type";
import { useDebounce, useClickOutside } from "@/hooks/navHooks";

export const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const inputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchedUser[] | null>(
    null
  );
  const [searchLoading, setSearchLoading] = useState(false);

  const debouncedSearchText = useDebounce(searchText, 300);
  const defaultDp = "/def.png";

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchText) {
        setSearchLoading(true);
        try {
          const response = await API.get(
            `/user/search?query=${debouncedSearchText}`
          );
          setSearchResults(response.data.users);
        } catch (err) {
          setSearchResults(null);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults(null);
      }
    };
    fetchSearchResults();
  }, [debouncedSearchText]);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      dispatch(setLoggedOut());
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const clearSearch = useCallback(() => {
    setSearchText("");
    setSearchResults(null);
    setShowSearchInput(false);
  }, []);

  useClickOutside([inputRef, searchResultsRef], clearSearch);
  useClickOutside([profileMenuRef], () => setShowProfileMenu(false));

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-[#000828] border-b border-gray-800 px-2 md:px-6">
        <div className="max-w-full mx-auto h-full flex items-center justify-between gap-1">
          {/* LEFT CORNER: Logo - Reduced min-width on mobile */}
          <div
            className={`${
              showSearchInput ? "hidden md:flex" : "flex"
            } flex-shrink-0 min-w-[60px] md:min-w-[100px]`}
          >
            <Link
              href="/home"
              onClick={clearSearch}
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
            >
              Waves
            </Link>
          </div>

          {/* CENTER: Navigation Capsule - Flexible expansion */}
          <div
            className={`flex-grow flex justify-center ${
              showSearchInput ? "px-0" : "px-1 md:px-2"
            }`}
          >
            <div
              className={`flex items-center bg-gray-900/90 backdrop-blur-md rounded-full px-1 md:px-2 py-1 border border-gray-700 w-full transition-all duration-300 ${
                showSearchInput ? "max-w-full" : "max-w-[420px]"
              } justify-around`}
            >
              {/* Icons logic */}
              {!showSearchInput && (
                <Link
                  href="/home"
                  className={`p-2 transition ${
                    pathname === "/home"
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <AiFillHome className="h-6 w-6" />
                </Link>
              )}

              <div
                className={`flex items-center ${
                  showSearchInput ? "w-full px-1" : ""
                }`}
              >
                {showSearchInput ? (
                  <div className="relative w-full flex items-center bg-gray-800 rounded-full px-3 py-1.5">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search users..."
                      className="w-full bg-transparent text-base md:text-sm outline-none text-white"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-white ml-2"
                    >
                      <AiOutlineClose className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearchInput(true)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <AiOutlineSearch className="h-6 w-6" />
                  </button>
                )}
              </div>

              {!showSearchInput && (
                <>
                  <Link
                    href={`/home/profile/${user?._id}`}
                    className={`p-2 transition ${
                      pathname.includes("/profile")
                        ? "text-blue-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <AiOutlineUser className="h-6 w-6" />
                  </Link>
                  <Link
                    href="/home/notifications"
                    className={`p-2 transition ${
                      pathname === "/home/notifications"
                        ? "text-blue-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <AiOutlineBell className="h-6 w-6" />
                  </Link>
                  <Link
                    href="/home/create"
                    className={`p-2 transition ${
                      pathname === "/home/create"
                        ? "text-blue-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <AiOutlinePlusCircle className="h-6 w-6" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* RIGHT CORNER: Avatar - Reduced min-width on mobile */}
          <div
            className={`${
              showSearchInput ? "hidden md:flex" : "flex"
            } flex-shrink-0 min-w-[40px] md:min-w-[100px] justify-end relative`}
            ref={profileMenuRef}
          >
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-gray-700 hover:border-blue-400 transition-all overflow-hidden"
            >
              <img
                src={user?.dp || defaultDp}
                className="h-full w-full object-cover"
                alt="avatar"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-[55px] w-48 bg-[#000828] border border-gray-700 rounded-xl shadow-2xl py-2 z-50">
                <Link
                  href={`/home/details`}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center gap-2"
                >
                  <AiOutlineLogout /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="h-[70px]"></div>

      {/* Search Results Dropdown - Full width on mobile */}
      {searchText.length > 0 && (
        <div
          ref={searchResultsRef}
          className="fixed top-[70px] left-1/2 -translate-x-1/2 w-[95%] md:w-full max-w-[420px] bg-[#000828]/95 backdrop-blur-xl border border-gray-800 rounded-b-2xl md:rounded-b-2xl shadow-2xl z-40 overflow-hidden"
        >
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {searchLoading ? (
              <div className="p-4 text-center text-sm text-gray-400">
                Searching...
              </div>
            ) : (
              searchResults?.map((result) => (
                <Link
                  key={result._id}
                  href={`/home/profile/${result._id}`}
                  onClick={clearSearch}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition"
                >
                  <img
                    src={result.dp || defaultDp}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                  <div className="truncate text-white text-sm">
                    {result.name}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};
// 'use client';

// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import {
//     AiFillHome,
//     AiOutlineSearch,
//      AiOutlineBell,  AiOutlinePlusCircle,
//     AiOutlineLogout,
//     AiOutlineUser,
//     AiOutlineClose
// } from 'react-icons/ai';
// import { useAppSelector, useAppDispatch } from '@/store/hooks';
// import { setLoggedOut } from '@/store/slices/authSlice';
// import API from '@/utils/api';
// import { SearchedUser } from '@/types/SearchUser.type';
// import { useDebounce, useClickOutside } from '@/hooks/navHooks';

// export const NavBar = () => {
//     const router = useRouter();
//     const pathname = usePathname();
//     const dispatch = useAppDispatch();
//     const { user } = useAppSelector((state) => state.auth);

//     const inputRef = useRef<HTMLInputElement>(null);
//     const profileMenuRef = useRef<HTMLDivElement>(null);
//     const searchResultsRef = useRef<HTMLDivElement>(null);
//     const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
//     const [searchText, setSearchText] = useState<string>('');
//     const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
//     const [searchResults, setSearchResults] = useState<SearchedUser[] | null>(null);
//     const [searchLoading, setSearchLoading] = useState<boolean>(false);
//     const [searchError, setSearchError] = useState<string | null>(null);

//     const debouncedSearchText = useDebounce(searchText, 300);
//     const defaultDp = "/def.png";

//     useEffect(() => {
//         const fetchSearchResults = async () => {
//             if (debouncedSearchText) {
//                 setSearchLoading(true);
//                 setSearchError(null);
//                 try {
//                     const response = await API.get(`/user/search?query=${debouncedSearchText}`);
//                     setSearchResults(response.data.users);
//                 } catch (err: any) {
//                     setSearchError(err.message || "An error occurred");
//                     setSearchResults(null);
//                 } finally {
//                     setSearchLoading(false);
//                 }
//             } else {
//                 setSearchResults(null);
//                 setSearchError(null);
//             }
//         };
//         fetchSearchResults();
//     }, [debouncedSearchText]);

//     const handleLogout = async () => {
//         try {
//             await API.post('/auth/logout');
//             dispatch(setLoggedOut());
//             router.push('/auth/login');
//         } catch (error) {
//             console.error("Failed to log out:", error);
//         } finally {
//             setShowProfileMenu(false);
//         }
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchText(e.target.value);
//     };

//     const handleSearchIconClick = () => {
//         setShowSearchInput(prev => !prev);
//         if (!showSearchInput) {
//             setSearchText('');
//             setSearchResults(null);
//             setShowProfileMenu(false);
//         }
//     };

//     const handleNavIconClick = () => {
//         if (showSearchInput) {
//             setShowSearchInput(false);
//             setSearchText('');
//             setSearchResults(null);
//         }
//         setShowProfileMenu(false);
//     };

//     const handleProfileClick = () => {
//         setShowProfileMenu(prev => !prev);
//         if (showSearchInput) {
//             setShowSearchInput(false);
//             setSearchText('');
//             setSearchResults(null);
//         }
//     };

//     const clearSearch = useCallback(() => {
//         setSearchText('');
//         setSearchResults(null);
//         setShowSearchInput(false);
//     }, []);

//     useEffect(() => {
//         if (showSearchInput && inputRef.current) {
//             inputRef.current.focus();
//         }
//     }, [showSearchInput]);

//     useClickOutside([inputRef, searchResultsRef], clearSearch);
//     useClickOutside([profileMenuRef], () => setShowProfileMenu(false));

//     const showResultsDropdown = searchText.length > 0;
//     const profilePath = `/home/profile/${user?._id}`;

//  return (
//    <>
//      <nav className="z-50 px-4 py-3 text-white shadow-cyan-800 shadow-lg NavBg h-[75px]">
//        <div className="mx-auto flex items-center justify-between flex-wrap gap-4">
//          {/* Logo */}
//          <Link
//            href="/home"
//            className="text-2xl sm:text-3xl font-medium bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
//            onClick={clearSearch}
//          >
//            Waves
//          </Link>

//          {/* Nav Icons */}
//          <div className="flex items-center space-x-4 sm:space-x-6 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-full py-2 px-4 overflow-x-auto">
//            <Link
//              href="/home"
//              className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
//                pathname === "/home" ? "bg-[rgb(0,12,60)]" : ""
//              }`}
//              aria-label="Home"
//              onClick={handleNavIconClick}
//            >
//              <AiFillHome className="h-6 w-6" />
//            </Link>

//            {/* Search */}
//            <div className="flex items-center relative">
//              {/* Animated Input Container */}
//              <div
//                className={`transition-all duration-200 ease-in-out ${
//                  showSearchInput
//                    ? "w-48 opacity-100"
//                    : "w-0 opacity-0 overflow-hidden"
//                }`}
//              >
//                <div className="relative w-full">
//                  <input
//                    ref={inputRef}
//                    type="text"
//                    placeholder="Search users..."
//                    className="w-full p-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgb(0,12,60)] pl-4 pr-8"
//                    value={searchText}
//                    onChange={handleSearchChange}
//                  />
//                  {/* Clear Button Positioned Relative to Input */}
//                  {showSearchInput  && (
//                    <button
//                      onClick={clearSearch}
//                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
//                      aria-label="Clear search"
//                    >
//                      <AiOutlineClose className="h-5 w-5" />
//                    </button>
//                  )}
//                </div>
//              </div>

//              {/* Search Icon Button */}
//              <button
//                onClick={handleSearchIconClick}
//                className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
//                  showSearchInput ? "ml-2 hidden" : ""
//                }`}
//                aria-label="Toggle Search"
//              >
//                <AiOutlineSearch className="h-6 w-6" />
//              </button>
//            </div>

//            <Link
//              href={profilePath}
//              className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
//                pathname === profilePath ? "bg-[rgb(0,12,60)]" : ""
//              }`}
//              aria-label="Profile"
//              onClick={handleNavIconClick}
//            >
//              <AiOutlineUser className="h-6 w-6" />
//            </Link>
//            <Link
//              href="/home/notifications"
//              className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
//                pathname === "/home/notifications" ? "bg-[rgb(0,12,60)]" : ""
//              }`}
//              aria-label="Notifications"
//              onClick={handleNavIconClick}
//            >
//              <AiOutlineBell className="h-6 w-6" />
//            </Link>
//            <Link
//              href="/home/create"
//              className={`p-2 rounded-full hover:bg-[rgb(0,12,60)] transition duration-200 ${
//                pathname === "/home/create" ? "bg-[rgb(0,12,60)]" : ""
//              }`}
//              aria-label="Create Post"
//              onClick={handleNavIconClick}
//            >
//              <AiOutlinePlusCircle className="h-6 w-6" />
//            </Link>
//          </div>

//          {/* Profile Section */}
//          <div className="relative flex items-center" ref={profileMenuRef}>
//            <span className="font-semibold text-lg hidden md:block pr-2">
//              {user?.name}
//            </span>
//            <button
//              className="rounded-full focus:outline-none"
//              onClick={handleProfileClick}
//              aria-label="Open Profile Menu"
//            >
//              <img
//                src={user?.dp || defaultDp}
//                alt={user?.name}
//                className="w-10 h-10 rounded-full border border-black object-cover"
//                onError={(e) => {
//                  e.currentTarget.src = defaultDp;
//                }}
//              />
//            </button>

//            {showProfileMenu && (
//              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 bg-opacity-95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden z-50">
//                <Link
//                  href={profilePath}
//                  onClick={() => setShowProfileMenu(false)}
//                  className="flex items-center p-3 hover:bg-gray-700 transition-colors duration-200"
//                >
//                  <img
//                    src={user?.dp || defaultDp}
//                    alt={user?.name || "User"}
//                    className="w-8 h-8 rounded-full object-cover mr-2"
//                    onError={(e) => {
//                      e.currentTarget.src = defaultDp;
//                    }}
//                  />
//                  <span className="text-white font-medium">Profile</span>
//                </Link>
//                <button
//                  onClick={handleLogout}
//                  className="w-full text-left p-3 hover:bg-gray-700 transition-colors duration-200 text-white flex items-center"
//                >
//                  <AiOutlineLogout className="h-5 w-5 mr-2" /> Logout
//                </button>
//              </div>
//            )}
//          </div>
//        </div>
//      </nav>

//      {/* Search Results Dropdown */}
//      {showResultsDropdown && (
//        <div
//          className="absolute top-20 left-0 right-0 z-40 bg-[rgb(0,7,35)] p-4 pt-8 shadow-lg max-h-80 overflow-y-auto md:max-w-md mx-auto rounded-b-lg"
//          ref={searchResultsRef}
//        >
//          {searchLoading && (
//            <p className="text-center text-white py-4">Loading...</p>
//          )}
//          {searchError && (
//            <p className="text-center text-red-400 py-4">
//              Error fetching users.
//            </p>
//          )}
//          {searchResults && searchResults.length > 0 ? (
//            <div className="max-w-md mx-auto">
//              {searchResults.map((result) => (
//                <Link
//                  href={`/home/profile/${result._id}`}
//                  key={result._id}
//                  onClick={clearSearch}
//                >
//                  <div className="flex items-center p-3 rounded-lg hover:bg-[rgb(10,20,50)] transition-colors duration-200 cursor-pointer mb-2">
//                    <img
//                      src={result.dp || defaultDp}
//                      alt={result.name}
//                      className="w-10 h-10 rounded-full object-cover mr-3"
//                      onError={(e) => {
//                        e.currentTarget.src = defaultDp;
//                      }}
//                    />
//                    <div>
//                      <p className="font-semibold text-white">{result.name}</p>
//                      <p className="text-sm text-gray-400">{result.email}</p>
//                    </div>
//                  </div>
//                </Link>
//              ))}
//            </div>
//          ) : (
//            !searchLoading &&
//            !searchError && (
//              <p className="text-center text-gray-400 py-4">No user found.</p>
//            )
//          )}
//        </div>
//      )}
//    </>
//  );

// };
