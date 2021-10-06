const setTextPopup = (status, subscriber, callback) => {
  status === "pending"
    ? callback({
        title: "Oh no!",
        text: `${subscriber}'s status is pending at the moment. Please wait until the status will be confirmed by admin.`,
      })
    : status === "blocked"
    ? callback({
        title: "Unfortunately...",
        text: `${subscriber}'s status is blocked. You can not get an access to more details.`,
      })
    : callback("");
};

export default setTextPopup;
