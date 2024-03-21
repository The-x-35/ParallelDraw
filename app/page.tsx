"use client";
import Live from "@/components/Live";
import { Room } from "./Room";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { Attributes } from "@/types/type";
import { SetStateAction } from "react";
export default function Page() {
  return (
    <main className="h-screen overflow-hidden">
      {/* <Navbar /> */}
      <section className="flex h-full flex-row">
       <LeftSidebar allShapes={[]} />
       <Live />
       <RightSidebar elementAttributes={{
          width: "",
          height: "",
          fontSize: "",
          fontFamily: "",
          fontWeight: "",
          fill: "",
          stroke: ""
        }} setElementAttributes={function (value: SetStateAction<Attributes>): void {
          throw new Error("Function not implemented.");
        } } fabricRef={undefined} activeObjectRef={undefined} isEditingRef={undefined} syncShapeInStorage={function (obj: any): void {
          throw new Error("Function not implemented.");
        } } />
      </section>
    </main>
  );
}