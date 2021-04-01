/* Imports */
//{
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { Telegraf, Markup } = require('telegraf')
const { telegrafThrottler } = require('telegraf-throttler');

const fastify = require('fastify');
const telegrafPlugin = require('fastify-telegraf');

import { default as c4s } from './cpp/index.js';
//}
/* Imports */

const g_c4s = new c4s("./books/7x6.book");

const InThrottlerErrorHandler = async (ctx, next, error) => {
	if(ctx.update.callback_query) return ctx.answerCbQuery('Hold on, too fast');

	return true;
}

const ThrottlerOptions = { group: {}, in: { highWater: 0, maxConcurent: 1, minTime: 800 }, inThrottlerError: InThrottlerErrorHandler }
const throttler = telegrafThrottler(ThrottlerOptions);

/* Constants */
//{
let g_iLastButtonPos = 0;

const g_szWhite = '⚪';
const g_szRed = '🔴';
const g_szBlue = '🔵';

const g_iGameBoardColumns = 7;
const g_iGameBoardLines = 6;

const g_iGameBoardCells = g_iGameBoardColumns * g_iGameBoardLines;
const g_iMaxMoves = g_iGameBoardCells;

const g_iBoardColumns = g_iGameBoardColumns;
const g_iBoardLines = g_iGameBoardLines + 1;

const g_iBoardCells = g_iBoardColumns * g_iBoardLines;

const g_iBoardRatesLineSize = g_iBoardCells - g_iGameBoardCells;
const g_iBoardRatesLineIndex = g_iGameBoardLines;
const g_iBoardRatesLineStartPos = g_iGameBoardCells;

let g_iAdditionCells = 0;
g_iLastButtonPos = g_iBoardCells;

const g_iForceCalculationButtonPos = g_iLastButtonPos++;	const g_iForceCalculationButtonColumn = g_iAdditionCells++;
const g_iEditButtonPos = g_iLastButtonPos++;				const g_iEditButtonColumn = g_iAdditionCells++;
const g_iColorButtonPos = g_iLastButtonPos++;				const g_iColorButtonColumn = g_iAdditionCells++;

const g_iStateLineIndex = g_iBoardLines;

const g_iBoardLinesLimit = g_iBoardLines + 1;
const g_iBoardCellsLimit = g_iBoardCells + g_iAdditionCells;


const iGeneratorOf7DecimialPart = (iNum) => ((iNum/g_iGameBoardColumns).toFixed(1))[2];
const mapOf7DecimialPart = Object.freeze({ [iGeneratorOf7DecimialPart(0)]: 0, [iGeneratorOf7DecimialPart(1)]: 1, [iGeneratorOf7DecimialPart(2)]: 2, [iGeneratorOf7DecimialPart(3)]: 3, [iGeneratorOf7DecimialPart(4)]: 4, [iGeneratorOf7DecimialPart(5)]: 5, [iGeneratorOf7DecimialPart(6)]: 6 });

const defaultRates = g_c4s.calculateSync(""); // get from c module

const g_iStateUrlIndex = 0;
const g_iColumnsUrlIndex = 1;


g_iLastButtonPos = undefined;
//}
/* Constants */


/* Board */
//{
let objPositions = {};

const createBoard = /* async  */function () {
	let b = new Array(g_iBoardCellsLimit);
	let i, l;
	let column_ = 0, line_ = 0;

	for(i = 0, l = g_iGameBoardCells; i < l; i++) {
		if(i && (i % g_iGameBoardColumns === 0)) { column_ = 0; line_++; }

		objPositions[i] = {c: column_, l: line_};
		b[i] = Markup.button.callback(g_szWhite, i);

		column_++;
	}

	line_++;
	column_ = 0;

	l = defaultRates.length;
	i = g_iBoardRatesLineStartPos;
	for(let i_ = 0; i_ < l; i++, i_++) {
		if(i_ && (i_ % g_iGameBoardColumns === 0)) { column_ = 0; line_++; }

		objPositions[i] = {c: column_, l: line_};
		b[i] = Markup.button.callback(defaultRates[i_], i);

		column_++;
	}

	line_++;

	objPositions[g_iForceCalculationButtonPos] = {c: g_iForceCalculationButtonColumn, l: line_};
	b[g_iForceCalculationButtonPos] = Markup.button.callback("Calculate", g_iForceCalculationButtonPos);

	objPositions[g_iEditButtonPos] = {c: g_iEditButtonColumn, l: line_};
	b[g_iEditButtonPos] = Markup.button.callback("Edit", g_iEditButtonPos);

	objPositions[g_iColorButtonPos] = {c: g_iColorButtonColumn, l: line_};
	b[g_iColorButtonPos] = Markup.button.callback(g_szRed, g_iColorButtonPos);

	return b;
}

const initialBoard = createBoard();
objPositions = Object.freeze(objPositions);
//}
/* Board */

/* Utils */
//{
const getPayloadFromLink = (str) => str.substr(g_szUrlLength);
const g_szGenerateNewLinks = (str1, str2, str3) => `<a href="${g_szUrl}${str1}">&#8203;</a><a href="${g_szUrl}${str2}">&#8203;</a>Current move: ${str3}`;
const changeRatesLineValues = (arr, arr2) => { for(let i = 0, l = g_iBoardRatesLineSize, t; i < l; i++) { t = arr[i]; arr2[i].text = t === -1000 ? '0' : t; } }

const closeConnections = async () => {
	if(bot && bot.telegram) {
		await bot.telegram.deleteWebhook({ drop_pending_updates: true });
		try { await bot.telegram.callApi('close', {}); } catch(e) {}
	}
}

const g_szColumnsString = `${g_iGameBoardLines}`.repeat(g_iGameBoardColumns);

const g_szUrl = "https://t.me/";
const g_szUrlLength = g_szUrl.length;

const g_szInitText = g_szGenerateNewLinks(' ', g_szColumnsString, g_szRed);
const g_InitObject = Object.freeze({ reply_markup: Markup.inlineKeyboard([...initialBoard], {columns: g_iGameBoardColumns}).reply_markup, parse_mode: 'HTML', disable_web_page_preview: true, disable_notification: true });
//}
/* Utils */

/* Constants */
//{
const WEBHOOK_DOMAIN = 'Your domain';
const SECRET_PATH = '/Your secret path';
const WEBHOOK_URL = `https://${WEBHOOK_DOMAIN}:443${SECRET_PATH}`;

const LOCAL_IP_BINDING = '0.0.0.0';
const LOCAL_PORT_BINDING = 3000;

const botToken = 'Bot token';

const __botToken = botToken || process.env.token;
const token = __botToken

const g_szAllowedType = 'private';

const g_AllowedUpdateTypes = ['message', 'callback_query'];
const g_AllowedUpdateTypes_MessageIndex = 0;
const g_AllowedUpdateTypes_CallbackQueryIndex = 1;

const g_AllowedCmd = '/start';
const g_AllowedCmdMaxLength = g_AllowedCmd.length;


const g_CallbackQueryOptions = Object.freeze({ show_alert: true });
/* const g_CallbackQueryOptionsRegular = Object.freeze({}); */
const g_szCalculationText = 'Something went wrong on the current board. Create a new one.'
const g_szGenerateNotificationText = (state, won) => ``;
const g_szGenerateNotificationTextRegular = (won) => `${won} won!`;

const g_szChangeColor = `You can't change color now. Create a new board.`;
//}
/* Constants */

const bot = new Telegraf(token);
const app = fastify(); app.register(telegrafPlugin, { bot, path: SECRET_PATH });

bot.use(async (ctx, next) => {
	if(ctx.update.callback_query === undefined && ctx.update.message.chat.type !== g_szAllowedType) return false;

	return next();
});

bot.use(throttler);

bot.on(g_AllowedUpdateTypes[g_AllowedUpdateTypes_MessageIndex], (ctx) => {
	let message = ctx.update.message;
	if(message.length > g_AllowedCmdMaxLength) return;

	let entities = message.entities;
	if(entities === undefined || entities.length > 1 || entities[0].type[0] !== 'b') return;

	if(g_AllowedCmd !== message.text) return;
	
	message = undefined;
	entities = undefined;

	return ctx.reply(g_szInitText, g_InitObject);
});

bot.on(g_AllowedUpdateTypes[g_AllowedUpdateTypes_CallbackQueryIndex], async function(ctx, next) {
	try {
		let update = ctx.update;

		let cbQuery = update.callback_query;

		let cbQueryData = cbQuery.data;
		if(cbQueryData.length > 2) return next();

		let uiIndex = cbQuery.data - 0;
		if(uiIndex === NaN || uiIndex % 1 !== 0 || uiIndex < 0 || uiIndex >= g_iBoardCellsLimit) return next();
		if(uiIndex >= g_iGameBoardCells && uiIndex < g_iBoardCells) return next();

		if(uiIndex === g_iForceCalculationButtonPos || uiIndex === g_iEditButtonPos) return next();

		let message = cbQuery.message;

		let reply_markup = message.reply_markup;
		let inline_keyboard = reply_markup.inline_keyboard;

		let iColumnIndex, iLineIndex;

		let temp_ = objPositions[uiIndex];

		iColumnIndex = temp_.c;
		iLineIndex = temp_.l;

		let techLineArray = undefined;
		let colorItem = undefined;
		let bIsColorButton = false;

		if(uiIndex === g_iColorButtonPos) bIsColorButton = true;

		let temp2_ = objPositions[g_iColorButtonPos];

		techLineArray = inline_keyboard[temp2_.l];
		colorItem = techLineArray[temp2_.c];

		temp2_ = undefined;

		let state = undefined, columns = undefined;

		let entitiesObj = message.entities;
		let currentUrl = undefined;

		currentUrl = entitiesObj[g_iStateUrlIndex].url;
		state = getPayloadFromLink(currentUrl);

		currentUrl = entitiesObj[g_iColumnsUrlIndex].url;
		columns = getPayloadFromLink(currentUrl);

		let bIsStateEmpty = false;
		let bIsFirstPlayerMove = (state.length === 0 && (bIsStateEmpty = true)) || state.length % 2 === 0;

		let firstPlayerColor = colorItem.text;
		let currentPlayerColor = undefined, nextPlayerColor = undefined;

		if(bIsFirstPlayerMove) {
			currentPlayerColor = firstPlayerColor;
			if(currentPlayerColor === g_szRed) nextPlayerColor = g_szBlue;
			else nextPlayerColor = g_szRed;
		}
		else {
			if(firstPlayerColor === g_szRed) {
				currentPlayerColor = g_szBlue;
				nextPlayerColor = firstPlayerColor;
			}
			else {
				currentPlayerColor = g_szRed;
				nextPlayerColor = firstPlayerColor;
			}
		}

		let newText = undefined;

		if(uiIndex === g_iColorButtonPos) {
			if(bIsStateEmpty === true) {
				colorItem.text = nextPlayerColor;

				newText = g_szGenerateNewLinks(state, columns, nextPlayerColor);

				try {
					await ctx.editMessageText(newText, { reply_markup: reply_markup, parse_mode: 'HTML', disable_web_page_preview: true, disable_notification: true });
					return ctx.answerCbQuery();
				}
				catch(e) {
					console.log(e);
				}

				return false;
			}

			return ctx.answerCbQuery(g_szChangeColor, g_CallbackQueryOptions);
		}

		let iNextLineIndex = columns[iColumnIndex] - 0;
		if(iNextLineIndex === 0) return ctx.answerCbQuery();

		iNextLineIndex--;

		let currentArray = inline_keyboard[iNextLineIndex];
		let currentItem = currentArray[iColumnIndex];

		let tempArray = [...columns];
		tempArray[iColumnIndex] = iNextLineIndex;

		let tempStr = tempArray.join('');
		tempArray = undefined;

		state = `${state}${iColumnIndex+1}`;

		tempArray = g_c4s.calculateSync(state);

		if(tempArray === null) {
			tempStr = undefined;
			tempStr = g_szGenerateNotificationTextRegular(currentPlayerColor);
			await ctx.editMessageText(tempStr);
			return ctx.answerCbQuery(tempStr, g_CallbackQueryOptions);
		}

		if(tempArray === undefined) {
			tempStr = undefined;
			tempStr = g_szCalculationText;
			await ctx.editMessageText(tempStr);
			return ctx.answerCbQuery(tempStr, g_CallbackQueryOptions);
		}

		currentItem.text = currentPlayerColor;
		newText = g_szGenerateNewLinks(state, tempStr, nextPlayerColor);

		changeRatesLineValues(tempArray, inline_keyboard[g_iBoardRatesLineIndex]);

		try {
			await ctx.editMessageText(newText, { reply_markup: reply_markup, parse_mode: 'HTML', disable_web_page_preview: true, disable_notification: true });
			return ctx.answerCbQuery();
		}
		catch(e) {
			console.log(e);
		}
	}
	catch(e) {
		console.log(e);
	}
})

bot.use(async (ctx, next) => {
	if(ctx.update.callback_query !== undefined) {
		try {
			await ctx.answerCbQuery();
		}
		catch(e) {
			console.log(e);
		}
	}
	return true;
});

(async()=>{
	try {
		await bot.telegram.deleteWebhook({ drop_pending_updates: true });
		await bot.telegram.setWebhook(WEBHOOK_URL, { drop_pending_updates: true, allowed_updates: g_AllowedUpdateTypes });
		await app.listen({ port: LOCAL_PORT_BINDING, host: LOCAL_IP_BINDING });	
	}
	catch (e) {
		console.error(e);
	}
})();

process.once('SIGINT', () => closeConnections());
process.once('SIGTERM', () => closeConnections());
