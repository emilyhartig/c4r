import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const NativeAddon = require('./build/Release/c4r.node');

const iCalculateConnectFour_Minor = 1;
const iCalculateConnectFour_Major = 1;

const eResultReturnCodes = 0;
const eResultReturnCodes_Ok_ui8 = 0;

const szDefaultBook = "7x6.book";

export default class cCalculateConnectFour {
	constructor(str) {
		this.loadBookSync(str);
	}

	loadBookSync(str) {
		return NativeAddon.loadBookSync(str);
	}

	calculateSync(str) {
		return NativeAddon.calculateSync(str);
	}
}