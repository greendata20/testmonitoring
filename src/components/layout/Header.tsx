import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiLayers, 
  FiBarChart, 
  FiSettings, 
  FiMenu,
  FiX,
  FiGlobe,
  FiSun,
  FiMoon 
} from 'react-icons/fi';
import { Button, StatusBadge } from '../ui';
import { useAppStore } from '../../stores/useAppStore';
import { clsx } from 'clsx';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { sidebar, isLoading } = useAppStore();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-lg"
    >
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left section - Logo & Navigation */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            {sidebar.isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </Button>
          
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-climate-400 to-climate-600 rounded-xl flex items-center justify-center">
              <FiGlobe className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-climate-600 to-climate-800 bg-clip-text text-transparent">
                Climate Urban Planner
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                AI-Powered Urban Climate Solutions
              </p>
            </div>
          </motion.div>
        </div>

        {/* Center section - Quick navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant={sidebar.activePanel === 'layers' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon={<FiLayers size={16} />}
            onClick={() => useAppStore.getState().setSidebarState({ activePanel: 'layers', isOpen: true })}
          >
            Layers
          </Button>
          <Button
            variant={sidebar.activePanel === 'analytics' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon={<FiBarChart size={16} />}
            onClick={() => useAppStore.getState().setSidebarState({ activePanel: 'analytics', isOpen: true })}
          >
            Analytics
          </Button>
          <Button
            variant={sidebar.activePanel === 'planning' ? 'primary' : 'ghost'}
            size="sm"
            leftIcon={<FiSettings size={16} />}
            onClick={() => useAppStore.getState().setSidebarState({ activePanel: 'planning', isOpen: true })}
          >
            Planning
          </Button>
        </div>

        {/* Right section - Status & Controls */}
        <div className="flex items-center space-x-3">
          <StatusBadge
            status={isLoading ? 'loading' : 'online'}
            size="sm"
            className="hidden sm:inline-flex"
          >
            {isLoading ? 'Loading' : 'Ready'}
          </StatusBadge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="hidden sm:flex"
          >
            {isDarkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
          </Button>
          
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-climate-400 to-climate-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span className="text-white text-sm font-bold">A</span>
          </div>
        </div>
      </div>
      
      {/* Progress bar for loading */}
      {isLoading && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-climate-400 to-climate-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.header>
  );
};