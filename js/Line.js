import Utils from './Utils.js'
import Train from './Train.js'
import Mediator from './Mediator.js'
import {EVENTS} from './CONST.js'



export default class {
	constructor(color) {
		this.color = color
		this.lineWidth = 6
		this.stations = []

		this.trains = [new Train({color, line: this})]
	}

	addStation(station) {
		this.stations.push(station)
		Mediator.fire(EVENTS.lines.update, this.getStations())
	}

	appendSegment({startStation, endStation}) {
		if (!this.stations.length) {
			this.addStation(startStation)
			this.addStation(endStation)
		} else if (this.stations[0] === startStation) {
			this.stations.unshift(endStation)
		} else if (this.stations[this.stations.length-1] === startStation) {
			this.stations.push(endStation)
		}

		startStation.addColor(this.color)
		endStation.addColor(this.color)

		Mediator.fire(EVENTS.lines.update, this.getStations())
	}

	appendMiddleStation({startStation, middleStation, endStation}) {
		this.stations.splice(this.stations.indexOf(startStation)+1, 0, middleStation);

		middleStation.addColor(this.color)

		Mediator.fire(EVENTS.lines.update, this.getStations())
	}

	isEndStation(station) {
		const index = this.stations.indexOf(station)
		return index === 0 || index === this.stations.length-1
	}

	getLength() {
		return this.stations.reduce((length, station, index, arr) => {
			if (index !== arr.length-1) {
				length += Utils.distance(station.x, station.y, arr[index+1].x, arr[index+1].y)
			}
			return length
		}, 0)
	}

	getTrainsCount() {
		return this.trains.length
	}

	getStationsCount() {
		return this.stations.length
	}

	getStations() {
		return this.stations.slice()
	}
}