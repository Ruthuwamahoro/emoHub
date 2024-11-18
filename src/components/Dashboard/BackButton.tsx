"use client";
import React from "react";

import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();
  return (
    <div className="cursor-pointer" onClick={() => router.back()}>
      <MoveLeft size={24} />
    </div>
  );
}

export default BackButton;
