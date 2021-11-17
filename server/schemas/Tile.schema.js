const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TileSchema = new Schema({
	positionX: {
		type: Number,
		default: 0
	},
	positionY: {
		type: Number,
		default: 0
	},
	positionZ: {
		type: Number,
		default: 0
	},
	width: {
		type: Number,
		default: 200
	},
	height: {
		type: Number,
		default: 200
	},
	minimized: {
		type: Boolean,
		default: false
	},
	maximized: {
		type: Boolean,
		default: false
	},
	deleted: {
		type: Boolean,
		default: false
	},
	content: {
		type: {
			type: String,
			default: ""
		},
		logo: {
			type: String,
			default: ""
		},
		header: {
			type: String,
			default: ""
		},
		value: {
			type: String,
			default: ""
		},
		extra: {
			type: String,
			default: ""
		}
	}
});

module.exports = Tile = mongoose.model("tile", TileSchema);