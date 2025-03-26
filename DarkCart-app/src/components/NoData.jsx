import { motion } from "framer-motion";
import nodata from "../assets/noData.jpg";

const AnimatedImage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      {/* Animated Image */}
      <motion.img
        src={nodata}
        alt="No Data Available"
        className="w-72 h-72 rounded-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Animated Button with Text Animation */}

        <motion.div
        className="mt-6 px-6 py-3 text-blue-300 font-medium flex items-center justify-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          No Data
        </motion.div>
   
    </div>
  );
};

export default AnimatedImage;
