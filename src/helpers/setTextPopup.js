const setTextPopup = (status, subscriber, callback) => {
  status === "pending"
    ? callback(
        `${subscriber}'s status is pending at the moment. Please wait until the status will be confirmed by admin.`
      )
    : status === "blocked"
    ? callback(
        `${subscriber}'s status is blocked. You can not get an access to more details.`
      )
    : callback("");
};

export default setTextPopup;
