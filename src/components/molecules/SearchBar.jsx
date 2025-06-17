import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SearchBar = ({ onSearch, placeholder = "Search by location..." }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative flex w-full max-w-2xl"
    >
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <ApperIcon 
            name="Search" 
            size={18} 
            className={`transition-colors duration-200 ${
              focused ? 'text-primary' : 'text-gray-400'
            }`}
          />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-4 py-3 border-2 rounded-l-lg transition-all duration-200
            ${focused ? 'border-primary' : 'border-gray-300'}
            focus:border-primary focus:outline-none bg-white
          `}
        />
      </div>
      <Button 
        type="submit"
        className="rounded-l-none border-l-0"
        icon="Search"
      >
        <span className="hidden sm:inline">Search</span>
      </Button>
    </motion.form>
  );
};

export default SearchBar;