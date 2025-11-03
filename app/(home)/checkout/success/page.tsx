import SuccessPage from "@/components/admin/successPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center mt-20 text-lg">Loading...</div>
      }
    >
      <SuccessPage />
    </Suspense>
  );
}
