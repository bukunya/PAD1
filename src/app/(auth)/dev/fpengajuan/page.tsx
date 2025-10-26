import { getFormPengajuanProfile } from "@/lib/actions/formPengajuan";
import React from "react";

const page = async () => {
  const data = await getFormPengajuanProfile();
  return (
    <div>
      <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default page;
