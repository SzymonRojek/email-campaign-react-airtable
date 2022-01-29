const styles = {
  footerContainer: {
    textAlign: "center",
    padding: 20,
  },
  text: { fontSize: 24 },
  active: { color: "green", fontWeight: "bold", letterSpacing: 2 },
  pending: { color: "orange", fontWeight: "bold", letterSpacing: 2 },
  blocked: { color: "crimson", fontWeight: "bold", letterSpacing: 2 },
};

const FooterText = ({ status, text }) => (
  <footer style={styles.footerContainer}>
    <p style={styles.text}>
      {text}
      <span
        style={
          status === "active"
            ? styles.active
            : status === "pending"
            ? styles.pending
            : styles.blocked
        }
      >
        {`${status}`}
      </span>
    </p>
  </footer>
);

export default FooterText;
