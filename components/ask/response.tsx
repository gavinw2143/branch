import { useState, useRef, useEffect, useContext } from 'react';
import Followup from '@/components/ask/followup';
import { GeneratingContext, ResponseContext, LeftRightContext, ResponseDispatchContext } from '@/app/lib/context';
import QueryBox from '@/components/ask/querybox';
import clsx from 'clsx';
import React from 'react';

type ResponseTypes = {
    lr: string,
    output: string | undefined,
    spans: Array<StoredSpansType>,
    addSpan: (responseId, newSpan) => {}
}

type StoredSpansType = {
    span: HTMLSpanElement,
    parentId: number,
    id: number,
    query: string
}

export default React.memo(Response);

function Response({ lr, output, spans, addSpan }: ResponseTypes) {
    const [focusedSpan, setFocusedSpan] = useState<HTMLSpanElement | null>(null);
    const [storedSpans, setStoredSpans] = useState<Array<StoredSpansType>>(spans);
    const [selection, setSelection] = useState<number[] | null>(null);
    const [selectionText, setSelectionText] = useState<string>('');
    const outputRef = useRef<any>(null);

    const generating = useContext(GeneratingContext);
    const responses = useContext(ResponseContext);
    const lrIds = useContext(LeftRightContext);
    let thisLr = null;
    let query = '';

    if (responses.length > 0 && lr === 'left') {
        thisLr = 0;
        query = responses.find(r => r.id === lrIds[0]).query;
    } else if (responses.length > 1 && lr === 'right') {
        thisLr = 1;
        query = responses.find(r => r.id === lrIds[1]).query;
    }

    const handleFollowup = (thisId: number) => {
        addSpan(lrIds[thisLr], focusedSpan);
        setFocusedSpan(null);
        setSelection(null);
    }

    useEffect(() => {
        const handleSpanHover = () => {}

        const handleSelectionOn = () => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                // Need to check if span overlaps here
                if (!range.collapsed) {
                    const rect = range.getBoundingClientRect();
                    const span = document.createElement('span');

                    span.className = 'bg-emerald-200 hover:bg-emerald-300 hover:cursor-pointer hover:select-none';
                    range.surroundContents(span);
                    const responseDiv = span.parentElement;
                    let pos = null;
                    if (responseDiv) pos = [Math.min((rect.left - responseDiv.offsetLeft), 340), rect.bottom - responseDiv.offsetTop + responseDiv.scrollTop];
                    setFocusedSpan(span);
                    setSelection(pos);
                    setSelectionText(span.innerText);
                }
            }
        };

        const handleSelectionOff = (e: Event) => {
            const selection = window.getSelection();
            selection?.empty();
            const target = e.target as HTMLFormElement;
            if (target.tagName.toLowerCase() !== 'span' && selection && target.id !== 'followup' && !document.getElementById('followup')?.contains(target)) {
                removeSpan(focusedSpan);
                setFocusedSpan(null);
                setSelection(null);
            }
        }

        function removeSpan(element: HTMLSpanElement | null) {
            if (element) {
                const parent = element.parentNode;
                if (parent) {
                    while (element.firstChild) {
                        parent.insertBefore(element.firstChild, element);
                    }
                    parent.removeChild(element);
                    element = null;
                }
            }
        }

        const outputElement = outputRef.current;
        if (outputElement) {
            outputElement.addEventListener('mouseup', handleSelectionOn);
            outputElement.addEventListener('mousedown', handleSelectionOff);
        }

        return () => {
            if (outputElement) {
                outputElement.removeEventListener('mouseup', handleSelectionOn);
                outputElement.removeEventListener('mousedown', handleSelectionOff);
            }
        };
    }, [selection, focusedSpan]);

    return (
        <>
        {lr !== 'none' && <div className="h-full w-1/2 flex flex-col bg-white text-stone-600">
            {query && <QueryBox query={query} lr={lr}/>}
            <div ref={outputRef} className={clsx("relative text-md w-full border-l-2 p-4 overflow-scroll selection:bg-emerald-200 selection:opacity-100", {"h-full": query === '', "h-5/6": query !== ''})}>
                {output}
                {!generating && selection && <Followup selectionText={selectionText} handleFollowup={handleFollowup} lr={lr} position={selection}/>}
            </div>
        </div>}
        </>
    );
}