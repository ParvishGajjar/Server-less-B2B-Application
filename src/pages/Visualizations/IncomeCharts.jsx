// Author: Fenil Shah

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Iframe from "react-iframe";

function ViewIncomeCharts() {
  const navigate = useNavigate();

  useEffect(() => {}, []);

  return (
    <div>
      <Header />
      <Iframe
        url="https://datastudio.google.com/embed/reporting/5fcf3f76-bb85-483d-95cb-5ae66590faa7/page/GrXyC"
        width="99.7%"
        height="573px"
        allowFullScreen
      />
    </div>
  );
}

export default ViewIncomeCharts;
