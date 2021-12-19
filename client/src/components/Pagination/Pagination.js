import "./styles.css";

const Pagination = ({
  subscribersPerPage,
  totalSubscribers,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalSubscribers / subscribersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      className="slider"
      style={{ display: totalSubscribers < 3 ? "none" : "flex" }}
    >
      <button className="slider-button">back</button>
      <div className="slider-pages">
        {pageNumbers.map((number) => (
          <li
            key={number}
            onClick={(e) => {
              paginate(number);
              e.preventDefault();
            }}
            style={{
              listStyle: "none",
              display: "flex",
            }}
          >
            <a
              href="!#"
              className="slider-link"
              style={{
                color: "white",
                backgroundColor: currentPage === number ? "orange" : "#142f43",
              }}
            >
              {number}
            </a>
          </li>
        ))}
      </div>
      <button className="slider-button">prev</button>
    </div>
  );
};

export default Pagination;
