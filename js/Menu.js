import LineService from './LineService.js'
import Mediator from './Mediator.js'
import {EVENTS} from './CONST.js'

export default {
	$menu: document.getElementById('menu'),
	$money: document.getElementById('money'),
	$lines: document.getElementById('lines'),
	$length:  document.getElementById('length'),
	$trainCnt:  document.getElementById('trainCnt'),
	$stationCnt:  document.getElementById('stationCnt'),
	$addTrainBtn:  document.getElementById('addTrainBtn'),
	$removeTrainBtn: document.getElementById('removeTrainBtn'),

	selectedColor: null,

	initialize() {
		this.drawLineChooser()
		this.drawMoney(0)
		this.initEvents()

		Mediator.subscribe(EVENTS.lines.update, e => this.update(e))
		Mediator.subscribe(EVENTS.money.update, e => this.drawMoney(e))
	},

	update(lines) {
		this.drawLineChooser(lines)
		this.drawLineInfo()
	},

	drawMoney(amount) {
		this.$money.innerHTML = amount
	},

	initEvents() {
		this.$lines.addEventListener('click', (e) => {
			if (e.target.tagName !== 'LI') return
			let selected = this.$lines.querySelector('.selected')
			selected && selected.classList.remove('selected')
			selected = e.target
			selected.classList.add('selected')
			this.selectedColor = selected && selected.dataset.color
			this.drawLineInfo()
		})
	},


	drawLineChooser(lines) {
		this.$lines.innerHTML = ''

		lines && lines.forEach(line => {
			const li = document.createElement('li')
			li.dataset.color = line.color
			li.style.backgroundColor = line.color
			if (this.selectedColor === line.color) {
				li.classList.add('selected')
			}
			this.$lines.appendChild(li)
		})
	},

	drawLineInfo() {
		const selected = this.$lines.querySelector('.selected')
		if (!selected) return

		const color = selected.dataset.color
		const line = LineService.getLine(color)

		this.$length.innerHTML = line.getLength()
		this.$trainCnt.innerHTML = line.getTrainsCount()
		this.$stationCnt.innerHTML = line.getStationsCount()
	}
}