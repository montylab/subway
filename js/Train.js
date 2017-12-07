import LineService from './LineService.js'
import TrainService from './TrainService.js'
import Utils from './Utils.js'
import {TRAIN, EVENTS} from './CONST.js'
import Passenger from './Passenger.js'
import StationService from './StationService.js'
import Mediator from './Mediator.js'

const TRAIN_RANGE = 1

export default class {
	constructor({color, line}) {
		this.color = color
		this.x = 0
		this.y = 0
		this.speed = TRAIN.topSpeed
		this.position = 0
		this.direction = 1
		this.pastStationName = null
		this.nextStations = []
		this.line = line

		this.passengers = [
			// new Passenger({
			// 	x: this.x,
			// 	y: this.y,
			// 	endStation: StationService.getRandomStation(),
			// 	startStation: StationService.getStickyStation({x: this.x, y: this.y}),
			// }),
			// new Passenger({
			// 	x: this.x,
			// 	y: this.y,
			// 	endStation: StationService.getRandomStation(),
			// 	startStation: StationService.getStickyStation({x: this.x, y: this.y}),
			// }),
			// new Passenger({
			// 	x: this.x,
			// 	y: this.y,
			// 	endStation: StationService.getRandomStation(),
			// 	startStation: StationService.getStickyStation({x: this.x, y: this.y}),
			// })
		]

		TrainService.addTrain(this)
	}

	move() {
		const line = LineService.getLine(this.color)
		if (line) {
			this.position += this.speed * this.direction
			this.calcPosition(line)

			this.checkForStation()

			this.passengers.forEach(p => p.move(this))
		}
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

	calcNextStations() {
		const stationsNames = this.line.stations.map(station => station.name)
		if (this.direction === -1) stationsNames.reverse()
		this.nextStations = stationsNames.slice(stationsNames.indexOf(this.pastStationName) + 1)

		console.log(this.nextStations.join('--------->'))
	}

	calcPosition(line) {
		let acc = 0
		let prev = 0
		for (let i = 0; i < line.stations.length - 1; i++) {
			prev = acc
			acc += Utils.distance(line.stations[i].x, line.stations[i].y, line.stations[i + 1].x, line.stations[i + 1].y)
			if (acc > this.position) {
				const betweenStations = acc - prev
				const prevToTrain = this.position - prev
				const trainToNext = betweenStations - prevToTrain
				const nearestDist = Math.abs(Math.min(prevToTrain, trainToNext))

				const closeFactor = Math.abs(nearestDist / TRAIN.topSpeed / 15)

				this.speed = closeFactor < 1 ? 0.01 + TRAIN.topSpeed * closeFactor : TRAIN.topSpeed

				const dx = line.stations[i + 1].x - line.stations[i].x
				const dy = line.stations[i + 1].y - line.stations[i].y

				this.x = line.stations[i].x + dx / betweenStations * prevToTrain
				this.y = line.stations[i].y + dy / betweenStations * prevToTrain

				return
			}
		}
	}

	checkForStation() {
		const station = StationService.getStationNear(this)
		if (station && this.pastStationName !== station.name) {
			this.arriveToStation(station)
		}
	}

	arriveToStation(station) {
		this.pastStationName = station.name

		if (this.line.isEndStation(station)) {
			this.direction *= -1
		}

		this.calcNextStations()


		Mediator.fire(EVENTS.trains.arrive, {
			station: station,
			train: this,
		})
	}

	isNearTrain({x, y}) {
		return Utils.distance(this.x, this.y, x, y) < TRAIN_RANGE
	}

	isContainPassenger(passenger) {
		return this.passengers.includes(passenger)
	}
}