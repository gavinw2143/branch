import { createContext, useReducer, useState } from 'react';

export const HistoryContext = createContext(null);
export const HistorySetContext = createContext(null);

export const LeftRightContext = createContext(null);
export const LeftRightSetContext = createContext(null);

export const IdContext = createContext(null);
export const IdSetContext = createContext(null);

export const ResponseContext = createContext(null);
export const ResponseDispatchContext = createContext(null);

export const GeneratingContext = createContext(null);
export const GeneratingSetContext = createContext(null);

export function ResponseContextProvider({ children }) {
    const [responses, dispatchResponses] = useReducer(responsesReducer, []);
    const [history, setHistory] = useState([]);
    const [leftRight, setLeftRight] = useState([0, 1]);
    const [thisId, setThisId] = useState(0);
    const [generating, setGenerating] = useState(false);

    return (
        <HistoryContext.Provider value={history}>
        <HistorySetContext.Provider value={setHistory}>
            <LeftRightContext.Provider value={leftRight}>
            <LeftRightSetContext.Provider value={setLeftRight}>
                <GeneratingContext.Provider value={generating}>
                <GeneratingSetContext.Provider value={setGenerating}>
                    <IdContext.Provider value={thisId}>
                    <IdSetContext.Provider value={setThisId}>
                        <ResponseContext.Provider value={responses}>
                        <ResponseDispatchContext.Provider value={dispatchResponses}>
                            {children}
                        </ResponseDispatchContext.Provider>
                        </ResponseContext.Provider>
                    </IdSetContext.Provider>
                    </IdContext.Provider>
                </GeneratingSetContext.Provider>
                </GeneratingContext.Provider>
            </LeftRightSetContext.Provider>
            </LeftRightContext.Provider>
        </HistorySetContext.Provider>
        </HistoryContext.Provider>
    )
}

function responsesReducer(responses: any, action: any) {
    switch (action.type) {
        case 'add': {
            return [
                ...responses,
                {
                  id: action.id,
                  query: action.query,
                  response: action.response,
                  children: []
                },
            ];
        }
        case 'append': {
            return responses.map((r: any) => {
                if (r.id === action.id) {
                    return {
                        ...r,
                        response: r.response + action.append
                    }
                } else {
                  return r;
                }
            });
        }
        case "addChild": {
            return responses.map((r: any) => {
                if (r.id === action.id) {
                    return {
                        ...r,
                        children: [...r.children, action.child]
                    }
                } else {
                  return r;
                }
            });
        }
        case 'remove': {
            return responses.filter((r: any) => r.id !== action.id);
        }
        case 'clear': {
            return [];
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}