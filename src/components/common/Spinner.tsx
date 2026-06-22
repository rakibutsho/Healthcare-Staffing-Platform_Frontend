import { Spin } from "antd";

import React from "react";

const Spinner = () => {
  return (
    <div className="md:py-10 py-5 flex justify-center items-center">
      <Spin className="w-9 h-9" />
    </div>
  );
};

export default Spinner;
