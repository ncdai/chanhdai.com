"use client";

import { RepeatIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";

import { AppleHelloVietnameseEffect } from "@/components/apple-hello-effect";
import { ChanhDaiMark } from "@/components/chanhdai-mark";
import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/tooltip";

const layers = ["xin-chao", "chanhdai-wordmark"] as const;

export function Hello() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const canRestart = currentIndex === layers.length - 1;

  useEffect(() => {
    const realUser = isRealUser();
    if (realUser) {
      setTimeout(() => {
        setCurrentIndex(0);
      }, 500);
    }
  }, []);

  const nextAnimation = useCallback(() => {
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % layers.length);
    }, 500);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <div
          key={`layer-${currentIndex}`}
          className="flex items-center justify-center text-black dark:text-white"
        >
          {layers[currentIndex] === "xin-chao" && (
            <AppleHelloVietnameseEffect
              className="h-10 sm:h-16"
              exit={{ opacity: 0, scale: 0.8 }}
              onAnimationComplete={nextAnimation}
            />
          )}

          {/* {layers[currentIndex] === "hello" && (
            <AppleHelloEnglishEffect
              className="h-10 sm:h-16"
              speed={0.8}
              exit={{ opacity: 0, scale: 0.8 }}
              onAnimationComplete={nextAnimation}
            />
          )} */}

          {layers[currentIndex] === "chanhdai-wordmark" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <ChanhDaiMark className="h-12 sm:h-16" />
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-end justify-end">
        <SimpleTooltip content="Restart animation">
          <Button
            className="translate-px"
            variant="outline"
            size="icon"
            disabled={!canRestart}
            onClick={() => {
              setCurrentIndex(0);
            }}
          >
            <RepeatIcon />
            <span className="sr-only">Restart animation</span>
          </Button>
        </SimpleTooltip>
      </div>
    </>
  );
}

function isRealUser() {
  if (navigator.webdriver) {
    return false;
  }

  if (!navigator.languages || navigator.languages.length === 0) {
    return false;
  }

  if (/HeadlessChrome|Puppeteer|Playwright/i.test(navigator.userAgent)) {
    return false;
  }

  return true;
}
