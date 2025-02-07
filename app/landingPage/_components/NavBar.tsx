"use client"
import Navigation from "@/app/landingPage/_components/ui/desktopViewNav"
import { IconExchange, IconHome, IconNewSection, } from "@tabler/icons-react"
import Image from "next/image"
import { motion } from "framer-motion"
import HamburgerMenu from "./ui/hamburgerMenu"
import Link from "next/link"
import { MdAttachMoney } from "react-icons/md";

export function Navbar() {
  const logo = {
    title: "Nexus Beings",
    icon: (
      <Image
        src="https://assets.aceternity.com/logo-dark.png"
        width={40}
        height={40}
        alt="Aceternity"
        className="z-50" // Added z-index here
      />
    ),
    href: "/landingPage",
  }

  const linksMobile = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/landingPage",
    },
    {
      title: "Mission",
      icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/landingPage/Mission",
    },
    {
      title: "Programs",
      icon: <MdAttachMoney className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/landingPage/Programs",
    },
    {
      title: "Updates",
      icon: <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      href: "/landingPage/Updates",
    },
  ]

  const linksDesktop = [
    {
      title: "Home",
      href: "/landingPage",
    },
    {
      title: "Mission",
      href: "/landingPage/Mission",
    },
    {
      title: "Programs",
      href: "/landingPage/Programs",
    },
    {
      title: "Updates",
      href: "/landingPage/Updates",
    },
  ]

  return (
    <motion.div
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 20,
        delay: 0.2,
      }}
      className="flex items-center justify-between w-full shadow-md z-[999] relative"
    >
      {/* Desktop View: Logo and Navigation in a single row */}
      <div className="hidden md:flex items-center gap-2 absolute left-1/2 top-4 transform -translate-x-1/2 z-50">
        <Link href={logo.href}>
          <div className="flex items-center justify-center w-12 h-12">{logo.icon}</div>
        </Link>
        <Navigation links={linksDesktop} />
      </div>

      {/* Mobile View: Logo at top left */}
      <div className="md:hidden fixed top-2 left-4 z-50">
        <Link href={logo.href}>
          <div className="flex items-center justify-center w-12 h-12">{logo.icon}</div>
        </Link>
      </div>

      {/* Mobile Right Dock Positioned at Top Left without margin */}
      <div className="md:hidden mt-8 fixed top-0 left-0 z-40">
        <HamburgerMenu links={linksMobile} />
      </div>
    </motion.div>
  )
}
