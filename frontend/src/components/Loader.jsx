import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        // Full viewport width
      }}
    >
      <img
        src="/spinner.gif"
        alt="Loading..."
        style={{ width: "150px", height: "150px" }}
      />
    </div>
  );
};

export default Loader;
