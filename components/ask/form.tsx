import { useState, useContext, SetStateAction } from 'react';
import { getAnswer, generate, generateConversation } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import clsx from 'clsx';
import { HistoryContext, HistorySetContext, IdContext, IdSetContext, ResponseContext, ResponseDispatchContext } from '@/app/lib/context';

export default function Form() {
    const [query, setQuery] = useState('');
    const [generating, setGenerating] = useState<boolean>(false);

    const dispatchResponses = useContext(ResponseDispatchContext);
    const setHistory = useContext(HistorySetContext);

    let thisId = useContext(IdContext);
    const setThisId = useContext(IdSetContext);

    function handleChange(e: { target: { value: SetStateAction<string>; }; }) {
        setQuery(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        if (target) {
            const input = target[0] as HTMLInputElement;
            const query = input.value;

            if (query) {
                dispatchResponses({type: 'clear'});
                thisId = 0;
                
                setQuery('');
                setGenerating(true);
                const { messages, newMessage } = await generateConversation([{role: 'user', content: query}]);

                dispatchResponses({type: 'addQuery', query: query, id: thisId});
                let textContent = '';

                for await (const delta of readStreamableValue(newMessage)) {
                    textContent = `${textContent}${delta}`;
                    const action = {type: 'append', id: thisId, append: delta};
                    dispatchResponses(action);
                }

                console.log([
                    ...messages,
                    { role: 'assistant', content: textContent }
                ])
                dispatchResponses({type: 'addHistory', history: [
                    ...messages,
                    { role: 'assistant', content: textContent }
                ], id: thisId});

                setThisId(thisId + 1);
                setGenerating(false);
            }
        }
    }

    return (
        <div className="text-sm w-full h-1/6 text-black border-l-2 border-t-2">
            <form className="bg-white px-8 pt-6 pb-8 h-full flex" onSubmit={handleSubmit}>
                <div className="shadow appearance-none border rounded h-full w-11/12 mx-4 text-gray-700 flex flex-row">
                    {generating ? <svg className="animate-spin h-5 w-5 ml-1 mt-1.5 px-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> : ''}
                    <textarea className={clsx("resize-none leading-tight focus:outline-none focus:shadow-outline w-full py-2", {"px-3": generating === false, "px-1": generating === true})} id="username" placeholder={generating ? 'Generating...' : 'Start a new conversation'} value={query} onChange={handleChange} rows={2} disabled={generating}></textarea>
                </div>
                <button className={clsx('shadow border font-bold rounded p-4 w-1/12', {'text-gray-400': Boolean(query) === false, 'text-emerald-500 hover:bg-emerald-100 bg-emerald-50': Boolean(query) === true})} disabled={!Boolean(query)}>
                    Submit
                </button>
            </form>
        </div>
    );
}