import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import NotificationItem from "./NotificationItem";

const Notification = ({ exitData, db }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.notificationSection}>
        <p className="title">Notification</p>
        {exitData.txn.map((tx, id) => {
          return (
            <NotificationItem
              key={id}
              data={{
                txn: tx,
                nft721: exitData.nft721[id],
                txnType: exitData.txnType[id],
                burnedTxn: exitData.burnedTxn[id],
                burnId: exitData.txn.length - id - 1
              }}
              active
              db={db}
            />
          )
        })}
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  notificationSection: {
    width: "400px",
    minHeight: "300px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0px 2px 24px rgba(0, 0, 0, 0.1)",
    position: "absolute",
    top: "10px",
    right: "15px",
    zIndex: "10",
    overflow: "hidden",
    padding: '0 15px 15px',

    "@media (max-width:599px)": {
      width: 'calc(100% - 30px)',
    },

    "& .title": {
      fontSize: "16px",
      fontWeight: "bold",
      textAlign: "center",
      padding: "20px",
      borderBottom: "1px solid #E8E8E8",
      margin: '0 0 15px 0',
    },
  },
}));

export default Notification;
