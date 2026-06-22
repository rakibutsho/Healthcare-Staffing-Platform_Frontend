import { Mail, MapPin, Phone } from "lucide-react";
import logo from "../../../assets/images/footer-logo.png";
import facebook from "../../../assets/images/facebook.png";
import twitter from "../../../assets/images/twitter.png";
import linkedin from "../../../assets/images/linkedin.png";
import youtube from "../../../assets/images/youtube.png";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#193E58] text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {/* Left Section - Logo & About */}
          <div className="space-y-5">
            <Image
              width={200}
              height={60}
              src={logo}
              alt="AnestheLink Logo"
              className="w-[180px] h-auto object-contain"
            />
            <div>
              <h2 className="text-lg font-semibold mb-2">About AnestheLink</h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                We&apos;re revolutionizing anesthesia staffing by connecting
                hospitals and providers directly — no agencies, no delays, just
                trusted and verified connections that keep operating rooms
                running smoothly.
              </p>
            </div>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/about_us"
                className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Right Section - Contact */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>Washington, D.C.</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>moseskamoga@anesthelink.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>brianna.o.davis@anesthelink.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-4">
              <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
              <div className="flex items-center gap-4">
                <Link href="#" className="hover:opacity-80 transition">
                  <Image
                    src={twitter}
                    alt="Twitter"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </Link>
                <Link href="#" className="hover:opacity-80 transition">
                  <Image
                    src={facebook}
                    alt="Facebook"
                    width={26}
                    height={26}
                    className="w-6 h-6"
                  />
                </Link>
                <Link href="#" className="hover:opacity-80 transition">
                  <Image
                    src={linkedin}
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </Link>
                <Link href="#" className="hover:opacity-80 transition">
                  <Image
                    src={youtube}
                    alt="YouTube"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-gray-300 text-sm">
            &copy; {currentYear} <b>AnestheLink</b>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
