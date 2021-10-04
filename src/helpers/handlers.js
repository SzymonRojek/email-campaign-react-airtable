const handleRowClick = (subscriber, history) =>
  subscriber.fields.status === "active"
    ? history.push(`/subscribers/${subscriber.id}`)
    : "";

const handleOpenPopup = (subscriber, callback) =>
  subscriber.fields.status === "pending" ||
  subscriber.fields.status === "blocked"
    ? callback(true)
    : null;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  handleRowClick,
  handleOpenPopup,
};
