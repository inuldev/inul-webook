"use client";

import { motion } from "framer-motion";

export default function Loader() {
  const dotVariants = {
    hidden: { opacity: 0.3, scale: 0.5 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2,
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.6,
      },
    }),
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-orange-600 dark:bg-orange-200 z-50">
      <div className="relative  w-40 h-40">
        <motion.img
          src="/images/logo.png"
          className="w-full h-full text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex space-x-3">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-6 h-6 bg-white rounded-full"
            initial="hidden"
            animate="visible"
            custom={index}
            variants={dotVariants}
          />
        ))}
      </div>
      <motion.div
        className="text-white text-3xl mt-4 font-bold  tracking-widest"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Inbook
      </motion.div>
    </div>
  );
}
