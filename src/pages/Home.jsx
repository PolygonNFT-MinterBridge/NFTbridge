import React, { useEffect, useState } from "react";

// import { useWeb3Context } from '../contexts/Web3Context';
// components
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FormSection from "../components/Form/FormSection";
import Footer from "../components/UI/Footer";

// web3 
import { useWeb3Context } from '../contexts/Web3Context';

import firebase from 'firebase';
import admin from 'firebase-admin';
import serviceAccount from "../utils/serviceAccountKey.json";

const Home = () => {
  const { account } = useWeb3Context();

  const [db, setDb] = useState('');
  const [exitData, setExitData] = useState({});

  useEffect(() => {
    firebase.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://nft-bridge.firebaseio.com",
      projectId: "nft-bridge"
    });
    const d = firebase.firestore();
    setDb(d);
  }, [])

  return (
    <>
      <Navbar db={db} exitData={exitData} />
      <Hero />
      <FormSection db={db} />
      <Footer />
    </>
  );
};

export default Home;