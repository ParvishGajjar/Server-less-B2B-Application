// Author: Fenil Shah

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Iframe from "react-iframe";

function Visuals() {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div>
      <Header />
      <Iframe
        url="https://datastudio.google.com/embed/reporting/5731b01c-0ed1-430c-8178-c04062d90c5a/page/p_taxjnvn0wc"
        width="99.7%"
        height="573px"
        allowFullScreen
      />
    </div>
  );
}

export default Visuals;
