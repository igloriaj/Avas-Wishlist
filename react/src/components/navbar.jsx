import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <NavLink to="/">Ava's Wishlist!</NavLink>
        <NavLink to="/create">New Item</NavLink>
      </nav>
    </div>
  )
}