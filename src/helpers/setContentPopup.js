const setContentPopup = (status, subscriber, callback) => {
  if (!subscriber) return;

  status === "pending"
    ? callback({
        title: "Please wait...",
        text: `${subscriber}'s status is pending at the moment - subscription has to be confirmed by an admin.`,
        colorButton: "error",
      })
    : status === "blocked"
    ? callback({
        title: "Unfortunately...",
        text: `${subscriber}'s status is blocked - can not get an access to more details.`,
        colorButton: "error",
      })
    : callback("");
};

export default setContentPopup;
