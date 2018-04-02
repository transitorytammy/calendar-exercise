import React, {PureComponent} from 'react';
import Calendar from './Calendar';
import EventDetailOverlay from './EventDetailOverlay';
import {filterEventsByDay, getEventFromEvents, getDisplayDate} from '../utils';
import DATA_SET from '../utils/data';

import './Page.css';

const DayNavigator = ({dateDisplay, onPrev, onNext}) => {
    return (
        <nav className="page__nav">
            <button
                className="page__nav-button page__prev-day"
                title="Go to previous day"
                onClick={onPrev}
            />
            <h2 className="page__date">{dateDisplay}</h2>
            <button
                className="page__nav-button page__next-day"
                title="Go to next day"
                onClick={onNext}
            />
        </nav>
    );
};

export default class Page extends PureComponent {
    state = {
        // unfiltered list of events
        events: DATA_SET,

        // The currently selected day represented by numerical timestamp
        day: Date.now(),

        // The currently selected event in the agenda
        // (mainly to trigger event detail overlay)
        selectedEventId: undefined
    }

    _escClose(e) {
        let eventDetailShowing = document.getElementsByClassName('event-detail-overlay').length;

        if (e.keyCode === 27 && eventDetailShowing) {
            this._handleEventDetailOverlayClose();
        }
    }

    _handleSelectEvent(selectedEventId) {
        document.body.classList.add('page--scroll');
        this.setState({selectedEventId});
    }

    _handleEventDetailOverlayClose() {
        document.body.classList.remove('page--scroll');
        this.setState({selectedEventId: undefined});
    }

    _handlePrev() {
        let day = this.state.day;
        let currentDate = new Date(day);
        let nextDate = currentDate.setDate(currentDate.getDate() - 1);

        this.setState({day: nextDate});
    }

    _handleNext() {
        let day = this.state.day;
        let currentDate = new Date(day);
        let nextDate = currentDate.setDate(currentDate.getDate() + 1);

        this.setState({day: nextDate});
    }

    render() {
        let {events, day, selectedEventId} = this.state;
        let filteredEvents = filterEventsByDay(events, day);
        let selectedEvent = getEventFromEvents(events, selectedEventId);
        let eventDetailOverlay;

        if (selectedEvent) {
            eventDetailOverlay = (
                <EventDetailOverlay
                    event={selectedEvent}
                    onClose={this._handleEventDetailOverlayClose.bind(this)}
                />
            );
        }

        return (
            <div className="page" onKeyDown={(e) => this._escClose(e)}>
                <header className="page__header">
                    <h1 className="page__title">Daily Agenda</h1>
                </header>
                <DayNavigator
                    dateDisplay={getDisplayDate(day)}
                    onPrev={this._handlePrev.bind(this)}
                    onNext={this._handleNext.bind(this)}
                />
                <Calendar events={filteredEvents} onSelectEvent={this._handleSelectEvent.bind(this)} />
                {eventDetailOverlay}
            </div>
        );
    }
}
