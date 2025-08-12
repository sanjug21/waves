'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiFillHome, AiOutlineSearch, AiOutlineBell, AiOutlinePlusCircle, AiOutlineLogout } from 'react-icons/ai';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoggedOut } from '@/store/slices/authSlice';
import API from '@/utils/api';
import { toast } from 'react-toastify';

export const NavBar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]); // You'll need to fetch and populate this

  const defaultDp = "/def.png";

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
      dispatch(setLoggedOut());
      router.push('/auth/login');
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error('Logout failed. Please try again.');
    } finally {
      setShowProfileMenu(false);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchText(term);

    // Placeholder for search logic
    if (term.length > 0) {
      // Fetch search results from your API
      // const response = await API.get(`/search?q=${term}`);
      // setSearchResults(response.data);
      // setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchIconClick = () => {
    setShowSearchInput(prev => !prev);
    if (!showSearchInput) {
      setSearchText('');
      setShowSearchResults(false);
      setShowProfileMenu(false);
    }
  };

  const handleNavIconClick = () => {
    if (showSearchInput) {
      setShowSearchInput(false);
      setSearchText('');
      setShowSearchResults(false);
    }
    setShowProfileMenu(false);
  };

  const handleProfileClick = () => {
    setShowProfileMenu(prev => !prev);
    if (showSearchInput) {
      setShowSearchInput(false);
      setSearchText('');
      setShowSearchResults(false);
    }
  };

  useEffect(() => {
    if (showSearchInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        if (searchText.trim() === '') {
          setShowSearchInput(false);
        }
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef, searchText, profileMenuRef, searchResultsRef]);

 

  return (
    <>
      <nav className="z-50 p-3 text-white shadow-cyan-800 shadow-lg">
        <div className="mx-auto flex items-center justify-between">
          <Link href="/home" className="text-3xl font-medium bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Waves
          </Link>

          <div className="flex items-center space-x-6 sm:space-x-8 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-full py-2 px-4">
            <Link href="/home" className="p-2 rounded-full hover:bg-blue-600 transition-all duration-200" aria-label="Home" onClick={handleNavIconClick}>
              <AiFillHome className="h-6 w-6 text-white" />
            </Link>

            <div className="flex items-center">
              <div className={`relative flex items-center transition-all duration-100 ease-linear ${showSearchInput ? 'w-48 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search users..."
                  className="w-full p-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                  value={searchText}
                  onChange={handleSearchChange}
                  onFocus={() => { if(searchText.trim().length > 0) setShowSearchResults(true); }}
                />
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={handleSearchIconClick}
                className={`p-2 rounded-full hover:bg-blue-600 transition-all duration-200 ${showSearchInput ? 'ml-2' : ''}`}
                aria-label="Toggle Search"
              >
                <AiOutlineSearch className="h-6 w-6 text-white" />
              </button>
            </div>

            <Link href="/home/notifications" className="p-2 rounded-full hover:bg-blue-600 transition-all duration-200" aria-label="Notifications" onClick={handleNavIconClick}>
              <AiOutlineBell className="h-6 w-6 text-white" />
            </Link>
            <Link href="/home/create" className="p-2 rounded-full hover:bg-blue-600 transition-all duration-200" aria-label="Create Post" onClick={handleNavIconClick}>
              <AiOutlinePlusCircle className="h-6 w-6 text-white" />
            </Link>
          </div>

          <div className="relative flex items-center" ref={profileMenuRef}>
            <span className="font-semibold text-lg hidden md:block pr-2">{user?.name}</span>
            <button className="rounded-full focus:outline-none" onClick={handleProfileClick} aria-label="Open Profile Menu">
              <img
                src={user?.dp || defaultDp}
                alt={user?.name}
                className="w-10 h-10 rounded-full border border-black object-cover"
                onError={(e) => { e.currentTarget.src = defaultDp; }}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 bg-opacity-95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden z-50">
                <Link href={`/home/profile/${user?._id}`} onClick={() => setShowProfileMenu(false)} className="flex items-center p-3 hover:bg-gray-700 transition-colors duration-200">
                  <img
                    src={user?.dp || defaultDp}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover mr-2"
                    onError={(e) => { e.currentTarget.src = defaultDp; }}
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
      {showSearchResults && (
        <div className="absolute top-[80px] left-0 right-0 z-40 bg-white p-4 pt-8 shadow-lg max-h-80 overflow-y-auto md:max-w-md mx-auto rounded-b-lg" ref={searchResultsRef}>
          {searchResults.length > 0 ? (
            <div className="max-w-md mx-auto">
              {searchResults.map((result) => (
                <Link href={`/home/profile/${result._id}`} key={result._id}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSearchResults(false);
                  setSearchText('');
                  setSearchResults([]);
                  setShowSearchInput(false);
                }}
                >
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer mb-2">
                    <img
                      src={result.dp || defaultDp}
                      alt={result.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                      onError={(e) => { e.currentTarget.src = defaultDp; }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{result.name}</p>
                      <p className="text-sm text-gray-500">{result.email}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-4">
              No user found.
            </div>
          )}
        </div>
      )}
    </>
  );
};
