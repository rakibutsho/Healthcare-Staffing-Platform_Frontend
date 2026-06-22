import React from 'react';
interface ScheduleCount {
    heading: string,
    medium: string,
    shift: string
}

function FacilityHomeCard({heading, medium, shift}: ScheduleCount) {
    return (
        <div className='p-5 bg-[#193E58] rounded-lg text-white '>
            <h1 className='text-xl font-bold'>{heading}</h1>
            <h1 className='text-lg pt-4'>{medium}</h1>
            <h1 className='text-lg pt-4'>{shift}</h1>
            
        </div>
    );
}

export default FacilityHomeCard;