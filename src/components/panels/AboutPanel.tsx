"use client";

import SplitText from "../reactbits/SplitText";
import FadeContent from "../reactbits/FadeContent";
import Image from "next/image";
import ProfileCard from "../reactbits/ProfileCard";

export function AboutPanel() {
  return (
    <section id="about" className="py-24 bg-[#0B1121] text-slate-300 relative overflow-hidden z-20">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <SplitText
            text="About Me"
            className="text-3xl md:text-5xl font-bold text-white mb-4"
            delay={30}
            duration={1}
            ease="power2.out"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0 relative h-[450px] lg:h-[540px]">
            <ProfileCard
              name="Mohsin Malik"
              title="AI Engineer"
              handle="mohsinmalik"
              status="Online"
              contactText="Hire Me"
              avatarUrl="/images/about-avatar.jpg"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              behindGlowColor="#f97316"
              behindGlowSize="50%"
              behindGlowEnabled={true}
              miniAvatarUrl="/images/about-avatar.jpg"
              onContactClick={() => window.location.href = "#contact"}
              innerGradient="linear-gradient(145deg, rgba(8, 11, 22, 0.8) 0%, rgba(249, 115, 22, 0.1) 100%)"
              className="w-full h-full max-w-sm lg:max-w-md mx-auto"
            />
          </div>

          {/* Right: Content & Stats */}
          <FadeContent 
            blur={true} 
            duration={1.2} 
            ease="power2.out" 
            initialOpacity={0}
            delay={200}
            className="w-full md:w-1/2"
          >
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-8">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores suscipit expedita blanditiis temporibus nostrum nulla fugit consequuntur! Ullam earum perspiciatis sit ea, asperiores dolorum illum temporibus quidem? Iusto, officia mollitia!
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="text-center md:text-left">
                <h4 className="text-4xl lg:text-5xl font-bold text-orange-500 mb-2">5+</h4>
                <p className="text-slate-400 text-sm uppercase tracking-wider">Education</p>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-4xl lg:text-5xl font-bold text-orange-500 mb-2">10+</h4>
                <p className="text-slate-400 text-sm uppercase tracking-wider">Years Experience</p>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-4xl lg:text-5xl font-bold text-orange-500 mb-2">100+</h4>
                <p className="text-slate-400 text-sm uppercase tracking-wider">Projects Completed</p>
              </div>
            </div>

            <button className="px-8 py-4 rounded-full border border-orange-500/50 text-white font-medium hover:bg-orange-500 transition-colors duration-300 w-fit shrink-0">
              Learn More
            </button>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
