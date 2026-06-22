import React from 'react';
interface ScheduleCount {
    value: number,
    text: string
}

function ScheduleCount({value, text}: ScheduleCount) {
    return (
        <div className='p-5 bg-[#193E58] rounded-lg text-white flex items-center justify-center flex-col'>
            <h1 className='text-4xl font-bold'>{value}</h1>
            <h1 className='text-lg pt-4'>{text}</h1>
        </div>
    );
}

export default ScheduleCount;