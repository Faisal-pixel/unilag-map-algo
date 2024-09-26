import { MapPinCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About UniPATH",
  description: "Learn more about UniPATH and how to navigate UNILAG.",
};

export default function About() {
    return (
      <div className="about-page flex items-center justify-center min-h-screen">

        <div className="aboutCard text-white bg-gray-800 bg-opacity-70 px-8 pt-4 pb-2 rounded-lg shadow-lg w-[90%] md:w-[600px]">
          <h1 className="text-3xl font-bold">About <span className="text-orange-500">
              UniPATH
            </span>
          </h1>
          <p className="mt-4 text-lg">
            UniPATH is a mapping guide designed to help users navigate the University of Lagos effectively. It provides detailed routes on important areas in campus, making it easier to find your way.
          </p>
          <p className="mt-2 text-lg">
            You can simply input your current location within UNILAG and your desired destination, and UniPATH will provide the best path for you to take. Looking for the quickest route to a lecture hall or exploring different facilities on campus?
            <br/><span className="flex text-orange-500">UniPATH <MapPinCheck/></span> has you covered.
          </p>
        </div>

      </div>
    );
  }