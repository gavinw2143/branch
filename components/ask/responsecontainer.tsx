import React from 'react';
import { LeftRightContext, IdContext, ResponseContext, ResponseDispatchContext } from '@/app/lib/context';
import { useContext, useRef } from 'react';
import Response from '@/components/ask/response'

export default function ResponseContainer() {
    const leftRight = useContext(LeftRightContext);
    const responses = useContext(ResponseContext);
    const responseRef = useRef(null);

    function getArray() {
        if (!responseRef.current) {
          responseRef.current = []
        }
        return responseRef.current;
    }

    // Need to get the correct row of responses, based on a focusedSpan path
    // Need to display at least one response offscreen for animation, and have the rest ready to render
    
    return (
        <div className="flex flex-row w-full h-5/6">
            <Response responseId={leftRight[0]} lr='left' output={responses.find(resp => resp.id === leftRight[0])?.response}></Response>
            <Response responseId={leftRight[1]} lr='right' output={responses.find(resp => resp.id === leftRight[1])?.response}></Response>
        </div>
    )
}