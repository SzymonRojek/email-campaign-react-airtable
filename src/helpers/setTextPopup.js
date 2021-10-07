const setTextPopup = (status, subscriber, callback) => {
  status === "pending"
    ? callback({
        title: "Please wait...",
        text: `${subscriber}'s status is pending at the moment - subscription has to be confirmed by an admin.`,
      })
    : status === "blocked"
    ? callback({
        title: "Unfortunately...",
        text: `${subscriber}'s status is blocked - can not get an access to more details.`,
      })
    : callback("");
};

export default setTextPopup;
