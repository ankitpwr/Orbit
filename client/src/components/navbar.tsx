import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar({
  mobileMenu,
  setMobileMenu,
}: {
  mobileMenu: boolean;
  setMobileMenu: (newState: boolean) => void;
}) {
  return (
    <div
      className=" md:w-[60%] w-[90%] md:py-4 py-2 md:px-6 px-4 rounded-full  flex justify-between items-center font-montserrat
bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-[#292929] text-white "
    >
      <h1 className="md:text-xl text-lg  font-semibold">Orbit</h1>
      <div className="hidden md:flex md:gap-8 gap-2 items-center md:text-base  text-sm">
        <h1>feature</h1>
        <h1>about</h1>
        <h1>contact</h1>
      </div>
      <div className="hidden md:flex gap-2 items-center md:text-base  text-sm">
        <Button variant="ghost">Signup</Button>
        <Button variant={"default"}>Get Started</Button>
      </div>
      <div onClick={() => setMobileMenu(true)} className="md:hidden flex">
        <Menu />
      </div>
    </div>
  );
}
