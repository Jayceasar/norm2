import React from "react";

function Banner() {
  return (
    <div className=" px-4 md:px-1  w-full text-white flex flex-col gap-4 py-[4vh] md:py-[12vh] pb-[8vh] md:pb-[16vh] ">
      <p className=" text-neutral-500">Sales videos youd be dying to share</p>
      <p className=" text-4xl md:text-8xl font-semibold transition-all">
        Professional
        <br />
        Videos made easy!
      </p>
      <p className=" text-neutral-500">
        Select a video that looks superb for your use case. Select it, make it
        yours!
      </p>
    </div>
  );
}

export default Banner;
