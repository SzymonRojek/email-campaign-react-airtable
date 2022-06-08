import PropTypes from "prop-types";

import { stylesFooter } from "./styles";

const FooterText = ({ status, text }) => (
  <footer style={stylesFooter.footerContainer}>
    <p style={stylesFooter.text}>
      {text}
      <span
        style={
          status === "active"
            ? stylesFooter.active
            : status === "pending"
            ? stylesFooter.pending
            : stylesFooter.blocked
        }
      >
        {`${status}`}
      </span>
    </p>
  </footer>
);

FooterText.propTypes = {
  status: PropTypes.string,
  text: PropTypes.string,
};

export default FooterText;
