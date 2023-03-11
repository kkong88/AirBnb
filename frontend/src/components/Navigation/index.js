import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import Icon from '../Logo';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navBar'>
        <NavLink exact to="/"> <Icon /> </NavLink>
      <ul className='profile'>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      {(!sessionUser) || (
      <li>
      <NavLink exact to='/spots'> Create a New Spot</NavLink>
      </li>
      )}
     </ul>
    </div>
  );
}

export default Navigation;
