import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="logo">ETK</div>
            <nav>
                <Link className="link-to-meetings" to="/meeting">Meeting</Link>
            </nav>
        </header>
    );
};

export default Header;