import clsx from 'clsx';
import { useContext } from 'react';
import { LeftRightContext, LeftRightSetContext, ResponseContext } from '@/app/lib/context';

export default function Back({ lr }) {
    const leftRight = useContext(LeftRightContext);
    const setLeftRight = useContext(LeftRightSetContext);
    const responses = useContext(ResponseContext);

    function handleClick() {
        const parentId = responses.find(r => r.id === leftRight[0]).parent;

        setLeftRight([parentId, leftRight[0]])
        console.log([parentId, leftRight[0]]);
    }
    
    return (
    <>
    {lr === 'left' && <button className={clsx("flex flex-col items-center justify-evenly shadow border rounded p-1 w-12 h-12 select-none animate-fade cursor-default", {"hover:text-emerald-500 hover:bg-emerald-100 bg-emerald-50 hover:cursor-pointer" : Boolean(leftRight[0])})} onClick={handleClick} disabled={!Boolean(leftRight[0])}>
        <div className="h-1/3 w-1/3 text-xs">1/1</div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-1/2 w-1/2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
    </button>}
    </>)
}