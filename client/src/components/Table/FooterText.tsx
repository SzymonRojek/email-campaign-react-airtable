import { stylesFooter } from "./styles";

interface FooterTextProps {
  status: string;
  text: string;
}

const FooterText = ({ status, text }: FooterTextProps) => (
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

export default FooterText;
