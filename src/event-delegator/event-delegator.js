import { SyntheticEvent } from './synthetic-event';

// Private variables
const KEY = 'EVENT_DELEGATOR_KEY';
const registeredEvents = new Set();

/**
 * EventDelegator is a document level event listener that to listens to events for the entire app
 * and invokes a handler on behalf of a targeted node
 */
export const EventDelegator = {
    /**
     * @param {string} eventType
     */
    registerEventType: eventType => {
        // No-op if the event has already been registered
        if (registeredEvents.has(eventType)) {
            return;
        }

        // Otherwise, register the event
        registeredEvents.add(eventType);

        // Assign a global listener to that event type
        document.addEventListener(eventType, event => {
            // Look at the targeted node and try to invoke its event handler
            EventDelegator.invokeHandler(event.target, eventType, event);
        });
    },

    /**
     * Register event types for the EventDelegator to listen to and manage
     *
     * @param {string[]} eventTypes
     */
    registerEventTypes: eventTypes => {
        eventTypes.forEach(EventDelegator.registerEventType);
    },

    /**
     * Registers an event handler for a specific node
     *
     * @param {Node}   node
     * @param {string} eventType
     * @param {Event}  event
     */
    registerHandler: (node, eventType, handler) => {
        if (!registeredEvents.has(eventType)) {
            EventDelegator.registerEventType(eventType);
        }

        if (!node[KEY]) {
            node[KEY] = {};
        }

        // Only one handler per event type
        node[KEY][eventType] = handler;
    },

    /**
     * Invokes an event handlers registered to a node, if the node has any event handlers
     *
     * @param {Node}   node
     * @param {string} eventType
     * @param {Event}  event
     */
    invokeHandler: (node, eventType, event) => {
        const syntheticEvent = EventDelegator.processEvent(event);

        // No operation if there is no handler tied to the node
        if (!node[KEY] || !node[KEY][eventType]) {
            syntheticEvent.target = node.parentNode;
            if (event.bubbles && node.parentNode) {
                EventDelegator.invokeHandler(node.parentNode, eventType, syntheticEvent);
            }

            return;
        }

        // Otherwise, invoke the handler
        node[KEY][eventType](syntheticEvent);
    },

    /**
     * @param  {Event}          event
     * @return {SyntheticEvent}
     */
    processEvent: event => new SyntheticEvent(event)
};
