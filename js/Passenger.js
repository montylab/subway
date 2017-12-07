import PassengerService from './PassengerService.js'
import TrainService from './TrainService.js'
import StationService from './StationService.js'
import Mediator from './Mediator.js'
import {EVENTS} from './CONST.js'
import Dijkstra from './dijkstra.js'
import LineService from './LineService.js'

export default class {
	constructor({x = 0, y = 0, state = 'station', startStation, endStation, color}) {
		this.x = x
		this.y = y
		this.state = state
		this.route = []

		this.color = color

		this.startStation = startStation
		this.endStation = endStation

		PassengerService.addPassenger(this)

		Mediator.subscribe(EVENTS.game.tick, e => this.move(e))
		Mediator.subscribe(EVENTS.trains.arrive, e => this.checkTrain(e))
	}

	move({x, y} = {}) {
		this.x = x || this.x
		this.y = y || this.y
	}

	generateRoute() {
		try {
			const graph = LineService.getGraph()
			const route = Dijkstra.find_path(graph, this.startStation.name, this.endStation.name)
			this.route = route || []
		} catch (e) {}
	}

	checkTrain({train, station}) {
		if (train.isContainPassenger(this)) {
			console.log('this one!')
			this.startStation = station
			this.generateRoute()

			train.passengerLeave(this)
			if (this.route.length === 1) {
				Mediator.fire(EVENTS.passengers.arrived)
			} else {
				station.passengerEnter(this)
			}
		}

		if (station.isContainPassenger(this)) {
			this.generateRoute()

			if (train.nextStations.includes(this.route[1]) && station.passengerLeave(this)) {
				train.passengerEnter(this)
			}
		}
	}
}