import React from "react";
import FpTop from "@/components/form-pengajuan/fp-top";
import FpBottom from "@/components/form-pengajuan/fp-bottom";

const page = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <FpTop />
      <FpBottom />
    </div>
  );
};

export default page;
