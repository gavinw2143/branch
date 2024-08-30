import React from 'react';
import { FormEventHandler, useState, useContext } from 'react';
import { generateConversation } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import { GeneratingSetContext, HistoryContext, HistorySetContext, IdContext, IdSetContext, LeftRightContext, ResponseDispatchContext } from '@/app/lib/context';
import clsx from 'clsx';

type FollowupTypes = {
    selectionText: string
    handleFollowup: Function,
    lr: string,
    position: number[]
}

export default function Followup({ selectionText, handleFollowup, lr, position }: FollowupTypes) {
    const [query, setQuery] = useState('');
    const history = useContext(HistoryContext);
    const setHistory = useContext(HistorySetContext);
    const setGenerating = useContext(GeneratingSetContext);
    const thisId = useContext(IdContext);
    const setThisId = useContext(IdSetContext);
    const lrIds = useContext(LeftRightContext);
    const dispatchResponses = useContext(ResponseDispatchContext);

    const pos = [...position];

    const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
        setQuery(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setQuery('');
        setGenerating(true);
        if (lr === 'left') {
            dispatchResponses({type: 'addChild', id: lrIds[0], child: thisId});
        } else if (lr === 'right') {
            dispatchResponses({type: 'addChild', id: lrIds[1], child: thisId});
        }

        const { messages, newMessage } = await generateConversation([...history, {role: 'user', content: `${selectionText}\n${query}`}]);
        dispatchResponses({type: 'add', query: query, id: thisId, response: ''});

        let textContent = '';

        for await (const delta of readStreamableValue(newMessage)) {
            textContent = `${textContent}${delta}`;
            const action = {type: 'append', id: thisId, append: delta};
            dispatchResponses(action);
        }

        setHistory([
            ...messages,
            { role: 'assistant', content: textContent },
        ]);

        handleFollowup(thisId);
        setThisId(thisId => thisId + 1);
        setGenerating(false);

    }

    return (<div id='followup' className="absolute w-60 h-60 bg-white border-2 rounded animate-fade" style={{left: `${pos[0]}px`, top: `calc(${pos[1]}px + 0.25rem)`}}>
        <form className="bg-white text-xs h-full w-full p-3 relative" onSubmit={handleSubmit}>
            <div className="shadow appearance-none border rounded w-full h-40 text-gray-700">
                <textarea className={clsx("resize-none leading-tight focus:outline-none focus:shadow-outline w-full h-full p-2")} id="username" placeholder={'Give a followup question'} value={query} onChange={handleChange} rows={2}></textarea>
            </div>
            <button className={clsx('absolute bottom-3 right-3 shadow border font-bold rounded w-1/6 h-1/6 flex justify-center items-center', {'text-gray-400': Boolean(query) === false, 'text-emerald-500 hover:bg-emerald-100 bg-emerald-50': Boolean(query) === true})} type="submit" disabled={!Boolean(query)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
            </button>
        </form>
    </div>);
}