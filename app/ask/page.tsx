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
  const renderResponse = (lr, response, spans, addSpan, idx) => {
    return <Response lr={lr} output={response} spans={spans} addSpan={addSpan} key={idx}>

    </Response>
  }

  return (
    <div className="flex h-dvh w-dvh">
      <Navbar></Navbar>
      <div className="flex flex-col w-5/6 h-full">
        <ResponseContextProvider>
          <ResponseContainer renderResponse={renderResponse}>
          </ResponseContainer>
          <Form></Form>
        </ResponseContextProvider>
      </div>
    </div>
  );
}
