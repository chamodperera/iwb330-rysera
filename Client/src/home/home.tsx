import React from "react";
import printer from "../assets/printer.png";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.png";
import { Button } from "../components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "../components/ui/carousel";
import { Card, CardContent } from "../components/ui/card";
import AutoScroll from "embla-carousel-auto-scroll";
import insta from "../assets/icons/insta.svg";
import facebook from "../assets/icons/facebook.svg";
import linkedin from "../assets/icons/linkedin.svg";
import printerVideo from "../assets/printer.mp4";

// Create an array from image assets
const images = [image1, image2, image3, image4, image5, image6];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col h-full">
      <div className="container-xl place-self-center relative my-5 text-center">
        <span
          className="text-white text-7xl font-poppins font-bold"
          style={{
            background: `linear-gradient(to bottom right, #000 0%, #343434 50%) bottom right / 60% 50% no-repeat,
                        linear-gradient(to bottom left, #000 0%, #343434 50%) bottom left / 50% 50% no-repeat,
                        linear-gradient(to top left, #000 0%, #343434 50%) top left / 50% 50% no-repeat,
                        linear-gradient(to top right, #000 0%, #343434 50%) top right / 50% 50% no-repeat`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          3D Printing
        </span>
        <span className="text-white text-2xl font-poppins font-bold mt-2 absolute left-36 bottom-4">
          RYSERA
        </span>
      </div>
      <div className="w-1/3 border-t-2 border-white mt-4"></div>
      <div className="flex flex-col md:flex-row place-content-evenly items-center">
        <div className="flex flex-col font-raleway font-bold text-center md:text-left">
          <span className="text-white text-3xl text-neutral-600">
            Precision
          </span>
          <span className="text-white text-2xl">
            in Every Print
          </span>
          <span className="text-white text-3xl text-neutral-600 mt-2">
            Innovation
          </span>
          <span className="text-white text-2xl mb-14">
            in Every Design
          </span>
          <Button variant="secondary">Get a Quote</Button>
        </div>
        <video
           src={printerVideo}
          autoPlay
          loop
          muted
          className="w-1/3 h-1/6 object-cover"
        />
      </div>
      <div className="w-2/3 border-t-2 border-white mt-6 mx-auto"></div>
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[AutoScroll({ speed: 0.5 })]}
        className="overflow-x-hidden"
      >
        <CarouselContent className="flex carousel-scroll mt-10">
          {Array.from({ length: 10 }).map((_, index) => (
        <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/6">
          <div className="p-1">
            <Card className="rounded-none border-0 bg-black">
          <CardContent className="flex items-center justify-center p-0 border-0 aspect-video">
            <img
              src={images[index % images.length]}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </CardContent>
            </Card>
          </div>
        </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="bg-black w-full flex flex-row justify-center p-4">
        <span className="text-white text-sm font-raleway font-normal pr-4">
          All Rights Reserved. © 2024 Rysera Innovation
        </span>
        <a href="https://www.linkedin.com/company/99121245" target="_blank" rel="noopener noreferrer">
          <img src={linkedin} alt="linkedin" className="w-6 h-6 ml-2" />
        </a>
        <a href="https://www.instagram.com/rysera.innovations/" target="_blank" rel="noopener noreferrer">
          <img src={insta} alt="instagram" className="w-6 h-6 ml-2" />
        </a>
        <a href="https://www.facebook.com/Rysera.innovations?_rdc=1&_rdr" target="_blank" rel="noopener noreferrer">
          <img src={facebook} alt="facebook" className="w-6 h-6 ml-2" />
        </a>
      </div>
    </div>
  );
};

export default Home;

