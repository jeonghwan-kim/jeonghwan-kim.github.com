import React from 'react';
import './nav.scss';
import { Link } from 'gatsby';

interface P {
  title: string;
  icon: string;
  to?: string;
  onClick?: ()=>void;
}

const Nav: React.FC<P> = ({title, icon, to, onClick}) => {
  return (
    <li className="site-nav">
      <Link className="flex" to={`${to || '#'}`} onClick={(e)=> {
        if (!to && onClick) {
          e.preventDefault();
          onClick();
          return;
        }
      }}>
        <i className={`icon icon-3x icon-${icon}`}></i>
        <span className="nav-title">{title}</span>
      </Link>
    </li>
  )
}

export default Nav;