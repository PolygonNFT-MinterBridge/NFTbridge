import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

// material ui
import { AppBar, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

// components
import { useWeb3Context } from "../contexts/Web3Context";
import ConnectWallet from "./ConnectWallet";
import Notification from "./Notification/Notification";
import { BridgeIcon, MintIcon } from "./UI/Icons";

// image
import polygonLogo from "../images/polygon-logo-dark.svg";

const Navbar = ({ title, db }) => {
  const classes = useStyles();
  const { account } = useWeb3Context();
  const [exitData, setExitData] = useState({
    txn: [],
    nft721: [],
    txnType: [],
    burnedTxn: [],
  });
  const [openNotification, setOpenNotification] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  // to toggle the notification
  const toggleNotification = () => {
    openNotification ? setOpenNotification(false) : setOpenNotification(true);
  };

  // to toggle the menuu
  const toggleMenu = (state) => {
    state
      ? menuItemContainerRef.current.classList.add("open")
      : menuItemContainerRef.current.classList.remove("open");
    setOpenMenu(state);
  };

  const menuItemContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (db && account) {
        const snapshot = await db.collection("storeHash").doc(account);
        const data = await snapshot.get();
        if (data.data() !== undefined) {
          console.log(data.data());
          const _d = data.data();
          setExitData({
            txn: _d.txn.reverse(),
            nft721: _d.nft721.reverse(),
            txnType: _d.txnType.reverse(),
            burnedTxn: _d.burnedTxn.reverse(),
          });
        }
      }
    };
    fetchData();
  }, [account, db]);
  return (
    <>
      <AppBar position="static" classes={{ root: classes.nav }}>
        <Container className={classes.container}>
          <div className={classes.flexContainer}>
            <NavLink to="/" style={{ display: "flex" }}>
              <img src={polygonLogo} alt="logo" className={classes.logo} />
            </NavLink>

            <div className={classes.navigationSection}>
              <div
                className={classes.menuItemContainer}
                ref={menuItemContainerRef}
              >
                <a href="http://mintnft.today/" className="menuItem">
                  <MintIcon className="menuItemIcon" />
                  Minter
                </a>
                <a href="/" className="menuItem active">
                  <BridgeIcon className="menuItemIcon active" />
                  Bridge
                </a>
                 <a href="https://mintnft.today/account" className="menuItem">
                  <AccountCircleIcon className="menuItemIcon" />
                  Account
                </a> 
              </div>

              <div style={{ display: 'flex' }}>
                <div
                  className={classes.notificationButton}
                  onClick={() => {
                    toggleNotification();
                  }}
                >
                  <NotificationsIcon />
                  <div className="indicator">{exitData.txn.length}</div>
                </div>
                <ConnectWallet />
                <MenuIcon
                  className={classes.menuIcon}
                  onClick={() => {
                    openMenu ? toggleMenu(false) : toggleMenu(true);
                  }}
                />
              </div>
            </div>
          </div>
        </Container>
      </AppBar>
      <div style={{ position: "relative" }} className={classes.container}>
        {openNotification && <Notification exitData={exitData} db={db} />}
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui,
  nav: {
    height: "80px",
    backgroundColor: "#fff",
    boxShadow: "none",
    borderBottom: "2px solid #7533E2",
    position: "relative",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: "40px",
    "@media (max-width:599px)": {
      height: "30px",
    },
  },
  // notification button
  notificationButton: {
    height: "36px",
    width: "36px",
    backgroundColor: "#E3E3E3",
    borderRadius: "18px",
    marginRight: "30px",
    display: "flex",
    padding: "6px",
    color: "black",
    lineHeight: "24px",
    cursor: "pointer",
    position: "relative",
    "@media (max-width:599px)": {
      marginRight: "20px",
    },

    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },

    "& .indicator": {
      height: "18px",
      width: "18px",
      display: "block",
      borderRadius: "13px",
      backgroundColor: "#7533E2",
      color: "white",
      lineHeight: "18px",
      textAlign: "center",
      fontSize: "10px",
      fontWeight: "600",
      position: "absolute",
      top: "-5px",
      right: "-5px",
    },
  },
  // everything except the logo inside the navbar.
  navigationSection: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingLeft: '30px',
    "@media (max-width:859px)": {
      justifyContent: 'flex-end',
    }
  },
  menuItemContainer: {
    display: "flex",
    "@media (max-width:859px)": {
      justifyContent: 'space-evenly',
      position: "absolute",
      backgroundColor: "white",
      width: "100%",
      top: "80px",
      left: 0,
      padding: 0,
      height: 0,
      overflow: "hidden",
      transition: "all 0.5s ease",
    },

    // when the menu is opened in mobile view.
    "&.open": {
      padding: "20px 0",
      height: "auto",
      transition: "all 0.5s ease",
      borderBottom: "2px solid #7533E2",
    },

    // menu items
    "& .menuItem": {
      backgroundColor: "transparent",
      color: "#000",
      marginRight: "15px",
      fontSize: "12px",
      fontWeight: "700",
      textDecoration: "none",
      padding: "0 15px 0 12px",
      border: "1px solid #E8E8E8",
      borderRadius: "19px",
      display: "flex",
      alignItems: "center",
      height: "36px",
      lineHeight: "36px",

      "&.active": {
        backgroundColor: "#8247E5",
        color: "#fff",
        borderColor: "#8247E5",

        "& svg": {
          fill: "#EDF0F7",
        }
      },

      "&:hover": {
        backgroundColor: "#8247E5",
        color: "#fff",
        borderColor: "#8247E5",

        "& svg": {
          fill: "#EDF0F7",
        }
      },

      "@media (max-width:859px)": {
        textAlign: "center",
        lineHeight: "50px",
        marginRight: '0'
      },
    },

    // icons inside the menu Item
    "& .menuItemIcon": {
      width: "20px",
      height: "20px",
      fill: "#6E798F",
      marginRight: "4px",
      transition: 'none',
    },
  },
  menuIcon: {
    display: "none",
    "@media (max-width:859px)": {
      display: "block",
      color: "black",
      marginLeft: "20px",
      marginTop: "6px",
    },
  },
}));

export default Navbar;
