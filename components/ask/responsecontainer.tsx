import React from 'react';
import { LeftRightContext, ResponseContext} from '@/app/lib/context';
import { useContext, useState, useEffect } from 'react';
import Response from '@/components/ask/response'
import { render } from 'react-dom';

export default function ResponseContainer({ renderResponse }) {
    const leftRight = useContext(LeftRightContext);
    const responses = useContext(ResponseContext);
    const [enhancedResponses, setEnhancedResponses] = useState([]);

    useEffect(() => {
        // Issues with black space on initial render
        setEnhancedResponses(responses.map(r => ({ ...r, spans: [] })));
    }, [responses]);

    const addSpanToResponse = (responseId, newSpan) => {
        setEnhancedResponses(responses =>
            responses.map(r =>
                r.id === responseId
                    ? { ...r, spans: [...r.spans, newSpan] }
                    : r
            )
        );
    };

    // Need to get the correct row of responses, based on a focusedSpan path
    // Need to display at least one response offscreen for animation, and have the rest ready to render
    
    return (
        <div className="flex flex-row w-full h-5/6">
            {enhancedResponses?.map((r, idx) => {
                if (r.id === leftRight[0]) {
                    return renderResponse('left', r.response, r.spans, addSpanToResponse, idx);
                } else if (r.id === leftRight[1]) {
                    return renderResponse('right', r.response, r.spans, addSpanToResponse, idx);
                }
                return renderResponse('none', r.response, r.spans, addSpanToResponse, idx);
            })}
        </div>
    )
}