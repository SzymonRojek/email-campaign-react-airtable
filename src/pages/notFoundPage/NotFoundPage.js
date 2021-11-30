import { useState, useEffect } from "react";
import { Error } from "../../components/Error";
import { Loader } from "../../components/Loader";

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
          titleTwo="Please make sure that url address is correct."
          titleThree="🙂"
        />
      )}
    </>
  );
};

export default NotFoundPage;
