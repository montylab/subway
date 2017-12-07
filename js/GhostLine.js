import Mediator from './Mediator.js'
import StationService from './StationService.js'
import LineService from './LineService.js'
import {COLORS} from './CONST.js'

export default {
	color: 'grey',
	colorIndex: 0,
	availableLines: [],
	stations: [],
	visible: false,
	startStation: null,
	middleStation: null,
	endStation: null,
	mousePosition: {x: 0, y: 0},

	initialize() {
		Mediator.subscribe('mousedown', e => this.mouseDownHandler(e))
		Mediator.subscribe('mouseup', e => this.mouseUpHandler(e))
		Mediator.subscribe('mousemove', e => this.mouseMoveHandler(e))

		window.addEventListener('mousewheel', e => this.mousewheel(e))
	},

	defineColor() {
		const index = Math.abs(this.colorIndex) % (this.availableLines.length + 1)
		this.color = this.availableLines.length === index && COLORS[LineService.getLinesCount()] || this.availableLines[index]
	},

	mouseDownHandler({x, y}) {

		this.stickyStation = StationService.getStickyStation({x, y})

		if (this.stickyStation) {
			this.availableLines = LineService.getAvailableLines(this.stickyStation)
			this.startStation = this.stickyStation
			this.visible = true
			this.defineColor()
			this.mouseMoveHandler(x, y)
			return
		}

		this.stickySegment = LineService.getStickySegment({x, y})
		if (this.stickySegment) {
			this.startStation = this.stickySegment.start
			this.endStation = this.stickySegment.end
			this.visible = true
			this.color = this.stickySegment.color
			this.mouseMoveHandler(x, y)
		}
	},

	mouseUpHandler({x, y}) {
		if (this.middleStation) {
			this.appendGhostMiddleStation()
		} else if (this.startStation && this.endStation) {
			this.appendGhostLine()
		}

		this.visible = false
		this.startStation = null
		this.middleStation = null
		this.endStation = null
		this.stickySegment = null
		this.stickyStation = null
	},

	mouseMoveHandler({x, y}) {
		this.mousePosition = x || y ? {x, y} : this.mousePosition
		if (!this.visible) return

		if (this.stickySegment) {
			const stickyStation = StationService.getStickyStation({x, y})
			if (stickyStation && stickyStation !== this.startStation && stickyStation !== this.endStation) {
				this.middleStation = stickyStation
			} else {
				this.middleStation = null
			}
		} else if (this.stickyStation) {
			const stickyStation = StationService.getStickyStation({x, y})
			if (stickyStation && stickyStation !== this.startStation) {
				this.endStation = stickyStation
			} else {
				this.endStation = null
			}
		}
	},

	mousewheel(e) {
		this.colorIndex += e.deltaY > 0 ? 1 : -1
		this.defineColor()
	},

	getCoordinates() {
		const coords = []
		if (this.visible) {
			coords.push({
				x: this.startStation.x,
				y: this.startStation.y,
			})

			if (this.stickySegment) {
				coords.push(
					{
						x: this.middleStation ? this.middleStation.x : this.mousePosition.x,
						y: this.middleStation ? this.middleStation.y : this.mousePosition.y,
					},
				)
			}
			coords.push({
				x: this.endStation ? this.endStation.x : this.mousePosition.x,
				y: this.endStation ? this.endStation.y : this.mousePosition.y,
			})
		}

		return coords
	},

	appendGhostLine() {
		LineService.appendToLine({
			color: this.color,
			startStation: this.startStation,
			endStation: this.endStation,
		})
	},

	appendGhostMiddleStation() {
		LineService.appendToLine({
			color: this.color,
			startStation: this.startStation,
			middleStation: this.middleStation,
			endStation: this.endStation,
		})
	},
}