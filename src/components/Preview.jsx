import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@material-ui/icons";

const Preview = (props) => {
  const classes = useStyles();
  const [data, setData] = useState({});
  useEffect(() => {
    setData(props.data);
    console.log("destination");
  },[props.data]);

  return (
    <div className={classes.previewContainer}>
      <div className={classes.previewImageContainer}>
        <img
          src={data.image}
          alt="nft preview"
          className={`${classes.previewImage} overlay`}
        />
        <div className="hoverItem">
          <p className={classes.title}>{data.name}</p>
          <a href={data.token_url}>
            <div className={classes.link}>
              <Link
                style={{ fontSize: "16px", transform: "rotateZ(-45deg)" }}
              />
            </div>
          </a>
        </div>
      </div>
      <div className={classes.detailsContainer}>
        <div className={classes.details}>
          <h5>Contract Name</h5>
          <p>{data.contract_name}</p>
        </div>
        <div className={classes.details}>
          <h5>Description</h5>
          <p>{data.description}</p>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  previewContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0px 2px 24px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  previewImageContainer: {
    marginBottom: "17px",
    height: "180px",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative",
    backgroundColor: "black",
    ["@media (max-width:959px)"]: {
      height: "240px",
    },

    //   hover item
    "& .hoverItem": {
      position: "absolute",
      bottom: "-100%",
      left: "0",
      padding: "0 18px",
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
      // alignItems: 'flex-end',
      transition: "0.4s ease",
    },

    "&:hover .hoverItem": {
      bottom: "18px",
    },

    // preview image
    "&:hover .overlay": {
      opacity: 0.8,
      transition: "0.3s ease",
    },
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    // opacity: 0.5,
  },

  title: {
    maxWidth: "220px",
    fontSize: "17px",
    fontWeight: "bold",
    color: "white",
    textShadow: "0px 2px 14px rgba(0, 0, 0, 0.5)",
    margin: 0,
    lineHeight: "22px",
  },
  link: {
    height: "30px",
    width: "30px",
    borderRadius: "15px",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    "&:first-of-type": {
      marginBottom: "13px",
    },
    color: "#515C72",
    "& h5": {
      fontSize: "12px",
      fontSize: "bold",
      margin: "0 0 4px 0",
    },
    "& p": {
      fontSize: "14px",
      margin: 0,
    },
  },
}));

export default Preview;
