"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-4">
      <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl bg-[#161b22]">
        
        {/* Left image (hidden on mobile) */}
        <div className="relative hidden md:block w-1/2">
          <Image
            src="/images/login-hero.png" // put your image in public/images/
            alt="Smart Meet Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="font-bold">Smart Meet</p>
            <p className="text-sm text-gray-300">Connect Smarter</p>
          </div>
        </div>

        {/* Right form */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname} // re-animate on route change
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full max-w-sm"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
