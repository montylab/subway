import Train from './Train.js'
import Mediator from './Mediator.js'
import {EVENTS} from './CONST.js'

export default {
	trains: [],

	initialize() {
		Mediator.subscribe(EVENTS.game.tick, (e) => this.move(e))
	},

	addTrain(train) {
		this.trains.push(train)
		Mediator.fire(EVENTS.trains.update, this.getTrains())
	},

	move(e) {
		this.trains.forEach(train => train.move())
	},

	getTrains() {
		return this.trains.slice()
	},

	getTrainNear(coords /*{x, y}*/) {
		return this.trains.find(train => train.isNearTrain(coords))
	}
}
