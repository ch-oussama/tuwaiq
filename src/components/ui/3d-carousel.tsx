"use client"

import { memo, useEffect, useLayoutEffect, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion"
import Link from "next/link"
import { Project } from "@/lib/db"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useBranch } from "@/lib/BranchContext"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1] as const }
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const }

const Carousel = memo(
  ({
    handleClick,
    controls,
    projects,
    isCarouselActive,
    branch,
  }: {
    handleClick: (project: Project, index: number) => void
    controls: any
    projects: Project[]
    isCarouselActive: boolean
    branch: string | null
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    const faceCount = projects.length || 1
    
    // Base widths optimized for 5 projects
    const designCylinderBase = isScreenSizeSm ? 620 : 880;
    const studioCylinderBase = isScreenSizeSm ? 450 : 880;
    const baseCylinderWidth = branch === 'design' ? designCylinderBase : studioCylinderBase;
    
    // Dynamically expand the cylinder if there are more than 5 projects
    const multiplier = Math.max(1, faceCount / 5);
    const cylinderWidth = baseCylinderWidth * multiplier;
    
    const faceWidth = cylinderWidth / faceCount;
    const radius = cylinderWidth / (2 * Math.PI)
    
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    return (
      <div
        className="flex h-full items-center justify-center bg-transparent"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) => {
            if (isCarouselActive) {
              rotation.stop()
              rotation.set(rotation.get() + info.delta.x * 0.15)
            }
          }}
          onDragEnd={(_, info) => {
            if (isCarouselActive) {
              animate(rotation, rotation.get() + info.velocity.x * 0.05, {
                type: "spring",
                stiffness: 60,
                damping: 40,
                mass: 0.5,
              })
            }
          }}
        >
          {projects.map((project, i) => {
            const imgUrl = project.imageUrl || project.images?.[0] || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop'
            return (
              <motion.div
                key={`key-${project.id}-${i}`}
                className="absolute flex h-full origin-center items-center justify-center rounded-xl p-2"
                style={{
                  width: `${faceWidth}px`,
                  transform: `rotateY(${
                    i * (360 / faceCount)
                  }deg) translateZ(${radius}px)`,
                }}
                onClick={() => handleClick(project, i)}
              >
                <div className={`relative w-full aspect-square rounded-xl overflow-hidden group cursor-pointer shadow-lg outline outline-1 transition-all ${branch === 'design' ? 'outline-[#8B2020]/10 hover:outline-[#8B2020]' : 'outline-white/10 hover:outline-[#a78b66]'} hover:outline-2`}>
                  {imgUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                    <motion.video
                      src={imgUrl}
                      layoutId={`img-${project.id}`}
                      className="pointer-events-none w-full h-full rounded-xl object-cover"
                      initial={{ filter: "blur(4px)" }}
                      layout="position"
                      animate={{ filter: "blur(0px)" }}
                      transition={transition}
                      autoPlay loop muted playsInline
                    />
                  ) : (
                    <motion.img
                      src={imgUrl}
                      alt={project.title}
                      layoutId={`img-${project.id}`}
                      className="pointer-events-none w-full h-full rounded-xl object-cover"
                      initial={{ filter: "blur(4px)" }}
                      layout="position"
                      animate={{ filter: "blur(0px)" }}
                      transition={transition}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors pointer-events-none flex items-end justify-center pb-4">
                    <p className="text-white font-black text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                      {project.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    )
  }
)

export function ThreeDPhotoCarousel({ projects }: { projects: Project[] }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()
  const { branch } = useBranch()
  
  if (!projects || projects.length === 0) return null;

  const handleClick = (project: Project) => {
    setActiveProject(project)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveProject(null)
    setIsCarouselActive(true)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeProject) {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeProject])

  return (
    <motion.div layout className="relative w-full overflow-hidden py-10">
      <AnimatePresence mode="sync">
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[150] p-5 md:p-20"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
            onClick={handleClose}
          >
            <motion.div
              layoutId={`img-container-${activeProject.id}`}
              className="relative max-w-3xl w-full flex flex-col items-center gap-0 z-[160]"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const imgStr = activeProject.imageUrl || activeProject.images?.[0];
                const isVid = imgStr && imgStr.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i);
                return isVid ? (
                  <motion.video
                    layoutId={`img-${activeProject.id}`}
                    src={imgStr}
                    className={`w-[90%] md:w-full rounded-2xl shadow-2xl object-cover aspect-[4/3] md:aspect-[21/9] border-2 relative z-10 ${branch === 'studio' ? 'border-[#a78b66]/50' : 'border-[#5c1a16]/30'}`}
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    autoPlay loop muted playsInline
                  />
                ) : (
                  <motion.img
                    layoutId={`img-${activeProject.id}`}
                    src={imgStr}
                    className={`w-[90%] md:w-full rounded-2xl shadow-2xl object-cover aspect-[4/3] md:aspect-[21/9] border-2 relative z-10 ${branch === 'studio' ? 'border-[#a78b66]/50' : 'border-[#5c1a16]/30'}`}
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  />
                );
              })()}
              
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: -24 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.3 }}
                className={`flex flex-col items-center text-center p-8 pt-12 rounded-b-3xl shadow-xl z-0 w-[80%] mx-auto ${branch === 'studio' ? 'bg-[#111] border border-[#a78b66]/20 border-t-0' : 'bg-[#f5ecd8] border border-[#5c1a16]/10 border-t-0'}`}
              >
                <h3 className={`text-2xl md:text-3xl font-black mb-2 ${branch === 'studio' ? 'text-white' : 'text-[#5c1a16]'}`}>
                  {activeProject.title}
                </h3>
                {activeProject.description && (
                   <p className={`text-sm mb-6 line-clamp-2 ${branch === 'studio' ? 'text-white/60' : 'text-[#5c1a16]/60'}`}>
                     {activeProject.description}
                   </p>
                )}
                <Link href={`/projects/${activeProject.id}`}>
                  <button className={`mt-2 flex items-center gap-3 px-8 py-3.5 rounded-full font-bold transition-all shadow-md hover:scale-105 ${branch === 'studio' ? 'bg-[#a78b66] text-black hover:bg-[#8b7355]' : 'bg-[#5c1a16] text-[#f5ecd8] hover:bg-[#3D0A0C]'}`}>
                    استعراض المشروع <ArrowLeft size={18} />
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Container specifically with gradients matching background */}
      <div className="relative h-[320px] md:h-[450px] w-full overflow-hidden flex items-center justify-center">
        <Carousel
          handleClick={handleClick}
          controls={controls}
          projects={projects}
          isCarouselActive={isCarouselActive}
          branch={branch}
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-4 md:-mt-8 pointer-events-none">
        <motion.div 
          animate={{ x: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className={`flex items-center gap-3 text-xs md:text-sm font-black tracking-widest ${branch === 'studio' ? 'text-white/40' : 'text-[#5c1a16]/50'}`}
        >
          <ArrowRight size={16} />
          <span>اسحب للتصّفح</span>
          <ArrowLeft size={16} />
        </motion.div>
      </div>
    </motion.div>
  )
}
