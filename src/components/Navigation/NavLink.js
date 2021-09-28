import "./styles.css";

const NavLink = ({ to, label, className }) => (
  <a href={to} className={className}>
    {label}
  </a>
);

export default NavLink;
