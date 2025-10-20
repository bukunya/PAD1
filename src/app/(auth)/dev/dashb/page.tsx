import { dashboardDetailJadwal } from "@/lib/actions/dashboardDetailJadwal";
import React from "react";

const page = async () => {
  const data = await dashboardDetailJadwal();
  return (
    <div>
      <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default page;
