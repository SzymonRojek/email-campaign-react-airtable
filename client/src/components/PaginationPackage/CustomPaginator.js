import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useCallback, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import usePagination from "./usePagination";
import paginNumbers from "./switchPages";

import "./styles.css";

export const CustomPaginator = ({
  passedData = [],
  dataPerPage = 2,
  disableDuration,
  disableArrows = false,
  disableDigits = false,
  renderData,
  setActiveTablePage,
}) => {
  const fromPassedDataFnToArr =
    typeof passedData === "function" && Array.isArray(passedData())
      ? passedData()
      : passedData;

  const {
    data,
    paginatorStatus: {
      actualPage,
      handleNextPage,
      handlePreviousPage,
      handleSpecificPage,
      pages,
      disablePaginator,
      disablePrevBtn,
      disableNextBtn,
    },
    setDisablePaginator,
  } = usePagination(fromPassedDataFnToArr, dataPerPage, disableDuration);

  const handleClick = useCallback(
    (activePage) => {
      handleSpecificPage(Number(activePage));
      setActiveTablePage(activePage);
    },
    [handleSpecificPage, setActiveTablePage]
  );

  useEffect(() => {
    return () => {
      clearTimeout(setDisablePaginator(false));
    };
  }, []);

  const displayArrow = {
    display: disableArrows ? "none" : "initial",
  };

  //Error if passedData is not an Array

  if (
    !(
      Array.isArray(passedData) ||
      (typeof passedData === "function" && Array.isArray(passedData()))
    )
  ) {
    console.warn("You need to provide an array inside passedData prop!");
    throw new Error("You need to provide an array inside passedData prop.");
  }
  return (
    <div
      style={{
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        overflow: "hidden",
        borderRadius: "15px 15px",
        backgroundColor: "white",
      }}
    >
      {renderData && renderData(data)}

      <div
        className={`containerWrapper ${
          disablePaginator ? "containerWrapper--active" : ""
        }`}
      >
        {data.length > 1 ? (
          <>
            <IconButton
              className="containerWrapper-arrowIcon"
              onClick={() => handlePreviousPage()}
              disabled={disablePrevBtn}
              disableRipple
              style={displayArrow}
            >
              <ArrowBackIosIcon />
            </IconButton>

            {!disableDigits && paginNumbers(pages, actualPage, handleClick)}
            <IconButton
              className="containerWrapper-arrowIcon"
              onClick={() => handleNextPage()}
              disabled={disableNextBtn}
              disableRipple
              style={displayArrow}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CustomPaginator;
