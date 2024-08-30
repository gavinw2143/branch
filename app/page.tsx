"use client";

import Form from "@/components/ask/form"
import Navbar from "@/components/ask/navbar";
import Response from "@/components/ask/response";

export default function App() {
  return (
    <div className="flex h-screen w-screen">
      <Navbar></Navbar>
      <div className="flex flex-col w-5/6 h-full">
        <div className="flex flex-row w-full h-5/6">
          <Response></Response>
          <Response></Response>
        </div>
        <Form></Form>
      </div>
    </div>
  );
}
