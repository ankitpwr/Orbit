import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

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

        <Button
          size={"lg"}
          variant={"ghost"}
          onClick={() => setMobileMenu(false)}
        >
          {" "}
          <X />{" "}
        </Button>
      </div>

      <Button variant="ghost">Signup</Button>
      <Button variant={"default"}>Get Started</Button>
      <div className="bg-[#282c30] h-[1px] w-full rounded"> </div>

      <h1>feature</h1>
      <div className="bg-[#282c30] h-[1px]  w-full"></div>
      <h1>about</h1>
      <div className="bg-[#282c30] h-[1px]  w-full"></div>

      <h1>contact</h1>
    </div>
  );
}
