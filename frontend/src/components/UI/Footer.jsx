import React from "react";
import "font-awesome/css/font-awesome.min.css";

export default function Footer() {
  return (
    <div className="bottom-0  w-full">
      <div className="bg-slate-900 text-white h-[200px]">
        <h1 className="font-semibold p-5 text-center text-xl">
          Making the world a better place through constructing elegant
          Hierarchies.
        </h1>
        <div className="flex justify-between">
          <h2 className=" text-slate-500 p-5 text-center mx-8 ">
            Our Service is used in overall Country
          </h2>
          <div className="flex justify-center space-x-5 mt-4 px-9 mx-8">
            <i className="fa fa-facebook fa-2x text-slate-500 hover:text-blue-500 cursor-pointer"></i>
            <i className="fa fa-instagram fa-2x text-slate-500 hover:text-pink-500 cursor-pointer"></i>
            <i className="fa fa-twitter fa-2x text-slate-500 hover:text-white cursor-pointer"></i>
            <i className="fa fa-whatsapp fa-2x text-slate-500 hover:text-green-500 cursor-pointer"></i>
            <i className="fa fa-youtube fa-2x text-slate-500 hover:text-red-700 cursor-pointer"></i>
          </div>
        </div>
        <hr className="mx-8 px-5 border-0.5 text-slate-600" />
        <div className="flex justify-between">
          <h1 className="text-slate-500 mx-8 px-5 pt-2">
            © 2025 Point of Sales. All rights reserved.
          </h1>
          <h1 className="text-slate-500 mx-8 px-5 pt-2">
            Developed by Zain Ul Abideen
          </h1>
        </div>
      </div>
    </div>
  );
}
