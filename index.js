const fs = require('fs');
const xlsxParser = require('xlsx');
const cheerio = require('cheerio');
const colors = require('colors');
const emoji = require('node-emoji');

const file = './_Rising-Mets-1.html';

let excelLinksArr = [];
let htmlLinksArr = [];
let matchRemaining = [];

let matchingTags = 0;
const xlsxStrings = xlsxParser.readFileSync('test-3.xlsx').Strings;

const collectRowInfo = arr => {
	const findHref = new RegExp(/.*?:\/\//, 'g');
	const findEmails = new RegExp(/(?![\w]*\:)[\w]*\@[\s\S]+/, 'g');
	return (arr = xlsxStrings
		.map((res, index, arr) => {
			let hrefRow = res.t.replace(' ', '');
			if (hrefRow.match(findHref) || hrefRow.match(findEmails)) {
				excelLinksArr.push(hrefRow.replace(/\amp\;/, ''));
			}
		})
		.filter(val => val));
};

collectRowInfo();

const collectHtmlHref = () => {
	let html = fs.readFileSync(file, 'utf8');
	const $ = cheerio.load(html);
	let countLinks = 0;
	hrefVal = $('a').each((i, link) => {
		countLinks += 1;
		let links = $(link).attr('href');
		htmlLinksArr.push(links.replace(/mailto\:/, ''));
	});
	console.log(
		colors.yellow(`There are currently: ${countLinks} anchor tags \n`)
	);
};

collectHtmlHref();

const compareTwoParsed = () => {
	for (let i = 0; i < htmlLinksArr.length; i++) {
		if (excelLinksArr.indexOf(htmlLinksArr[i]) == -1) {
			matchRemaining.push(htmlLinksArr[i]);
		} else {
			matchingTags += 1;
			console.log(
				`Matching Links Are: ${colors.green(htmlLinksArr[i])}`,
				emoji.emojify(':beers:')
			);
		}
	}
};

compareTwoParsed();

const displayLinksToCheck = () => {
	console.log('');
	for (var i = 0; i < matchRemaining.length; i++) {
		console.log(
			`${emoji.emojify(
				':see_no_evil: '
			)} Links To Double Check: ${colors.yellow(matchRemaining[i])}`
		);
	}
};

displayLinksToCheck();
console.log(colors.yellow(`\n ${matchingTags} of them are matching`));
