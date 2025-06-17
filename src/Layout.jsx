import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';
import SearchBar from '@/components/molecules/SearchBar';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const visibleRoutes = Object.values(routes).filter(route => !route.hidden);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`flex-shrink-0 border-b border-gray-200 z-40 transition-all duration-200 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Home" size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold font-display text-primary">EstateView</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {visibleRoutes.map(route => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10 font-medium'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <SearchBar />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
            >
              <ApperIcon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>

          {/* Search Bar - Mobile */}
          <div className="lg:hidden pb-4">
            <SearchBar />
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 md:hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  {visibleRoutes.map(route => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'text-primary bg-primary/10 font-medium'
                            : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} size={20} />
                      <span>{route.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {visibleRoutes.map(route => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600'
                }`
              }
            >
              <ApperIcon name={route.icon} size={20} />
              <span className="text-xs font-medium">{route.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;