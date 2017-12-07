import Line from './Line.js'
import Mediator from './Mediator.js'
import Utils from './Utils.js'
import {COLORS, DIMENSIONS} from './CONST.js'

export default {
	lines: [],
	colors: ['red', 'blue', 'orange', 'purple'],

	addLine(line) {
		this.lines.push(line)

		Mediator.fire('lines:update', this.getLines())
	},

	appendToLine({color, startStation, middleStation, endStation}) {
		let line = this.getLine(color)
		if (!line) {
			line = new Line(COLORS[this.lines.length])
			this.addLine(line)
		}


		if (middleStation) {
			line.appendMiddleStation({startStation, middleStation, endStation})
		} else {
			line.appendSegment({startStation, endStation})
		}

		Mediator.fire('lines:update', this.getLines())
	},

	appendSegmentToLine() {},

	getLine(color) {
		return this.lines.find(line => line.color === color)
	},

	getLines() {
		return this.lines.slice()
	},

	getLinesCount() {
		return this.lines.length
	},

	getAvailableLines(station) {
		const lines = []
		this.lines.forEach(line => {
			if (line.isEndStation(station)) {
				lines.push(line.color)
			}
		})
		return lines
	},

	getGraph() {
		const graph = {}

		this.lines.forEach(line => {
			const stations = line.getStations()
			for (let i = 0; i < stations.length - 1; i++) {
				const name = stations[i].name
				const nameNext = stations[i + 1].name
				const dist = Utils.distance(stations[i].x, stations[i].y, stations[i + 1].x, stations[i + 1].y)
				graph[name] = graph[name] || {}
				graph[nameNext] = graph[nameNext] || {}
				graph[name][nameNext] = graph[nameNext][name] = dist
			}
		})

		return graph
	},

	getAllSegments() {
		const segments = []

		this.lines.forEach(line => {
			const stations = line.getStations()
			for (let i = 0; i < stations.length - 1; i++) {
				segments.push({
					start: stations[i],
					end: stations[i + 1],
					color: line.color,
				})
			}
		})

		return segments
	},

	getStickySegment({x, y}) {
		let foundSegment = null
		let minDist = DIMENSIONS.stickyRange / 6
		this.getAllSegments().forEach(segment => {
			const d = Utils.distance(segment.start.x, segment.start.y, segment.end.x, segment.end.y)
			const d1 = Utils.distance(segment.start.x, segment.start.y, x, y)
			const d2 = Utils.distance(segment.end.x, segment.end.y, x, y)
			const offset = d1 + d2 - d
			console.log(offset)
			if (minDist > offset) {
				minDist = offset
				foundSegment = segment
			}
		})

		return foundSegment
	},
}
