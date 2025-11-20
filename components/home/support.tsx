"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";

type BlockInTextProps = {
  tag: string;
  text: React.ReactNode;
  examples: string[];
};

type TypewriteProps = {
  examples: string[];
};

export const Example = () => {
  return (
    <div className="flex items-center justify-center  px-8 py-6 w-full">
      <BlockInTextCard
        tag="/ Support"
        text={
          <>
            <strong>Have questions?</strong> We'd love to help! Contact support
            for any issue you may face.
          </>
        }
        examples={[
          "Does your product work for short hair?",
          "Does it support natural hair types?",
          "How do I choose the right product for my hair?",
          "What ingredients are used in your products?",
          "Can I return a product if I'm not satisfied?",
          "Do you offer international shipping?",
        ]}
      />
    </div>
  );
};

const BlockInTextCard = ({ tag, text, examples }: BlockInTextProps) => {
  return (
    <div className="w-full max-w-xl space-y-6">
      <div>
        <p className="mb-1.5 text-sm font-light text-amber-50 uppercase">
          {tag}
        </p>
        <hr className="border-amber-50" />
      </div>
      <p className="max-w-lg text-xl text-amber-50 leading-relaxed">{text}</p>
      <div>
        <Typewrite examples={examples} />
        <hr className="border-amber-50" />
      </div>
      <Button className="w-full bg-transparent rounded-full border border-amber-50 py-2 text-sm font-medium transition-colors hover:bg-amber-50 hover:text-primary">
        <Link href="/contact"> Contact Support</Link>
      </Button>
    </div>
  );
};

const LETTER_DELAY = 0.025;
const BOX_FADE_DURATION = 0.125;

const FADE_DELAY = 5;
const MAIN_FADE_DURATION = 0.25;

const SWAP_DELAY_IN_MS = 5500;

const Typewrite = ({ examples }: TypewriteProps) => {
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setExampleIndex((pv) => (pv + 1) % examples.length);
    }, SWAP_DELAY_IN_MS);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <p className="mb-2.5 text-sm font-light uppercase">
      <span className="inline-block size-2 bg-amber-50" />
      <span className="ml-3">
        <span className="text-amber-50">EXAMPLE:</span>{" "}
        {examples[exampleIndex].split("").map((l, i) => (
          <motion.span
            initial={{
              opacity: 1,
            }}
            animate={{
              opacity: 0,
            }}
            transition={{
              delay: FADE_DELAY,
              duration: MAIN_FADE_DURATION,
              ease: "easeInOut",
            }}
            key={`${exampleIndex}-${i}`}
            className="relative"
          >
            <motion.span
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: i * LETTER_DELAY,
                duration: 0,
              }}
              className="text-amber-50"
            >
              {l}
            </motion.span>
            <motion.span
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
              }}
              transition={{
                delay: i * LETTER_DELAY,
                times: [0, 0.1, 1],
                duration: BOX_FADE_DURATION,
                ease: "easeInOut",
              }}
              className="absolute bottom-[3px] left-[1px]  right-0 top-[3px] bg-amber-50"
            />
          </motion.span>
        ))}
      </span>
    </p>
  );
};
