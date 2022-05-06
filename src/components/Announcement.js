import React, { Fragment, useState } from "react";
import { Alert } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";

export default function Announcement({ announcements, loading, error }) {
  const [show, setShow] = useState(true);
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <>
          <Message variant={"danger"} text={error} />
        </>
      ) : (
        <>
          {announcements &&
            announcements.map((announcement) => (
              <Fragment key={announcement.id}>
                {show && (
                  <Alert
                    className="m-0"
                    variant={announcement.alert}
                    onClose={() => setShow(false)}
                    dismissible
                  >
                    {announcement.paragraph}{" "}
                    <a href={announcement.support_link}>
                      {announcement.support_link}
                    </a>
                  </Alert>
                )}
              </Fragment>
            ))}
        </>
      )}
    </>
  );
}
