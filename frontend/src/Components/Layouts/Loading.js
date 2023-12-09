import React from "react";
import { PiSpinnerGapBold } from "react-icons/pi";

const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center text-lg">
      <PiSpinnerGapBold className="animate-spin" />
      Getting Things for you...
    </div>
  );
};

export default Loading;
