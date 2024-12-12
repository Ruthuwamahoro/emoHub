"use client";

import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import Link from "next/link"

export default function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Let's it go",
    },
    {
      text: "with",
    },
    {
      text: "talkHeal.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm hover:text-black">
          <Link href="./register">Sign Up</Link>
        </Button>
        <Button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          <Link href="./login">Sign In</Link>
        </Button>
      </div>
      {/* <div className="p">
        <InfiniteMovingCardsDemo/>
      </div> */}
    </div>
  );
}
