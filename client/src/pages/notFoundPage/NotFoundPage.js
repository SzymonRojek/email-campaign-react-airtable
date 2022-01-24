import { useState, useEffect } from "react";

import { Loader, Error } from "components/DisplayMessage";

const NotFoundPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoading(false);
    }, 500);

    return () => clearInterval(intervalId);
  });

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Error
          titleOne="Page Not Found"
          titleTwo="Please make sure that url address is correct"
        />
      )}
    </>
  );
};

export default NotFoundPage;
