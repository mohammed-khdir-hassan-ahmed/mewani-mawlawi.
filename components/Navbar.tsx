'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-12 py-1 md:py-0.5 border-b-2 border-gray-100 top-0 z-40 bg-white gap-6 sticky">
        {/* Left side - Logo */}
        <div className="w-16 h-16 md:w-16 md:h-16 flex-shrink-0">
          <Image
            src="/image/logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Location Button */}
        <Button
          size="lg"
          className="md:size-icon bg-[#386641] hover:bg-[#2a4d30] text-white rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <MapPin className="w-6 h-6 md:w-5 md:h-5" />
        </Button>
      </nav>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90vw] max-w-md md:max-w-lg max-h-[85vh] overflow-y-auto p-3 md:p-6">
          <DialogTitle className="sr-only">Restaurant Information</DialogTitle>

          {/* Content */}
          <div className="bg-white rounded-t-3xl p-3 space-y-3">
             {/* Logo & Name */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <div className="p-3 rounded-lg h-28 w-28">
                <Image
                  src="/image/logo.svg"
                  alt="Logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
          
            </div>
            {/* Social Media Card */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg px-2 py-2 border border-pink-200">
              
              <div className="flex items-center gap-2 mb-2">
             <p className='font-bold text-xs'>سۆشیاڵ میدیاکانمان:</p>
               
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                {/* Snapchat */}
                <a
                  href="https://snapchat.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 rounded-md p-1.5 flex flex-col items-center gap-0.5 transition-all hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.149-.052-.238.015-.225.18-.45.42-.494 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
                  </svg>
                  <span className="text-xs font-bold text-white">Snap</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/964750XXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 rounded-md p-1.5 flex flex-col items-center gap-0.5 transition-all hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="text-xs font-bold text-white">WhatsApp</span>
                </a>

                {/* Viber */}
                <a
                  href="viber://chat?number=964750XXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 rounded-md p-1.5 flex flex-col items-center gap-0.5 transition-all hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.177.693 6.698.623 9.82c-.06 3.11-.13 8.95 5.5 10.541v2.42s-.038.97.602 1.17c.79.25 1.24-.499 1.99-1.299l1.4-1.58c3.85.32 6.8-.419 7.14-.529.78-.25 5.181-.811 5.901-6.652.74-6.031-.36-9.831-2.34-11.551l-.01-.002c-.6-.55-3-2.3-8.37-2.32 0 0-.396-.025-1.038-.016zm.067 1.697c.545-.003.88.02.88.02 4.54.01 6.711 1.38 7.221 1.84 1.67 1.429 2.528 4.856 1.9 9.892-.6 4.88-4.17 5.19-4.83 5.4-.28.09-2.88.73-6.152.52 0 0-2.439 2.941-3.199 3.701-.12.13-.26.17-.35.15-.13-.03-.17-.19-.16-.41l.02-4.019c-4.771-1.32-4.491-6.302-4.441-8.902.06-2.6.55-4.732 2-6.222 1.99-1.8 5.681-2.053 7.511-1.941l-.4-.029zm.358 2.021a.362.362 0 0 0-.34.363c0 .2.161.363.361.363 2.932.01 5.3 2.379 5.311 5.311 0 .2.162.362.361.362s.36-.162.36-.362c-.01-3.333-2.7-6.027-6.032-6.037h-.021zm-3.041.94a.956.956 0 0 0-.6.231c-.32.26-.63.56-.91.9-.28.35-.17.47-.05.7.45.88 1.51 2.699 2.8 4.13s3.25 2.35 4.131 2.8c.23.12.35.23.71-.05.33-.28.63-.59.89-.91.26-.32.32-.44.23-.7-.21-.53-1.201-1.59-1.721-2.05-.46-.4-.84-.14-1.091.03-.25.16-.37.24-.52.24s-.27-.06-.44-.17c-.51-.31-1.141-.8-1.64-1.32-.51-.51-.99-1.14-1.311-1.65-.09-.17-.14-.29-.14-.44s.08-.27.24-.52c.17-.25.43-.631.03-1.091-.46-.52-1.52-1.511-2.05-1.721a.597.597 0 0 0-.21-.039l-.01-.002zm3.121 1.47a.36.36 0 0 0-.34.362c0 .2.162.362.361.362 2.133 0 3.871 1.738 3.871 3.871 0 .2.161.361.361.361s.36-.161.36-.361c0-2.535-2.058-4.595-4.592-4.595h-.021zm0 1.674a.36.36 0 0 0-.34.362c0 .2.161.362.36.362 1.345 0 2.44 1.096 2.44 2.441 0 .2.162.361.362.361s.361-.161.361-.361c0-1.744-1.42-3.164-3.162-3.164l-.021-.001z" />
                  </svg>
                  <span className="text-xs font-bold text-white">Viber</span>
                </a>
              </div>
            </div>

            {/* Phone Numbers Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg px-2 py-2 border-2 border-blue-200">
              
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-500 rounded-full p-1.5">
                  <Phone size={14} className="text-white" />
                </div>
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  ژمارە تەلەفۆن
                </p>
              </div>
              <button
                onClick={() => window.location.href = 'tel:+964123456789'}
                className="text-sm font-bold text-blue-900 hover:text-blue-600 transition break-all text-left hover:underline"
              >
                +964 750 XXX XXXX
              </button>
            </div>

            {/* Opening Hours Card */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg px-2 py-2 border-2 border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-amber-500 rounded-full p-1.5">
                  <Clock size={14} className="text-white" />
                </div>
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  کراوەیە
                </p>
              </div>
              <p className="text-sm font-bold text-amber-900">
                11:00 - 23:00
              </p>
              <p className="text-[10px] text-amber-700 mt-1">
                هەروەها روژانە
              </p>
            </div>

            {/* Location Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg px-2 py-2 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-purple-500 rounded-full p-1.5">
                  <MapPin size={14} className="text-white" />
                </div>
                <p className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                  ناونیشان
                </p>
              </div>
              <p className="text-[10px] text-purple-900 font-semibold leading-snug">
                شاری کوردستان - بازاڕ
              </p>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full mt-3 bg-[#386641] hover:bg-[#2a4d30] text-white rounded-lg py-2 md:py-3 font-semibold text-sm"
            >
              داخستن
            </Button>

           
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
