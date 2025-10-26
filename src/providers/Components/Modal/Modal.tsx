import { X } from "lucide-react";
import { motion } from "motion/react";

function Modal({ children, onClose, title = "Settings" }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute w-full backdrop-blur-[10px] h-full bg-black/20 z-1000 flex justify-center items-center"
    >
      <motion.div
        initial={{ opacity: 1, translateY: -200, rotate: -10 }}
        animate={{ opacity: 1, translateY: 0, rotate: 0 }}
        exit={{ opacity: 0, translateY: 200, rotate: 10 }}
        className="grid grid-rows-[3.75rem_1fr] backdrop-blur-xl h-fit rounded-2xl bg-linear-to-b from-black/90 to-black/50 border border-white/10 shadow-[inset_0_1px_1px_1px_rgba(255,255,255,0.1),0_1px_1px_1px_rgba(0,0,0,0.5)]"
      >
        <div className="h-15 w-full justify-between  text-2xl items-center flex px-4">
          {title}
          <X
            onClick={onClose}
            className="hover:scale-130 active:scale-110 transition-all duration-200 active:text-red-500 hover:bg-white/5 rounded-full p-1"
            size={35}
          />
        </div>
        <div>{children}</div>
      </motion.div>
    </motion.div>
  );
}

export default Modal;
