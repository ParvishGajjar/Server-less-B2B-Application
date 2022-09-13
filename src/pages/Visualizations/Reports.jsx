// Author: Fenil Shah

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Iframe from "react-iframe";

function Reports() {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div>
      <Header />

      <Iframe
        url="https://datastudio.google.com/embed/reporting/5fd4e495-2a1d-442a-b16e-a6ef29aeca83/page/mtWyC"
        width="99.7%"
        height="573px"
        allowFullScreen
      />
    </div>
  );
}

export default Reports;
