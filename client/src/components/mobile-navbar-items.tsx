import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import GoogleAuthWrapper from "./google-auth-wrapper";


export default function MobileNavbarItems({
  mobileMenu,
  setMobileMenu,
}: {
  mobileMenu: boolean;
  setMobileMenu: (newState: boolean) => void;
}) {
  return (
    <div className="flex md:hidden flex-col  w-screen h-screen gap-4 bg-black px-6 py-4 items-center  rounded-xl text-white font-montserrat">
      <div className="flex w-full justify-between  ">
        <h1 className="text-lg  font-semibold">Orbit</h1>

      </div>

     
      <div className="bg-[#282c30] h-[1px] w-full rounded"> </div>

      
    </div>
  );
}
