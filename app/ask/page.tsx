"use client";

import { useContext, useState, useReducer } from 'react';
import Form from "@/components/ask/form"
import ResponseContainer from "@/components/ask/responsecontainer";
import Navbar from "@/components/ask/navbar";
import Response from "@/components/ask/response";
import { LeftRightContext, ResponseContextProvider } from '@/app/lib/context';

interface ResponseType {
  id: number;
  response: string;
}

export default function App() {
  const [leftRight, setLeftRight] = useState([0, 1]);

  const lr_value = {leftRight, setLeftRight};

  return (
    <div className="flex h-dvh w-dvh">
      <Navbar></Navbar>
      <div className="flex flex-col w-5/6 h-full">
        <ResponseContextProvider>
          <ResponseContainer>
          </ResponseContainer>
          <Form></Form>
        </ResponseContextProvider>
      </div>
    </div>
  );
}
