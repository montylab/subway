import CanvasManager from './CanvasManager.js'
import GhostLine from './GhostLine.js'
import Mediator from './Mediator.js'
import {EVENTS} from './CONST.js'
import TrainService from './TrainService.js'
import Station from './Station.js'
import levels from '../data/levels.js'
import Menu from './Menu.js'

export default {
	canvasOffset: {x: 0, y: 0},
	lines: [],
	level: 0,
	tickNumber: 0,
	arrivedCnt: 0,
	money: 0,
	initialize() {
		levels[this.level].stations.forEach(station => {
			new Station(station)
		})

		CanvasManager.initialize()
		GhostLine.initialize()
		TrainService.initialize()
		Menu.initialize()

		Mediator.subscribe(EVENTS.passengers.arrived, ()=> {
			console.log('arrived: ',++this.arrivedCnt)
			this.money += 3
			Mediator.fire(EVENTS.money.update, this.money)
		})

		setInterval(this.tick.bind(this), 15)
	},

	tick() {
		Mediator.fire(EVENTS.game.tick, {tickNumber: this.tickNumber++})

		CanvasManager.erase()
		CanvasManager.draw({
			lines: this.lines,
			stations: this.stations
		})
	},

}