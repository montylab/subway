import Mediator from './Mediator.js'

export default {
	passengers: [],


	addPassenger(passenger) {
		this.passengers.push(passenger)
		Mediator.fire('passengers:update', this.getPassengers())
	},

	getPassengers() {
		return this.passengers.slice()
	}
}
