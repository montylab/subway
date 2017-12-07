export default {
	events: {},

	fire(eventName, eventObject) {
		const events = this.events[eventName]
		if (events) {
			events.forEach(callback => callback(eventObject))
		}
	},

	subscribe(eventName, callback) {
		if (this.events[eventName]) {
			this.events[eventName].push(callback)
		} else {
			this.events[eventName] = [callback]
		}
	},
}