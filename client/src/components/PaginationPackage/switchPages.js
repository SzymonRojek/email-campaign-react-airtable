const paginNumbers = (lastPage, currentPage, setCurrentPage) => {
  const arrayToMap = [...Array(lastPage + 1).keys()];
  return arrayToMap.map((el, i) => {
    if (lastPage <= 7 && i >= 1) {
      return (
        <span
          onClick={() => setCurrentPage(i)}
          key={el + i}
          className={currentPage === i ? "activeClass" : ""}
        >
          {i}
        </span>
      );
    }

    // FROM 1-4 (4 FIRST DIGITS) PATTERN
    if (currentPage >= 1 && currentPage <= 4) {
      if (i === 5) {
        return (
          <span onClick={() => setCurrentPage(i)} key={el + i}>
            {i}
          </span>
        );
      }

      if (i === 6) {
        return (
          <span
            //onClick=false
            key={el + i}
            className="pagination-dots"
            style={{}}
          >
            ...
          </span>
        );
      }

      if (i === 7) {
        return (
          <span onClick={() => setCurrentPage(lastPage)} key={el + i}>
            {lastPage}
          </span>
        );
      }

      if (i >= 1 && i <= 4) {
        return (
          <span
            onClick={() => setCurrentPage(i)}
            key={el + i}
            className={currentPage === i ? "activeClass" : ""}
          >
            {i}
          </span>
        );
      }
    }

    //3 MIDDLE DIGITS PATTERN
    if (currentPage >= 5 && currentPage <= lastPage - 4) {
      if (i === 1) {
        return (
          <span onClick={() => setCurrentPage(i)} key={el + i}>
            {i}
          </span>
        );
      }
      if (i === 2) {
        return (
          <span
            //onClick=false
            key={el + i}
            className="pagination-dots"
          >
            ...
          </span>
        );
      }

      if (i === 3) {
        return (
          <span
            onClick={() => setCurrentPage(currentPage - 1)}
            key={el + i - 1}
          >
            {currentPage - 1}
          </span>
        );
      }

      // ADD ACTIVE CLASS
      if (i === 4) {
        return (
          <span
            className={
              currentPage >= 5 && currentPage <= lastPage - 4
                ? "activeClass"
                : ""
            }
            key={el + i}
          >
            {currentPage}
          </span>
        );
      }

      if (i === 5) {
        return (
          <span
            onClick={() => setCurrentPage(currentPage + 1)}
            key={el + i - 1}
          >
            {currentPage + 1}
          </span>
        );
      }

      if (i === 6) {
        return (
          <span
            //onClick=false
            key={el + i}
            className="pagination-dots"
          >
            ...
          </span>
        );
      }

      if (i === 7) {
        return (
          <span
            onClick={() => setCurrentPage(lastPage - 3 + (i - 4))}
            key={el + i}
          >
            {lastPage - 3 + (i - 4)}
          </span>
        );
      }
    }

    // 3 LAST DIGITS PATTERN
    if (currentPage >= lastPage - 3 && currentPage <= lastPage) {
      if (i === 1) {
        return (
          <span onClick={() => setCurrentPage(i)} key={el + i}>
            {i}
          </span>
        );
      }

      if (i === 2) {
        return (
          <span
            //onClick=false
            key={el + i}
            className="pagination-dots"
          >
            ...
          </span>
        );
      }

      if (i === 3) {
        return (
          <span onClick={() => setCurrentPage(lastPage - 4)} key={el + i}>
            {lastPage - 4}
          </span>
        );
      }

      if (i >= 4 && i <= 7) {
        return (
          <span
            onClick={() => setCurrentPage(lastPage - 3 + (i - 4))}
            key={el + i}
            className={
              currentPage === lastPage - 3 + (i - 4) ? " activeClass" : ""
            }
          >
            {lastPage - 3 + (i - 4)}
          </span>
        );
      }
    }

    return null;
  });
};

export default paginNumbers;
