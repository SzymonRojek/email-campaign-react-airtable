import PropTypes from "prop-types";
import { useCallback, useEffect } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import usePagination from "./usePagination";
import paginNumbers from "./switchPages";

import "./styles.css";

const CustomPaginator = ({
  passedData,
  dataPerPage,
  disableDuration,
  disableArrows,
  disableDigits,
  renderData,
}) => {
  const {
    paginatedData,
    paginatorStatus: {
      actualPage,
      setActualPage,
      lastPage,
      pages,
      handleNextPage,
      handlePreviousPage,
      handleSpecificPage,
      disablePaginator,
      disablePrevBtn,
      disableNextBtn,
    },
    setDisablePaginator,
  } = usePagination(passedData, dataPerPage, disableDuration);

  // when the last element on the last page is deleted go to the prev page
  useEffect(() => {
    if (lastPage && paginatedData.length === 0)
      setActualPage((prev) => (prev !== 1 ? prev - 1 : prev));
  }, [pages, lastPage, paginatedData.length, setActualPage]);

  const handleClick = useCallback(
    (activePage) => {
      handleSpecificPage(Number(activePage));
    },
    [handleSpecificPage]
  );

  useEffect(() => {
    return () => {
      clearTimeout(setDisablePaginator(false));
    };
  }, [setDisablePaginator]);

  const displayArrow = {
    display: disableArrows ? "none" : "initial",
  };

  if (!Array.isArray(passedData)) {
    throw new Error("Provide an array inside passedData prop.");
  }

  return (
    <div className="mainContainerWrapper">
      {renderData(paginatedData, actualPage)}

      <div
        className={`containerPaginatorWrapper ${
          disablePaginator ? "containerWrapper--active" : ""
        }`}
      >
        {passedData.length > dataPerPage && passedData.length > 1 ? (
          <div className="contentWrapper">
            <IconButton
              className="contentWrapper-arrowIcon"
              onClick={() => handlePreviousPage()}
              disabled={disablePrevBtn}
              disableRipple
              style={displayArrow}
            >
              <ArrowBackIosIcon />
            </IconButton>

            {!disableDigits && paginNumbers(pages, actualPage, handleClick)}
            <IconButton
              className="contentWrapper-arrowIcon"
              onClick={() => handleNextPage()}
              disabled={disableNextBtn}
              disableRipple
              style={displayArrow}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

CustomPaginator.propTypes = {
  passedData: PropTypes.arrayOf(PropTypes.object),
  dataPerPage: PropTypes.number,
  disableDuration: PropTypes.number,
  disableArrows: PropTypes.bool,
  disableDigits: PropTypes.bool,
  renderData: PropTypes.func,
};

export default CustomPaginator;
