import React, { useEffect, useState, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft, FaTimes, FaHistory } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

function Search() {
  const navigate = useNavigate();
  const locate = useLocation();
  const [isSearch, setIsSearch] = useState(false);
  const handleScreen = useMobile();
  const location = useLocation();
  const inputText = location.search.slice(3);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const search = locate.pathname === "/search";
    setIsSearch(search);
  }, [locate]);

  // Save recent searches to local storage
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearch = () => {
    navigate("/search");
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // State for search suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Fetch search suggestions from API
  const fetchSuggestions = async (query) => {
    // Ensure we have at least one character to search
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    try {
      const response = await fetch(`/api/product/search-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Even with single character, search with higher limit to ensure we get results
        body: JSON.stringify({ search: query, limit: 10 }),
      });
      
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        // Process and filter the results for better recommendations
        const results = data.data.map(item => ({
          id: item._id,
          name: item.name,
          image: item.image?.[0] || '',
          category: item.category?.[0]?.name || 'Fashion'
        }));
        
        // For single character search, prioritize items that have the character prominently in the name
        if (query.length === 1) {
          // Sort items so that ones with the query character appear prominently
          results.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const queryChar = query.toLowerCase();
            
            // First priority: words that start with the character
            const aWords = aName.split(/\s+/);
            const bWords = bName.split(/\s+/);
            const aStartsWithQuery = aWords.some(word => word.startsWith(queryChar));
            const bStartsWithQuery = bWords.some(word => word.startsWith(queryChar));
            
            if (aStartsWithQuery && !bStartsWithQuery) return -1;
            if (!aStartsWithQuery && bStartsWithQuery) return 1;
            
            // Second priority: check how many times the character appears
            const aCount = (aName.match(new RegExp(queryChar, 'g')) || []).length;
            const bCount = (bName.match(new RegExp(queryChar, 'g')) || []).length;
            
            return bCount - aCount; // Higher count first
          });
        }
        
        return results;
      }
      
      // If no results are found, return a special message
      return [{
        id: 'error',
        name: 'No matching products',
        category: `Try a different search term than "${query}"`
      }];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [{
        id: 'error',
        name: 'Search error',
        category: 'Please try again'
      }];
    }
  };

  // Use ref for debounce to avoid stale closures
  const timeoutRef = useRef(null);
  
  const handleOnchange = (e) => {
    const value = e.target.value;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (value.length >= 1) {
      navigate("/search?q=" + value);
      
      // Immediately show "Searching..." placeholder
      setSuggestions([{ id: 'loading', name: 'Searching...', category: '' }]);
      setShowSuggestions(true);
      
      // For single character inputs, use a very short debounce
      const debounceTime = value.length === 1 ? 50 : 150;
      
      timeoutRef.current = setTimeout(async () => {
        try {
          const results = await fetchSuggestions(value);
          setSuggestions(results);
          setShowSuggestions(true); // Always show suggestions dropdown
          
          // Add to recent searches for single character with matches
          if (value.length === 1 && results.length > 0 && results[0].id !== 'error') {
            // We found good matches for a single character - highlight this in the UI
            console.log(`Found ${results.length} matches for character "${value}"`);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([{ id: 'error', name: 'No results found', category: 'Try a different search term' }]);
        }
      }, debounceTime); // Use dynamic debounce time based on input length
    } else {
      navigate("/search");
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };
  
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && inputText.trim()) {
      // Save to recent searches (avoid duplicates)
      if (!recentSearches.includes(inputText) && inputText.trim()) {
        setRecentSearches(prev => [inputText, ...prev.slice(0, 4)]); // Keep only last 5
      }
    }
  };
  
  const clearSearch = () => {
    navigate("/search");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchContainerRef}
      className={`w-full h-10 lg:h-12 rounded-full flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
        isFocused ? "search-focused" : ""
      }`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div>
        {isSearch && handleScreen ? (
          <Link
            to={"/"}
            className="flex items-center justify-center h-full p-4 text-gray-600 hover:text-black transition-colors"
          >
            <FaArrowLeft size={18} className="search-icon" />
          </Link>
        ) : (
          <button className="flex items-center justify-center h-full p-4 text-gray-600 hover:text-black transition-colors">
            <IoSearch size={18} className="search-icon search-animate" />
          </button>
        )}
      </div>

      <div className="flex-1 h-full w-full relative">
        {isSearch ? (
          <div className="w-full h-full flex items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search fashion items, brands, styles..."
              className="w-full h-full outline-none px-2 bg-transparent text-gray-900 placeholder-gray-500 search-input"
              autoFocus={true}
              defaultValue={inputText}
              onChange={handleOnchange}
              onKeyDown={handleSearchSubmit}
            />
            {inputText && (
              <button 
                onClick={clearSearch} 
                className="absolute right-2 text-gray-400 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaTimes size={14} />
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={handleSearch}
            className="flex-1 h-full lg:py-3 py-2 cursor-text px-2 flex items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "Summer Collection"',
                1000,
                'Search "New Arrivals"',
                1000,
                'Search "Trending Styles"',
                1000,
                'Search "Casual Wear"',
                1000,
                'Search "Fashion Deals"',
                1000,
              ]}
              speed={50}
              repeat={Infinity}
              className="text-gray-500 search-typewriter"
            />
          </div>
        )}
        
        {/* Search Suggestions Dropdown - Shows when typing */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2 max-h-72 overflow-auto search-suggestions-dropdown">
            <div className="px-3 py-1 text-xs text-gray-500 font-medium border-b border-gray-100">
              {suggestions[0]?.id === 'loading' ? 'Searching...' : 'Product Suggestions'}
            </div>
            
            {suggestions[0]?.id === 'loading' ? (
              <div className="px-3 py-4 flex items-center justify-center">
                <div className="animate-pulse flex space-x-3">
                  <div className="rounded-md bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : suggestions.length > 0 && suggestions[0]?.id !== 'error' ? (
              <>
                {/* If it's a single character search, show a helpful header */}
                {inputText?.length === 1 && (
                  <div className="px-3 py-1 text-xs font-medium bg-gray-50 text-gray-700 border-b border-gray-100">
                    Showing products containing "{inputText}"
                  </div>
                )}
                
                {suggestions.map((item) => {
                  // Display the name without highlighting
                  const displayName = item.name;
                  
                  return (
                    <Link 
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="px-3 py-2 hover:bg-gray-50 flex items-center gap-3 cursor-pointer text-sm border-b border-gray-100 last:border-0 transition duration-200"
                      onClick={() => setShowSuggestions(false)}
                    >
                      {item.image ? (
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                          <IoSearch size={16} />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{displayName}</span>
                        <span className="text-xs text-gray-500">{item.category}</span>
                      </div>
                    </Link>
                  );
                })}
              </>
            ) : (
              <div className="px-3 py-3 text-center">
                <p className="text-sm text-gray-500">No matching products found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}
        
        {/* Recent Searches Dropdown - Show only when focused and on search page */}
        {isFocused && isSearch && recentSearches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2 max-h-60 overflow-auto recent-searches-dropdown">
            <div className="px-3 py-1 text-xs text-gray-500 font-medium border-b border-gray-100">
              Recent Searches
            </div>
            {recentSearches.map((search, index) => (
              <div 
                key={index}
                className="px-3 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-sm"
                onClick={() => {
                  navigate("/search?q=" + search);
                  if (inputRef.current) {
                    inputRef.current.value = search;
                  }
                }}
              >
                <FaHistory className="text-gray-400" size={12} />
                <span>{search}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add some styling for enhanced animations */}
      <style jsx>{`
        .search-icon {
          transition: all 0.3s ease;
        }
        
        .search-focused .search-icon {
          color: black;
          transform: scale(1.1);
        }
        
        .search-animate {
          animation: pulse 2s infinite ease-in-out;
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        .search-typewriter {
          border-right: 2px solid transparent;
          animation: blink-caret 0.75s step-end infinite;
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #666; }
        }
        
        .recent-searches-dropdown,
        .search-suggestions-dropdown {
          animation: slideDown 0.2s ease-out forwards;
          transform-origin: top center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          z-index: 100;
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-10px) scale(0.97);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Loading animation for search suggestions */
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: 200px 0;
          }
        }
        
        .animate-pulse div {
          background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
          background-repeat: no-repeat;
          background-size: 800px 100%;
          animation: shimmer 1.5s infinite linear;
        }
        
        /* Style enhancements for keyboard navigation */
        .search-input:focus {
          outline: none;
          box-shadow: none;
        }
        
        /* Smooth hover transitions for suggestion items */
        .search-suggestions-dropdown a:hover,
        .recent-searches-dropdown div:hover {
          background-color: rgba(243, 244, 246, 0.8);
          transform: translateX(3px);
        }
        
        .search-suggestions-dropdown a,
        .recent-searches-dropdown div {
          transition: all 0.15s ease-out;
        }
        
        /* Ensure visibility of dropdown */
        .search-suggestions-dropdown,
        .recent-searches-dropdown {
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
}

export default Search;
