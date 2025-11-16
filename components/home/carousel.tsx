// "use client";
// import * as React from "react";

// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import Image from "next/image";
// import { motion } from "framer-motion";

// export default function CarouselProducts() {
//   return (
//     <div>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         viewport={{ once: true }}
//         className="flex items-center justify-center bg-primary/60"
//       >
//         <h1 className="text-3xl text-amber-50 font-serif md:text-4xl font-bold py-6 text-center">
//           Our Gallery
//         </h1>
//       </motion.div>
//       <div className="flex items-center justify-center pb-10 bg-primary/60">
//         <CarouselSpacing />
//       </div>
//     </div>
//   );
// }

// function CarouselSpacing() {
//   return (
//     <Carousel className="w-full max-w-4xl">
//       <CarouselContent className="-ml-1">
//         {Array.from({ length: 5 }).map((_, index) => (
//           <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
//             <div className="p-1">
//               <Card>
//                 <Image
//                   src={`/Image_fx${index + 1}.jpg`}
//                   alt={`Carousel image ${index + 1}`}
//                   width={300}
//                   height={300}
//                 />
//                 {/* <CardContent className="flex aspect-square items-center justify-center p-6">
//                   <span className="text-2xl font-semibold">{index + 1}</span>
//                 </CardContent> */}
//               </Card>
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious />
//       <CarouselNext />
//     </Carousel>
//   );
// }
"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { easeOut, motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

export default function CarouselProducts() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center justify-center bg-primary/60"
      >
        <h1 className="text-3xl text-amber-50 font-serif md:text-4xl font-bold py-6 text-center">
          Our Gallery
        </h1>
      </motion.div>
      <div className="flex items-center justify-center pb-10 bg-primary/60">
        <CarouselSpacing />
      </div>
    </div>
  );
}

function CarouselSpacing() {
  return (
    <Carousel className="w-full max-w-4xl">
      <CarouselContent className="-ml-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              className="p-1"
            >
              <Card className="overflow-hidden cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={`/Image_fx${index + 1}.jpg`}
                    alt={`Carousel image ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </motion.div>
              </Card>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
