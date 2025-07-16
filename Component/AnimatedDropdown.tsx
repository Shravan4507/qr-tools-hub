import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedList from './AnimatedList';
import './AnimatedDropdown.css';

interface DropdownOption {
  value: string;
  label: string;
}

interface AnimatedDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function AnimatedDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = ''
}: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownError, setDropdownError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: string, index: number) => {
    try {
      onChange(options[index].value);
      setIsOpen(false);
      setDropdownError(null);
    } catch (err) {
      setDropdownError('Failed to select option. Please try again.');
    }
  };

  return (
    <div ref={dropdownRef} className={`animated-dropdown ${className}`}>
      <motion.button
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        tabIndex={0}
        aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className="dropdown-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.span
          className="dropdown-arrow"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>
      {dropdownError && (
        <div role="alert" style={{ color: '#b71c1c', fontSize: '0.95em', marginTop: 4 }}>{dropdownError}</div>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatedList
              items={options.map(option => option.label)}
              onItemSelect={handleSelect}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
              className="dropdown-list"
              itemTabIndex={0}
              itemAriaLabelPrefix="Select option: "
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 