import Mediator from './Mediator.js'

export default {
	stations: [],

	getStickyStation({x, y}) {
		return this.stations.find(station => station.isStickToStation({x, y}))
	},

	addStation(station) {
		this.stations.push(station)
		Mediator.fire('stations:update', this.getStations())
	},

	getStations() {
		return this.stations.slice()
	},

	getRandomStation(exceptStation) {
		if (this.stations.length < 2) return
		let randomStation = this.stations[Math.round(Math.random() * (this.stations.length-1))]

		return randomStation.name !== exceptStation.name ? randomStation : this.getRandomStation(exceptStation)
	},

	getStationNear(coords /*{x, y*/) {
		return this.stations.find(station => station.isNearStation(coords))
	}
}
