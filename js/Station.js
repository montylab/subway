import Utils from './Utils.js'
import Passenger from './Passenger.js'
import StationService from './StationService.js'
import Mediator from './Mediator.js'
import {EVENTS} from './CONST.js'

const STICKY_RANGE = 30
const STATION_RANGE = 1

export default class {
	constructor({x, y, color}) {
		this.x = x
		this.y = y
		this.colors = []
		this.passengers = []

		this.color = color || Utils.getNextSequenceColor('stations')

		this.name = x + ' ' + y
		this.size = 0.1
		this.passGeneratorFrequency = ~~(1000 / (this.size + Math.random()))

		StationService.addStation(this)

		Mediator.subscribe(EVENTS.game.tick, e => this.tick(e))
	}

	addColor(color) {
		if (!this.colors.includes(color)) {
			this.colors.push(color)
		}
	}

	tick({tickNumber}) {
		if (tickNumber % this.passGeneratorFrequency === 0) {
			this.createPassenger()
		}
	}

	createPassenger() {
		const endStation = StationService.getRandomStation(this)

		this.passengers.push(new Passenger({
			x: this.x,
			y: this.y,
			color: endStation.color,
			endStation: endStation,
			startStation: StationService.getStickyStation({x: this.x, y: this.y}),
		}))
	}

	passengerEnter(passenger) {
		this.passengers.push(passenger)
	}

	passengerLeave(passenger) {
		const index = this.passengers.indexOf(passenger)
		if (index === -1) return false
		this.passengers.splice(index, 1)
		return true
	}

	removePassenger(passenger) {
		this.passengers.splice(this.passengers.indexOf(passenger), 1)
	}

	isStickToStation({x, y}) {
		return Utils.distance(this.x, this.y, x, y) < STICKY_RANGE
	}

	isNearStation({x, y}) {
		return Utils.distance(this.x, this.y, x, y) < STATION_RANGE
	}

	isContainPassenger(passenger) {
		return this.passengers.includes(passenger)
	}
}