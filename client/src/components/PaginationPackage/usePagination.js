import { useState, useEffect, useMemo, useCallback } from "react";

const usePagination = (dataArr, dataPerPage, disableDuration) => {
  const [paginatedData, setPaginatedData] = useState([]);
  const [pages, setPages] = useState(1);
  const [actualPage, setActualPage] = useState(1);
  const [disablePaginator, setDisablePaginator] = useState(false);
  const [disablePrevBtn, setDisablePrevBtn] = useState(true);
  const [disableNextBtn, setDisableNextBtn] = useState(false);

  const firstPage = useMemo(() => {
    return actualPage - 1 === 0;
  }, [actualPage]);

  const lastPage = useMemo(() => {
    return dataArr && dataArr.length - actualPage * dataPerPage <= 0;
  }, [dataArr, actualPage, dataPerPage]);

  const setNewPaginatedData = useCallback(() => {
    const slicedData = dataArr.slice(
      (actualPage - 1) * dataPerPage,
      (actualPage - 1) * dataPerPage + dataPerPage
    );

    return setPaginatedData(slicedData);
  }, [actualPage, dataArr, dataPerPage]);

  const handlePageNumber = useCallback(() => {
    const pageLength = Math.ceil(dataArr.length / dataPerPage);
    setPages(pageLength);
  }, [dataArr, dataPerPage]);

  const handleNextPage = useCallback(() => {
    if (dataArr.length - actualPage * dataPerPage >= 0 && !lastPage) {
      setActualPage((actualPage) => actualPage + 1);
    }
  }, [actualPage, dataArr, lastPage, dataPerPage]);

  const handlePreviousPage = useCallback(() => {
    if (firstPage) {
      setDisablePrevBtn(true);
      return;
    }
    if (dataArr.length >= dataPerPage) {
      setActualPage((actualPage) => actualPage - 1);
    }
  }, [dataArr, firstPage, dataPerPage]);

  const handleSpecificPage = useCallback((pageNumber) => {
    setActualPage(pageNumber);
  }, []);

  useEffect(() => {
    setDisablePaginator(true);
    if (dataArr && dataArr.length <= dataPerPage && dataArr.length > 0) {
      handlePageNumber();
      setDisableNextBtn(true);
      setPaginatedData(dataArr);
      setNewPaginatedData();

      setTimeout(() => {
        setDisablePaginator(false);
      }, disableDuration);
      return;
    }

    if (dataArr && dataArr.length !== 0) {
      handlePageNumber();
      setNewPaginatedData();

      setTimeout(() => {
        setDisablePaginator(false);
      }, disableDuration);
    }

    if (firstPage) {
      setDisablePrevBtn(true);
    } else {
      setDisablePrevBtn(false);
    }

    if (lastPage) {
      setDisableNextBtn(true);
    } else {
      setDisableNextBtn(true);
      setTimeout(() => {
        setDisableNextBtn(false);
      }, disableDuration);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNewPaginatedData]);

  return {
    paginatedData,
    paginatorStatus: {
      actualPage,
      lastPage,
      setActualPage,
      handleNextPage,
      handlePreviousPage,
      handleSpecificPage,
      pages,
      disablePaginator,
      disablePrevBtn,
      disableNextBtn,
    },
    setDisablePaginator,
  };
};

export default usePagination;
