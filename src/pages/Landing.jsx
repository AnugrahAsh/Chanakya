"use client"

import { useRef, Suspense, useState, useLayoutEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import * as THREE from "three"

const FloatingElement = ({ position, rotation, scale = 1, color, shape = "sphere" }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002
    }
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef}>
        {shape === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
        {shape === "torus" && <torusGeometry args={[1, 0.4, 16, 100]} />}
        {shape === "cylinder" && <cylinderGeometry args={[0.8, 0.8, 2, 32]} />}
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.2} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

const HeroScene = () => {
  const { mouse } = useThree()
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.1, 0.05)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.1, 0.05)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Large blue spherical elements */}
      <FloatingElement position={[4, 2, -2]} color="#1e40af" scale={1.5} shape="sphere" />
      <FloatingElement position={[6, -1, -1]} color="#3b82f6" scale={1.2} shape="torus" />
      <FloatingElement position={[-4, 1, -3]} color="#60a5fa" scale={1} shape="cylinder" />
      <FloatingElement position={[2, -2, 0]} color="#93c5fd" scale={0.8} shape="sphere" />
    </group>
  )
}

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
    <div className="container mx-auto px-6 py-4">
      <nav className="flex items-center justify-between">
        <div className="text-2xl font-bold p-4 isolate ">Chanakya</div>
        <div className="hidden md:flex items-center space-x-1 isolate rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5 py-2 px-3">
          <a
            href="#"
            className="hover:bg-white text-black transition-all px-4 py-2 rounded-full text-sm font-medium"
          >
            Startups
          </a>
          <a
            href="#"
            className="hover:bg-white text-black transition-all px-4 py-2 rounded-full text-sm font-medium"
          >
            Established Products
          </a>
          <a
            href="#"
            className="hover:bg-white text-black transition-all px-4 py-2 rounded-full text-sm font-medium"
          >
            Features ↓
          </a>
          <a
            href="#"
            className="hover:bg-white text-black transition-all px-4 py-2 rounded-full text-sm font-medium"
          >
            Pricing
          </a>
          <a
            href="#"
            className="hover:bg-white text-black transition-all px-4 py-2 rounded-full text-sm font-medium"
          >
            Investors
          </a>
          <a
            href="#"
            className="hover:bg-white text-black transition-all px-4 py-2 rounded-full text-sm font-medium"
          >
            Request Demo
          </a>
        </div>
        <div className="flex items-center space-x-3">
          
          <button className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-full transition text-sm">
            Sign Up
          </button>
        </div>
      </nav>
    </div>
  </header>
)

const AIDomains = () => {
  const domains = ["Legal Advisory", "Financial Guidance", "Marketing Support", "Technical Analysis", "UI/UX Insights"]

  return (
    <div className="absolute bottom-8 left-0 right-0 z-10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center space-x-8 opacity-80">
          {domains.map((domain, index) => (
            <div key={index} className="text-black font-medium text-sm whitespace-nowrap">
              {domain}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import herobg from '../assets/HeroBg.jpg'

export default function App() {
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)

  useLayoutEffect(() => {
    const onResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }
    const debouncedOnResize = () => setTimeout(onResize, 100)
    onResize()
    window.addEventListener("resize", debouncedOnResize)
    return () => window.removeEventListener("resize", debouncedOnResize)
  }, [])

  const { scrollY } = useScroll()
  const smoothScrollY = useSpring(scrollY, { mass: 0.1, stiffness: 100, damping: 20, restDelta: 0.001 })
  const y = useTransform(smoothScrollY, (value) => `-${value}px`)

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  return (
    <>
      <div className="bg-white text-black font-sans antialiased">
        <div style={{ height: contentHeight }} />
        <motion.div ref={contentRef} style={{ y }} className="fixed top-0 left-0 w-full will-change-transform">
          <Header />
          <main>
            <section
              className="min-h-screen flex items-center relative overflow-hidden"
            >
              {/* This div holds the background image, which is semi-transparent to blend with the gradient */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={herobg} 
                  alt="Abstract AI visualization" 
                  className="w-full h-full object-cover opacity-20"
                  // Fallback in case the image fails to load
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1920x1080/1e40ae/ffffff?text=Chanakya'; }}
                />
              </div>

              <div className="container mx-auto px-6 mt-10 ml-6 z-10">
                <motion.div
                  className="max-w-3xl"
                  initial="initial"
                  animate="animate"
                  variants={{ animate: { transition: { staggerChildren: 0.15 } } }}
                >
                  <motion.h1
                    className="text-5xl sm:text-7xl md:text-8xl font-bold text-black/90 leading-tight mb-8"
                    variants={fadeInUp}
                  >
                    AI-Powered Product Refinement.
                  </motion.h1>
                  <motion.p className="text-lg sm:text-xl text-black/90 mb-8 max-w-lg" variants={fadeInUp}>
                    Optimize, refine, and grow your offering with AI-driven insights, analytics, and practical guidance for every stage of your business.
                  </motion.p>
                </motion.div>
              </div>
              <AIDomains />
            </section>

            <section className="py-20 bg-gray-50">
              <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    For Every Stage of Your Product's Journey
                  </h2>
                  <p className="text-xl text-gray-600">
                    Chanakya provides tailored toolkits, whether you're a new startup with an idea or an established product looking to optimize.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-6 right-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="mb-8">
                      <h3 className="text-3xl font-bold mb-3">For Startups</h3>
                      <p className="text-gray-600 text-lg">From idea to launch with an AI co-pilot guiding you.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                        <p className="font-semibold text-gray-800">✓ AI-Assisted Website Builder</p>
                        <p className="font-semibold text-gray-800">✓ AI Chatbot for Basic Legal Guidance</p>
                        <p className="font-semibold text-gray-800">✓ Financial & Funding Strategy</p>
                        <p className="font-semibold text-gray-800">✓ SEO and Social Media Content</p>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-6 right-6 w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div className="mb-8">
                      <h3 className="text-3xl font-bold mb-3">For Established Products</h3>
                      <p className="text-gray-600 text-lg">Analyze, optimize, and enhance your existing product.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
                      <p className="font-semibold text-gray-800">✓ In-depth UI/UX Analysis</p>
                      <p className="font-semibold text-gray-800">✓ Continuous SEO Recommendations</p>
                      <p className="font-semibold text-gray-800">✓ User Engagement & Trend Analytics</p>
                      <p className="font-semibold text-gray-800">✓ Feature Enhancement Suggestions</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full">
                <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <pointLight position={[5, 5, 5]} intensity={1} />
                  <Suspense fallback={null}>
                    <FloatingElement position={[2, 1, 0]} color="#3b82f6" scale={1.2} shape="sphere" />
                    <FloatingElement position={[0, -1, -1]} color="#1e40af" scale={0.8} shape="torus" />
                    <FloatingElement position={[-1, 2, 1]} color="#60a5fa" scale={1} shape="cylinder" />
                  </Suspense>
                </Canvas>
              </div>
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-2xl">
                  <motion.h2
                    className="text-6xl md:text-7xl font-bold leading-tight mb-8"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    Leverage a Multi-Agent AI System
                  </motion.h2>
                  <motion.p
                    className="text-xl text-gray-600 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Get personalized recommendations from a team of specialized AI agents. Our system even facilitates interactive debates on features, presenting you with transparent pros and cons.
                  </motion.p>
                  <motion.button
                    className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-full transition text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Explore Our AI Features
                  </motion.button>
                </div>
              </div>
            </section>

            <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
              {/* Left content - spans 5 columns */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Core Tools to Drive Growth
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Chanakya puts a powerful suite of analysis and product management tools at your fingertips, helping
                  you identify market gaps and track your refinement iterations seamlessly.
                </p>
                <button className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 w-fit">
                  See Pricing Plans
                </button>
              </div>

              {/* Bento grid - spans 7 columns */}
              <div className="lg:col-span-7 grid grid-cols-6 grid-rows-4 gap-4 h-[600px]">
                {/* Large feature card */}
                <div className="col-span-6 row-span-2 backdrop-blur-xl bg-gradient-to-br from-blue-500/90 to-purple-600/90 p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden group  transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-4 text-white">Competitor & Market Analysis</h3>
                    <p className="text-white/90 text-lg leading-relaxed">
                      Visualize competitor performance and identify strategic market gaps with AI-driven insights and
                      real-time data visualization.
                    </p>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm"></div>
                </div>

                {/* Medium card - Investor Matching */}
                <div className="col-span-4 row-span-2 backdrop-blur-xl bg-white/40 p-6 rounded-3xl border border-white/30 shadow-xl hover:bg-white/50 transition-all duration-500  relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mb-4 flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-lg"></div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">Investor Matching</h3>
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-full mb-3">
                      Premium
                    </span>
                    <p className="text-gray-700 leading-relaxed">
                      Access a curated database of investors with detailed insights on their interests and past deals.
                    </p>
                  </div>
                </div>

                {/* Small accent card */}
                <div className="col-span-2 row-span-2 backdrop-blur-xl bg-gradient-to-br from-rose-400/80 to-pink-500/80 p-4 rounded-3xl border border-white/20 shadow-xl transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-white/30 rounded-2xl backdrop-blur-sm mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-xl"></div>
                    </div>
                    <h4 className="text-white font-bold text-lg">AI Insights</h4>
                    <p className="text-white/90 text-sm mt-2">Smart analytics</p>
                  </div>
                </div>

                {/* Bottom wide card */}
                <div className="col-span-6 row-span-1 backdrop-blur-xl bg-white/30 p-6 rounded-3xl border border-white/30 shadow-xl hover:bg-white/40 transition-all duration-500  relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">Product Refinement & Version Tracking</h3>
                      <p className="text-gray-700">
                        Maintain a comprehensive history of requirements and analyze the impact of changes on cost and
                        satisfaction metrics.
                      </p>
                    </div>
                    <div className="hidden md:flex space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

            <footer className="bg-white py-20 border-t border-gray-100">
              <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-5 gap-8 mb-16">
                  <div>
                    <div className="text-2xl font-bold mb-6">Chanakya</div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Features</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li><a href="#" className="hover:text-black transition">AI Assistance</a></li>
                      <li><a href="#" className="hover:text-black transition">Website & SEO Tools</a></li>
                      <li><a href="#" className="hover:text-black transition">Investor Matching</a></li>
                      <li><a href="#" className="hover:text-black transition">Market Analysis</a></li>
                      <li><a href="#" className="hover:text-black transition">Version Tracking</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Resources</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li><a href="#" className="hover:text-black transition">Docs</a></li>
                      <li><a href="#" className="hover:text-black transition">Knowledge Base</a></li>
                      <li><a href="#" className="hover:text-black transition">Blog</a></li>
                      <li><a href="#" className="hover:text-black transition">Case Studies</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Company</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li><a href="#" className="hover:text-black transition">About Us</a></li>
                      <li><a href="#" className="hover:text-black transition">Careers</a></li>
                      <li><a href="#" className="hover:text-black transition">Get Support</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Connect</h4>
                    <ul className="space-y-3 text-gray-600">
                      <li><a href="#" className="hover:text-black transition">LinkedIn</a></li>
                      <li><a href="#" className="hover:text-black transition">X / Twitter</a></li>
                      <li><a href="#" className="hover:text-black transition">Contact Sales</a></li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                  <div className="text-4xl font-bold">Chanakya</div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">© 2025 Chanakya Inc.</span>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </motion.div>
      </div>
    </>
  )
}