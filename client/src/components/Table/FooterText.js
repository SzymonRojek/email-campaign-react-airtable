const styles = {
  footerContainer: {
    textAlign: "center",
    padding: 20,
  },
  text: { fontSize: 24 },
  status: { fontWeight: "bold" },
};

const FooterText = ({ status, text }) => (
  <footer style={styles.footerContainer}>
    <p style={styles.text}>
      {text}
      <span style={styles.status}> {`${status}`} </span>
    </p>
  </footer>
);

export default FooterText;
