import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20 px-6">
      <div className="relative flex items-center justify-center mb-6 w-36 h-36">
        <motion.div
          className="w-20 h-20 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center text-3xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          😊
        </motion.div>

        {[...Array(8)].map((_, i) => {
          const angle = i * 45; // 360° / 8 rays = 45° apart
          return (
            <motion.div
              key={i}
              className="absolute w-10 h-1 bg-yellow-300 rounded-lg"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: "center",
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(45px)`,
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          );
        })}
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
        Welcome to Solar Health Monitor
      </h1>
      <p className="text-lg text-gray-700 mt-4 max-w-2xl">
        A cutting-edge system for monitoring and optimizing solar panel
        performance with real-time insights.
      </p>

      {/* Solar Panel Image */}
      <div className="relative mt-10">
        <img
          src="https://th.bing.com/th/id/OIP.NB3ZV21ZXJJQMLjVH0tz5wHaFV?w=213&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7"
          alt="Solar Panel"
          className="w-64 md:w-96 mx-auto"
        />
        <motion.div
          className="absolute inset-0 bg-yellow-300 opacity-30 blur-lg rounded-full"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Call-to-Action Button */}
      <button className="mt-8 px-6 py-3 text-lg font-semibold bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transition-all duration-300">
        Learn More
      </button>
    </div>
  );
};

export default HeroSection;
