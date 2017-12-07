// noinspection JSAnnotator
const CONST = {
	cell: 10,
	cellBorder: 2,
	stickyRange: 30,
}

window.game = {
	canvas: null,
	ctx: null,
	dimensions: {
		width: 800,
		height: 600,
	},

	canvasOffset: {
		x: 0,
		y: 0,
	},
	stations: levels[0].stations,
	ghostSegment: {
		show: false,
		startStation: 1,
		stickTo: null,
		end: {x: 0, y: 0},
		color: 'blue',
	},
	lines: [

		{
			segments: [
				{
					from: 2,
					to: 8,
				}],
			color: 'blue',
		},
	],

	drawGhostSegment() {
		const calc = n => n * CONST.cell + CONST.cell / 2 - 1
		const start = this.stations[this.ghostSegment.startStation]
		const end = this.ghostSegment.end

		this.ctx.strokeStyle = this.ghostSegment.color
		this.ctx.globalAlpha = 0.5
		this.ctx.beginPath()
		this.ctx.moveTo(calc(start.x), calc(start.y))
		this.ctx.lineTo(end.x, end.y)
		this.ctx.stroke()

		this.ctx.globalAlpha = 1.0
	},

	sortSegments() {
		this.lines.forEach(line => {
			const segments = []
			segments.push(line.segments[0])
			let i = 0
			while (i < line.segments.length) {
				if (segments[0].from === line.segments[i].to) {
					segments.unshift(line.segments[i])
				}
				if (segments[segments.length - 1].to === line.segments[i].from) {
					segments.push(line.segments[i])
				}
				i++
			}

			line.segments = segments
		})
	},



	getColorsOfStation(stationId) {
		const colors = []
		this.lines.forEach(line => {
			line.segments.forEach(segment => {
				if ((segment.from === stationId || segment.to === stationId) && !colors.includes(line.color)) colors.push(line.color)
			})
		})
		return colors
	},


}

window.game.initialization()