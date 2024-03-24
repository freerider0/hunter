import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import './timeline.css'

// TimelineEvent.js
function TimelineEvent({ event }) {
    const getTextEventChange =(eventChange)=>{
        if(eventChange === 'entry'){
            return 'Entrada Portal'
        }
        if(eventChange === 'left'){
            return 'Retirada Portal'
        }

    }

    const getClassEventChange =(eventChange)=>{
        if(eventChange === 'entry'){
            return 'time-line-event-color-green'
        }
        if(eventChange === 'left'){
            return 'time-line-event-color-red'
        }

    }


    return (
        <div class={'time-line_month-group-event-list_indivual-event'}>
            <div ><strong><span className={getClassEventChange(event.change)}> {getTextEventChange(event.change)} </span> • {event.price.toLocaleString('de-De',{style: 'currency', currency: 'EUR', maximumFractionDigits: 2})}.</strong></div>
            <div>{event.platform_name}, {event.agency}</div>
        </div>
    );
}

// TimelineMonth.js
function TimelineMonth({ month, events }) {
    return (
        <div className={'time-line-month'}>
            <div class={'time-line-month-date'}>
                <div>{month}</div>
            </div>
            <div class={'time-line_month-group-event-list'}>

            {events.map((event, index) => (
                <TimelineEvent key={index} event={event} />
            ))}
            </div>

        </div>
    );
}

// Timeline.js - convertido a componente funcional
function TimeLine({ timeline }) {
    const eventsGroupedByMonth = useMemo(() => {
        const groupedEvents = {};
        Object.entries(timeline).forEach(([date, events]) => {
            const month = date.slice(0, 7); // 'YYYY-MM'
            if (!groupedEvents[month]) {
                groupedEvents[month] = [];
            }
            groupedEvents[month].push(...events);
        });
        return groupedEvents;
    }, [timeline]);

    return (
        <div class={'time-line'}>
            {Object.entries(eventsGroupedByMonth).map(([month, events]) => (
                <TimelineMonth key={month} month={month} events={events} />
            ))}
        </div>
    );
}

export { TimeLine };