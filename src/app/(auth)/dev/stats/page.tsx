import { statistics } from "@/lib/actions/statistics";
import React from "react";

const page = async () => {
  const data = await statistics();
  return (
    <div>
      <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default page;
