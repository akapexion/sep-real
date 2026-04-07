// src/Dashboard/pages/Navbar.jsx
import React from 'react';
import NavbarSection from '../components/NavbarSection';

const Navbar = ({ logout, user, toggleTheme, isDark }) => (
  <NavbarSection logout={logout} user={user} toggleTheme={toggleTheme} isDark={isDark} />
);

export default Navbar;