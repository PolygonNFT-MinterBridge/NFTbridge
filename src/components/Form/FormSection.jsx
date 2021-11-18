import React, { useState } from "react";

// material ui
import { Container, Grid, Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TabPanel, TabContext } from "@material-ui/lab";
import { SwapHoriz } from "@material-ui/icons";

// form components
import FormETM from "./FormETM";
import FormMTE from "./FormMTE";
import FormMapping from "./FormMapping";
import Preview from "../Preview";

const FormSection = ({ db }) => {
  const classes = useStyles();

  const [value, setValue] = useState(1);
  const [form, setForm] = useState(true);
  const [previewData, setPreviewData] = useState({});

  const handleTabs = (event, newValue) => {
    setValue(newValue);
  };

  const switchForm = () => {
    if (form) {
      setForm(false);
    } else {
      setForm(true);
    }
  };

  // to get the preview data from Form Components
  const dataFromMTE = (data) => {
    setPreviewData(data);
  };

  const dataFromETM = (data) => {
    setPreviewData(data);
  }

  return (
    <div className={classes.formSection}>
      <Container className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <div className={classes.outerFormContainer}>
              <TabContext value={value}>
                <Tabs
                  value={value}
                  onChange={handleTabs}
                  className={classes.tabBar}
                  indicatorColor="primary"
                  TabIndicatorProps={{
                    style: {
                      height: "5px",
                    }
                  }}
                >
                  <Tab
                    label="Transfer Tokens"
                    className={classes.tab}
                    value={1}
                  />
                  <Tab
                    label="Check for mapping"
                    className={classes.tab}
                    value={2}
                  />
                </Tabs>

                <TabPanel value={1} style={{ padding: "0" }}>
                  <div className={classes.switchBar}>
                    <h3
                      onClick={() => {
                        setForm(true);
                      }}
                      className={`${form ? "active" : "inactive"}`}
                    >
                      ETH to MATIC
                    </h3>
                    <div
                      className={`${classes.switchIcon} ${form ? "" : "rotate"
                        }`}
                      onClick={switchForm}
                    >
                      <SwapHoriz style={{ fontSize: "28px" }} />
                    </div>
                    <h3
                      onClick={() => {
                        setForm(false);
                      }}
                      className={`${form ? "inactive" : "active"}`}
                    >
                      MATIC to ETH
                    </h3>
                  </div>

                  {form ? (
                    <FormETM sendDataToFormSection={dataFromETM} db={db} />
                  ) : (
                    <FormMTE sendDataToFormSection={dataFromMTE} db={db} />
                  )}
                </TabPanel>
                <TabPanel value={2} style={{ padding: "0" }}>
                  <FormMapping />
                </TabPanel>
              </TabContext>
            </div>
          </Grid>
           {previewData.token_id && (
            <Grid item xs={12} sm={6} md={4}>
              <div className={classes.flexV}>
                <Preview data={previewData} />
              </div>
            </Grid>
          )} 
        </Grid>
      </Container>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui,
  formSection: {
    backgroundColor: "#F4F7F9",
    paddingBottom: '60px',
    '@media (max-width:559px)': {
      paddingBottom: '0px',
    }
  },

  //   for outer form container
  outerFormContainer: {
    backgroundColor: "white",
    minHeight: "200px",
    filter: "drop-shadow(0px 2px 24px rgba(0, 0, 0, 0.1))",
    position: "relative",
    top: "-70px",
    zIndex: 1,
    borderRadius: "16px",
    overflow: "hidden",
  },
  tabBar: {
    backgroundColor: "#F9F9FE",
    height: "70px",
    borderBottom: "1px solid #E8E8E8",
    display: "flex",
    padding: "0 26px",
  },

  //   for tab bar
  tab: {
    marginRight: "20px",
    color: "rgba(6, 16, 36, 1)",
    lineHeight: "70px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "16px",
    textTransform: "none",
    padding: "0",
    minWidth: "auto",

    "&:hover": {
      color: "rgba(6, 16, 36, 1)",
    },
  },

  //   for switch bar
  switchBar: {
    backgroundColor: "#fff",
    height: "70px",
    borderBottom: "1px solid #E8E8E8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 26px",
    transition: "0.3s ease",

    "& .active": {
      fontSize: "20px",
      transition: "0.3s ease",
    },

    "& .inactive": {
      fontSize: "13px",
      color: "#6E798F",
      transition: "0.3s ease",

      "&:hover": {
        color: "#000000",
        transition: "0.3s ease",
      },
    },

    "& h3": {
      fontSize: "20px",
      maxWidth: "200px",
      // backgroundColor: "red",
      cursor: "pointer",
      width: "35%",

      "&:nth-of-type(2)": {
        textAlign: "right",
      },
    },
  },
  switchIcon: {
    height: "40px",
    width: "40px",
    borderRadius: "20px",
    backgroundColor: "rgba(117, 51, 226, 0.1)",
    color: "#7533E2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.3s ease",
    cursor: "pointer",

    "& svg": {
      transition: "0.3s ease",
    },

    "&.rotate": {
      "& svg": {
        transform: "rotateZ(180deg)",
        transition: "0.3s ease",
      },
    },
  },

  flexV: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    position: "relative",
    top: "-70px",
    left: "0",
  },
}));

export default FormSection;
