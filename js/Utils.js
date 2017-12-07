import {COLORS} from './CONST.js'

const colorSequences = {}

export default {
	distance(x1, y1, x2, y2) {
		return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
	},

	getNextSequenceColor(sequence) {
		colorSequences[sequence] = colorSequences[sequence] || 0
		return COLORS[colorSequences[sequence]++]
	}
}