import { dataRoleSpecific } from "@/lib/actions/dataRoleSpecific";
import React from "react";

const Page = async () => {
  const result = await dataRoleSpecific();

  if (!result) {
    return <div>Unexpected error: no result</div>;
  }

  if (!result.success) {
    return (
      <div className="text-red-600">
        {result.error || "Failed to load data"}
      </div>
    );
  }

  return (
    <div>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(result.data, null, 2)}
      </pre>
    </div>
  );
};

export default Page;
