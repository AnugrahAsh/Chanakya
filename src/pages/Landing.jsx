import React, { useRef, Suspense, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { TorusKnot } from '@react-three/drei';

const Model = () => {
  const meshRef = useRef();
  const { viewport } = useThree();

  // Rotate the model on each frame for a constant dynamic effect.
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  // useScroll hook without a target defaults to window scroll, which is what we want.
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress into animation values for the model.
  // The model will scale up and then back down as the user scrolls.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);
  // The model moves up slightly as the user scrolls down.
  const positionY = useTransform(scrollYProgress, [0, 1], [0, -viewport.height / 4]);

  return (
    // Using motion.group to apply framer-motion transforms to the 3D object.
    <motion.group ref={meshRef} scale={scale} position-y={positionY}>
      <TorusKnot args={[1, 0.3, 256, 32]}>
        <meshStandardMaterial 
          color="#4F46E5" 
          emissive="#A855F7" 
          emissiveIntensity={0.5} 
          metalness={0.8} 
          roughness={0.2} 
        />
      </TorusKnot>
    </motion.group>
  );
};

// Main App Component
export default function App() {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // This effect measures the height of the content and sets it.
  // This is crucial for the spacer div to create a functional scrollbar.
  useLayoutEffect(() => {
    const onResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { scrollY } = useScroll();

  // Apply spring physics to the scrollY value for the inertia effect.
  // These values can be tweaked to change the feel of the scroll.
  const smoothScrollY = useSpring(scrollY, {
    mass: 0.1,
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  // Transform the smoothed scroll value into a negative translateY to move the content up.
  const y = useTransform(smoothScrollY, value => `-${value}px`);

  // Variants for Framer Motion's staggered fade-up animations.
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <>
      <div className="bg-[#0A0A0A] text-[#E0E0E0] font-sans antialiased overflow-x-hidden">
        {/* 3D Canvas remains fixed in the background */}
        <div className="fixed top-0 left-0 w-full h-screen z-0 opacity-40">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Suspense fallback={null}>
              <Model />
            </Suspense>
          </Canvas>
        </div>
        
        {/* This spacer div creates the scrollable height, allowing the native scrollbar to work. */}
        <div style={{ height: contentHeight }} />

        {/* The main content is in a fixed motion.div. Its 'y' position is animated for the smooth scroll effect. */}
        <motion.div
          ref={contentRef}
          style={{ y }}
          className="fixed top-0 left-0 w-full will-change-transform"
        >
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
            <div className="container mx-auto px-6 py-4">
              <nav className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">Synthara</div>
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#" className="text-gray-300 hover:text-white transition">Products</a>
                  <a href="#" className="text-gray-300 hover:text-white transition">Solutions</a>
                  <a href="#" className="text-gray-300 hover:text-white transition">Developers</a>
                  <a href="#" className="text-gray-300 hover:text-white transition">Company</a>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="#" className="hidden md:block text-gray-300 hover:text-white transition">Contact Sales</a>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg transition">
                    Dashboard
                  </button>
                </div>
              </nav>
            </div>
          </header>

          <main>
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center text-center relative pt-40 pb-20" style={{ background: 'radial-gradient(ellipse at top, rgba(79, 70, 229, 0.2) 0%, rgba(10, 10, 10, 0) 50%)' }}>
              <div className="container mx-auto px-6">
                <motion.div 
                  className="max-w-4xl mx-auto"
                  initial="initial"
                  animate="animate"
                  variants={{ animate: { transition: { staggerChildren: 0.15 } } }}
                >
                  <motion.h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6" variants={fadeInUp}>
                    The Complete <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">Web3 Infrastructure</span> for Global Access
                  </motion.h1>
                  <motion.p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10" variants={fadeInUp}>
                    Synthara provides seamless, compliant, and powerful fiat-to-crypto on-ramps, off-ramps, and NFT checkout solutions for any application.
                  </motion.p>
                  <motion.div className="flex justify-center items-center gap-4" variants={fadeInUp}>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg">
                      Get Started
                    </button>
                    <button className="bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 text-white font-bold py-3 px-8 rounded-lg transition text-lg">
                      View Docs
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Partners Section */}
            <motion.section 
              className="py-12"
              initial={{opacity: 0}}
              whileInView={{opacity: 1}}
              viewport={{ once: true, amount: 0.5 }}
              transition={{duration: 0.8}}
            >
              <div className="container mx-auto px-6 text-center">
                <p className="text-gray-400 font-medium mb-6">TRUSTED BY INDUSTRY LEADERS</p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                  <img src="https://placehold.co/120x40/0A0A0A/E0E0E0?text=Partner1" alt="Partner 1" className="h-8 opacity-60 hover:opacity-100 transition" />
                  <img src="https://placehold.co/120x40/0A0A0A/E0E0E0?text=Partner2" alt="Partner 2" className="h-8 opacity-60 hover:opacity-100 transition" />
                  <img src="https://placehold.co/120x40/0A0A0A/E0E0E0?text=Partner3" alt="Partner 3" className="h-8 opacity-60 hover:opacity-100 transition" />
                  <img src="https://placehold.co/120x40/0A0A0A/E0E0E0?text=Partner4" alt="Partner 4" className="h-8 opacity-60 hover:opacity-100 transition" />
                  <img src="https://placehold.co/120x40/0A0A0A/E0E0E0?text=Partner5" alt="Partner 5" className="h-8 opacity-60 hover:opacity-100 transition" />
                </div>
              </div>
            </motion.section>

            {/* Features Section */}
            <section className="py-20">
              <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <motion.h2 
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{duration: 0.6}}
                  >
                    One Integration, Global Coverage
                  </motion.h2>
                  <motion.p 
                    className="text-lg text-gray-400"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{duration: 0.6, delay: 0.1}}
                  >
                    Access the entire Web3 ecosystem with our unified API. Simplify your stack and scale faster with Synthara's robust infrastructure.
                  </motion.p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <motion.div 
                    className="p-8 rounded-2xl border border-gray-800 bg-gray-900/40 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{duration: 0.5, delay: 0.2}}
                  >
                    <h3 className="text-2xl font-bold text-white mb-3">Global On-Ramps</h3>
                    <p className="text-gray-400">Enable users in 150+ countries to buy crypto with their local payment methods.</p>
                  </motion.div>
                  <motion.div 
                    className="p-8 rounded-2xl border border-gray-800 bg-gray-900/40 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{duration: 0.5, delay: 0.3}}
                  >
                    <h3 className="text-2xl font-bold text-white mb-3">Effortless Off-Ramps</h3>
                    <p className="text-gray-400">Allow users to seamlessly convert crypto back to fiat, directly to their bank accounts.</p>
                  </motion.div>
                  <motion.div 
                    className="p-8 rounded-2xl border border-gray-800 bg-gray-900/40 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{duration: 0.5, delay: 0.4}}
                  >
                    <h3 className="text-2xl font-bold text-white mb-3">NFT Checkout</h3>
                    <p className="text-gray-400">The simplest way for anyone to purchase an NFT with just a credit card, no crypto needed.</p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
              <div className="container mx-auto px-6 text-center">
                <motion.div 
                  className="max-w-3xl mx-auto"
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{duration: 0.8}}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">Ready to Build the Future?</h2>
                  <p className="text-lg text-gray-400 mb-8">
                    Join hundreds of businesses building on Synthara. Create an account to start integrating or contact our sales team for a custom solution.
                  </p>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-lg transition text-xl">
                    Start Building Now
                  </button>
                </motion.div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-800 mt-20">
            <div className="container mx-auto px-6 py-12">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Synthara</h4>
                  <p className="text-gray-400">The complete Web3 infrastructure for global access.</p>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-4">Products</h5>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition">On-ramps</a></li>
                    <li><a href="#" className="hover:text-white transition">Off-ramps</a></li>
                    <li><a href="#" className="hover:text-white transition">NFT Checkout</a></li>
                    <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-4">Developers</h5>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                    <li><a href="#" className="hover:text-white transition">API Reference</a></li>
                    <li><a href="#" className="hover:text-white transition">Status</a></li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-4">Company</h5>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition">About Us</a></li>
                    <li><a href="#" className="hover:text-white transition">Careers</a></li>
                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
                &copy; {new Date().getFullYear()} Synthara. All rights reserved.
              </div>
            </div>
          </footer>
        </motion.div>
      </div>
    </>
  );
}
