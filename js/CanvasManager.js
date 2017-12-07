import Mediator from './Mediator.js'
import LineService from './LineService.js'
import StationService from './StationService.js'
import GhostLine from './GhostLine.js'
import TrainService from './TrainService.js'
import PassengerService from './PassengerService.js'

const canvas = document.getElementById('plot')
const ctx = canvas.getContext('2d')

const sizes = {
	canvasWidth: 800,
	canvasHeight: 600,

	lineWidth: 6,
	stationSize: 12,
	trainSize: 8,
	stationBorder: 2,
	passengerSize: 3
}

export default {
	initialize(mediator) {
		canvas.width = sizes.canvasWidth
		canvas.height = sizes.canvasHeight
		canvas.style.width = sizes.canvasWidth + 'px'
		canvas.style.height = sizes.canvasHeight + 'px'

		canvas.offset = {
			x: canvas.offsetLeft,
			y: canvas.offsetTop,
		}

		canvas.addEventListener('mousedown', e => Mediator.fire('mousedown', this.getRelativeMousePosition(e)))
		canvas.addEventListener('mousemove', e => Mediator.fire('mousemove', this.getRelativeMousePosition(e)))
		canvas.addEventListener('mouseup', e => Mediator.fire('mouseup', this.getRelativeMousePosition(e)))
	},

	getRelativeMousePosition(e) {
		return {
			x: e.x - canvas.offset.x,
			y: e.y - canvas.offset.y,
		}
	},

	draw({/*lines, stations*/}) {
		const lines = LineService.getLines()
		const stations = StationService.getStations()
		const trains = TrainService.getTrains()

		lines.forEach(line => this.drawLine(line))
		stations.forEach(station => this.drawStation(station))
		trains.forEach(train => this.drawTrain(train))

		this.drawGhostLine()
	},

	erase() {
		ctx.clearRect(0, 0, sizes.canvasWidth, sizes.canvasHeight)
	},

	drawLine({stations, color}) {
		ctx.strokeStyle = color
		ctx.lineWidth = sizes.lineWidth

		ctx.beginPath()
		ctx.moveTo(stations[0].x, stations[0].y)
		for (let i = 1; i < stations.length; i++) {
			ctx.lineTo(stations[i].x, stations[i].y)
		}
		ctx.stroke()
	},

	drawGhostLine() {
		const coords = GhostLine.getCoordinates()
		if (coords.length) {
			ctx.strokeStyle = GhostLine.color
			ctx.lineWidth = sizes.lineWidth

			ctx.globalAlpha = 0.5
			ctx.beginPath()
			ctx.moveTo(coords[0].x, coords[0].y)
			for (let i=1; i<coords.length; i++) {
				ctx.lineTo(coords[i].x, coords[i].y)
			}

			ctx.stroke()
			ctx.globalAlpha = 1
		}
	},


	drawStation({x, y, passengers, color}) {
		ctx.fillStyle = color
		ctx.strokeStyle = '#444'
		ctx.lineWidth = sizes.stationBorder

		ctx.fillRect(x, y, sizes.stationSize, sizes.stationSize)
		ctx.strokeRect(x, y, sizes.stationSize, sizes.stationSize)

		passengers.forEach((passenger, index) => this.drawPassenger(passenger, index*5, 25))
	},

	drawPassenger({x, y, color}, dx=0, dy=0) {
		ctx.fillStyle = color
		ctx.fillRect(x+dx, y+dy, sizes.passengerSize, sizes.passengerSize)
	},

	drawTrain({x, y, color, passengers}) {
		ctx.fillStyle = color
		ctx.fillRect(x, y, 2*sizes.trainSize, sizes.trainSize)
		passengers.forEach((passenger, index) => this.drawPassenger(passenger, index*5, 25))
	},
}