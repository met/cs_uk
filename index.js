'use strict';

var main = (data, increase) => {
	let tr = d3.select(".main")
		.selectAll('.row')
		.data(data, (d) => { return d.index })
		.join('div')
	tr.attr('class', 'row')

	let gf = (o, form) => { if (form in o) { return o[form] }; return ['—']; }  // get form

	let single_noun_table = (obj, d) => {
		const word_data = [
			['nom. (1p)', gf(d, 'nom n')],
			['gen. (2p)', gf(d, 'gen n')],
			['dat. (3p)', gf(d, 'dat n')],
			['aku. (4p)', gf(d, 'acc n')],
			['vok. (5p)', gf(d, 'voc n')],
			['lok. (6p)', gf(d, 'loc n')],
			['ins. (7p)', gf(d, 'ins n')],
		]
		const table = obj.append('table')
		for (let i=0; i < word_data.length; i++) {
			const row = word_data[i]
			const this_row = table.append('tr')
			this_row.append('th')
				.attr('id', 'leftLabel')
				.text(row[0])
			this_row.append('td')
				.selectAll('p')
				.data(row[1])
				.join('p')
				.text((d) => { return d })	
		}
	}

	let noun_table = (obj, d) => {
		const word_data = [
			['nom. (1p)', gf(d, 'nom ns'), gf(d, 'nom np')],
			['gen. (2p)', gf(d, 'gen ns'), gf(d, 'gen np')],
			['dat. (3p)', gf(d, 'dat ns'), gf(d, 'dat np')],
			['aku. (4p)', gf(d, 'acc ns'), gf(d, 'acc np')],
			['vok. (5p)', gf(d, 'voc ns'), gf(d, 'voc np')],
			['lok. (6p)', gf(d, 'loc ns'), gf(d, 'loc np')],
			['ins. (7p)', gf(d, 'ins ns'), gf(d, 'ins np')],
		]
		const table = obj.append('table')
		const header_row = table.append('tr')  // header row
		header_row.append('th')
			.attr('id', 'leftLabel')
		header_row.append('th')
			.text('jedn.')
		header_row.append('th')
			.text('množ.')
		for (let i=0; i < word_data.length; i++) {
			const row = word_data[i]
			const this_row = table.append('tr')
			this_row.append('th')
				.attr('id', 'leftLabel')
				.text(row[0])
			this_row.selectAll('td')
				.data(row.slice(1))
				.join('td')
				.selectAll('p')
				.data((d) => { return d })
				.join('p')
				.text((d) => { return d })	
		};
	}

	let adjective_table = (obj, d) => {
		const word_data = [
			['nom. (1p)', gf(d, 'nom am'), gf(d, 'nom an'), gf(d, 'nom af'), gf(d, 'nom ap')],
			['gen. (2p)', gf(d, 'gen am'), gf(d, 'gen an'), gf(d, 'gen af'), gf(d, 'gen ap')],
			['dat. (3p)', gf(d, 'dat am'), gf(d, 'dat an'), gf(d, 'dat af'), gf(d, 'dat ap')],
			['živ. aku. (4p)', gf(d, 'gen am'), gf(d, 'nom an'), gf(d, 'acc af'), gf(d, 'gen ap')],
			['než. aku. (4p)', gf(d, 'nom am'), gf(d, 'nom an'), gf(d, 'acc af'), gf(d, 'nom ap')],
			['ins. (6p)', gf(d, 'ins am'), gf(d, 'ins an'), gf(d, 'ins af'), gf(d, 'ins ap')],
			['lok. (7p)', gf(d, 'loc am'), gf(d, 'loc an'), gf(d, 'loc af'), gf(d, 'loc ap')],
		]

		const table = obj.append('table')
		const header_row = table.append('tr')  // header row
		header_row.append('th')
			.attr('id', 'leftLabel')
		header_row.append('th')
			.text('mužský')
		header_row.append('th')
			.text('střední')
		header_row.append('th')
			.text('ženský')
		header_row.append('th')
			.text('množ.')
		for (let i=0; i < word_data.length; i++) {
			const row = word_data[i]
			const this_row = table.append('tr')
			this_row.append('th')
				.attr('id', 'leftLabel')
				.text(row[0])
			this_row.selectAll('td')
				.data(row.slice(1))
				.join('td')
				.selectAll('p')
				.data((d) => { return d })
				.join('p')
				.text((d) => { return d })	
		};

		if ('addl' in d) {
			/* Active, passive, adverbial, impersonal */

			let addls = []
			for (const addl of ['comp', 'super', 'arg', 'adv']) {
				if (addl in d['addl']) { addls.push(addl) }
			}
			
			for (const addl of addls) {
				const addl_tr = table.append('tr')
				addl_tr.append('th')
					.attr('id', 'leftLabel')
					.text({
						'comp': 'srov.',
						'super': 'super.',
						'arg': 'arg.',
						'adv': 'adv.'
					}[addl])
				addl_tr.append('td')
					.attr('colspan', 4)
					.selectAll()
					.data(gf(d['addl'], addl))
					.join('p')
					.text((d) => { return d; })
			}
		}
	}

	let verb_table = (obj, d) => {
		/* obj.append('p').text(JSON.stringify(d)) */
		let tenses = []
		for (const tense of ['past', 'pres', 'fut', 'imp']) {
			if (tense in d) { tenses.push(tense)}
		}
		const table = obj.append('table')
		const inf_tr = table.append('tr')
		inf_tr.append('th')
			.attr('id', 'leftLabel')
			.text('inf.')
		inf_tr.append('td')
			.attr('colspan', 6)
			.selectAll()
			.data(gf(d, 'inf'))
			.join('p')
			.text((d) => { return d });

		for (const tense of tenses) {
			const tense_label = {
				'past': 'min.',
				'pres': 'pří.',
				'fut': 'bud.',
				'imp': 'roz.'
			}[tense]
			const tense_categories = 
				(tense === 'past') 
				? ['m', 'n', 'f']
				: (tense === 'imp')
				? ['1', '2']
				: ['1', '2', '3']
			const tense_label_width = tense === 'imp' ? 3 : 2
			const tense_label_tr = table.append('tr')
			tense_label_tr.append('th')
				.attr('id', 'tenseMarker')
				.text(tense_label)
			tense_label_tr.selectAll()
				.data(tense_categories)
				.join('th')
				.attr('colspan', tense_label_width)
				.attr('id', 'tenseHeader')
				.text((d) => { 
					return {
						'm': 'mužský',
						'n': 'střední',
						'f': 'ženský',
						'1': '1',
						'2': '2',
						'3': '3'
					}[d]
				})
			for (const number of ['s', 'p']) {
				const number_label_tr = table.append('tr')
				const number_label = number === 's' ? 'jedn.' : 'množ.'
				number_label_tr.append('th')
					.attr('id', 'leftLabel')
					.text(number_label)
				if (tense === 'past' && number === 'p') {
					number_label_tr.append('td')
						.attr('colspan', 6)
						.selectAll()
						.data(gf(d['past'], 'p'))
						.join('p')
						.text((d) => { return d; })
				}
				else {
					number_label_tr.selectAll()
						.data(tense_categories)
						.join('td')
						.attr('colspan', tense_label_width)
						.selectAll()
						.data((tc) => {
							const form = `${tc}${number}`
							return gf(d[tense], form)
						})
						.join('p')
						.text((d) => { return d; })
				}
						
			}

			if ('pp' in d[tense]) {
				/* Active, passive, adverbial, impersonal */

				let pps = []
				for (const pp of ['act', 'pas', 'adv', 'imp']) {
					if (pp in d[tense]['pp']) { pps.push(pp) }
				}
				
				for (const pp of pps) {
					const participle_tr = table.append('tr')
					participle_tr.append('th')
						.attr('id', 'leftLabel')
						.text({
							'act': 'čin. pří.',
							'pas': 'trp. pří.',
							'adv': 'pří. pří.',
							'imp': 'neo. pří.'
						}[pp])
					participle_tr.append('td')
						.attr('colspan', 6)
						.attr('id', 'ppLabel')
						.selectAll()
						.data(gf(d[tense]['pp'], pp))
						.join('p')
						.text((d) => { return d; })
				}
			}

		}
	}
	const div = tr.selectAll('div')
		.data((d) => { 
			return [
			d, d.forms
		]; })
		.enter()
			.append('div')
	div.attr('class', 'col')
	div.exit()
		.remove()
	div.each(function(d, i) {
			let this_obj = d3.select(this)
				.attr('id', 'def')
			if (i === 0) {
				const newPos = {
					'adjective': 'přídavné jméno',
					'adverb': 'příslovce',
					'noun': 'podstatné jméno',
					'numeral': 'číslovka',
					'particle': 'částice',
					'phrase': 'fráze',
					'pronoun': 'zájmeno',
					'proverb': 'příslovce',
					'symbol': 'symbol',
					'verb': 'sloveso'
				}[d.pos]
				this_obj.append('p')
					.attr('class', 'title')
					.append('b')
					.text(d.word)
				this_obj.append('p')
					.attr('class', 'title')
					.text(d.info ? ` (${newPos} - ${d.info})` : ` (${newPos})`)
				this_obj.append('div')
					.append('ul')
					.selectAll()
					.data(d.defs)
					.join('li')
					.text((d) => { return d;});
			} else if (i === 1) {
				this_obj.attr('id', 'forms')
				if ('nom n' in d || 'acc n' in d) {
					single_noun_table(this_obj, d)
				}
				else if ('nom ns' in d || 'nom np' in d) {
					noun_table(this_obj, d)
				}
				else if ('nom am' in d || 'nom af' in d || 'nom an' in d || 'nom ap' in d) {
					adjective_table(this_obj, d)
				}
				else if ('inf' in d) {
					verb_table(this_obj, d)
				}
				else if (Object.keys(d).length > 0) { 
					this_obj.text(JSON.stringify(d)) 
				}
				else {
					this_obj.append('p')
						.attr('id', 'indcl')
						.append('i')
						.text('nesklonné')
						
				}
			}
		});

	const highlightFunc = (t) => {

		const find = (word, phrase, literal, mustPreceed) => {
			const letters = 'abcdefghijklmnopqrstuvwxyzабвгдежзийклмнопрстуфхцчшщъыьэюяєії'
			let index = 0;
			let parenthesis = 0;
			let result = ''
			let buffer = ''
			for (let i = 0; i < phrase.length; i++) {
				const thisLetter = phrase[i];

				if (thisLetter === ')') { parenthesis++; };
				if (thisLetter === '(') { parenthesis--; };

				const isBeginning = i === 0;
				const isEnd = i === phrase.length - 1;
				const beforeClear = isBeginning || !letters.includes(phrase[i - 1].toLowerCase());
				const afterClear = isEnd || !letters.includes(phrase[i + 1].toLowerCase());

				const isWordMatch = thisLetter.toLowerCase() === word[index];
				const isAccent = thisLetter === "́";
			
				if (index === 0) {
					if (((!literal && !mustPreceed) || beforeClear) && isWordMatch && parenthesis === 0) {
						buffer += thisLetter;
						index ++;

						if (index === word.length) {
							if (!literal || afterClear) result += `<span class=highlight>${buffer}</span>`;
							else result += buffer;
							buffer = '';
							index = 0;
						}
					}
					else result += thisLetter;
				}
				else if (isWordMatch || isAccent) {
					buffer += thisLetter;
					if (!isAccent || (isAccent && isWordMatch)) index ++;
					if (index === word.length && (isEnd || phrase[i + 1] !== "́")) {
						if (!literal || afterClear) result += `<span class=highlight>${buffer}</span>`;
						else result += buffer;
						buffer = '';
						index = 0;
					}
				} else {
					result += buffer;
					buffer = '';
					index = 0;
					result += thisLetter;
				}
			}
			result += buffer;
			return result
		}
		if (literalPhrases || fuzzyWords) {
			let ret_val = t
			const mustPreceed = !(fuzzyWords.length === 1 && fuzzyWords[0].replace(/[^a-z]/g, '').length === 0);
			for (const phrase of literalPhrases) {
				ret_val = find(phrase, ret_val, true, null)
			}
			for (const word of fuzzyWords) {
				ret_val = find(word, ret_val, false, mustPreceed)
			}
			return ret_val; 
		}
		return t;
	}
	d3.selectAll('li')
		.html(function() { return highlightFunc(this.__data__) })
	d3.selectAll('td')
		.selectAll('p')
		.html(function() { return highlightFunc(this.__data__) })
	d3.selectAll('p.title > b')
		.html(function() { return highlightFunc(this.__data__.word) })

	if (!increase) { window.scrollTo({top:0}); }
}

let numDisplayed = 300
let data;
let freq_data;
let alpha_data;
let curFilter;
let sortInfo = 'freq';
let index = new Object();
let wordDict = new Object();
let searchTerm;
let literalPhrases;
let fuzzyWords;

document.addEventListener('copy', (event) => {
	if (!document.querySelector('#stressCopy').checked) {
		const selection = document.getSelection()
		event.clipboardData.setData('text/plain', selection.toString().replaceAll('\u0301', ''))
		event.preventDefault()
	}
})

Promise.all([
	fetch('index.json')
		.then(res => res.json() )
		.then(out => { 
			console.log('starting index.json')
			for (const o of Object.keys(out)) index[o] = {'word': out[o][0], 'indexes': new Set(out[o][1])};
			console.log('done with index.json') 
		})
		.catch(err => {throw err; }),

	fetch('word_dict.json')
		.then(res => res.json() )
		.then(out => { 
			console.log('starting word_dict.json')
			for (const o of Object.keys(out)) wordDict[o] = new Set(out[o]); 
			console.log('done with word_dict.json')
		})
		.catch(err => {throw err; }),

	fetch('words.json')
		.then(res => res.json())
		.then(out => {
			data = out;
			freq_data = data;
			main(data.slice(0, numDisplayed))
			alpha_data = d3.sort(
				[...data], 
				x => x.word.toLowerCase()
					.replaceAll('\u0301', '')
					.split('')
					.map((y) => {
						const letters = Object({
							'а': '0',
							'б': '1',
							'в': '2',
							'г': '3',
							'ґ': '4',
							'д': '5',
							'е': '6',
							'є': '7',
							'ж': '8',
							'з': '9',
							'и': ':',
							'і': ';',
							'ї': '<',
							'й': '?',
							'к': '@',
							'л': 'A',
							'м': 'B',
							'н': 'C',
							'о': 'D',
							'п': 'E',
							'р': 'F',
							'с': 'G',
							'т': 'H',
							'у': 'I',
							'ф': 'K',
							'х': 'L',
							'ц': 'M',
							'ч': 'N',
							'ш': 'O',
							'щ': 'P',
							'ь': 'Q',
							'ю': 'R',
							'я': 'S',
							"'": 'T'
						})
						if (y in letters) return letters[y]
						return ''
					})
					.join()
			)
		})
		.catch(err => {throw err})
]).then( () => { 
	readURL();
}).catch(err => {throw err})

window.onscroll = (_) => {
	if (window.innerHeight + window.scrollY + 1000 >= document.body.offsetHeight) {
		numDisplayed += 100
		main(data.slice(0, numDisplayed), true);
	}
}

document.querySelector('input#search').addEventListener("keydown", event => {
	if (event.code === "Enter") { search(); };
})

window.addEventListener("keydown", event => {
    if (event.code === 'F3' || (event.ctrlKey && event.code === 'KeyF')) { 
        event.preventDefault();
		document.querySelector('input#search').focus();
    }
	if (event.code === 'Escape') {
		clear();
	}
})

function selectHelper() {
	if (sortInfo === 'freq') { data = freq_data }; 
	if (sortInfo === 'alpha') { data = alpha_data }; 
	if (sortInfo === 'alpha_rev') { data = d3.reverse(alpha_data) };
	numDisplayed = 300;
}

function filterHelper() {
	if (curFilter) {
		data = d3.filter(data, x => x.pos === curFilter);
		numDisplayed = 100;
	}
}

function searchHelper() {
	literalPhrases = null
	fuzzyWords = null
	if (index && wordDict && searchTerm) {
		searchTerm = searchTerm.trim().replaceAll(/\s+/g, ' ').toLowerCase()
		const literalResults = searchTerm.matchAll(/"([^"]*)"/g)
		literalPhrases = Array()
		let literalWords = Array()
		for (let literalRes of literalResults) {
			literalPhrases.push(literalRes[1])
			literalWords = literalWords.concat(literalRes[1].split(' '));
		}
		const fuzzyResults = searchTerm.replaceAll(/"([^"]*)"/g, '').trim().replaceAll(/\s+/g, ' ')
		fuzzyWords = Array()
		for (let fuzzyRes of fuzzyResults.split(' ')) {
			fuzzyWords.push(fuzzyRes);
		}
		let indexes;
		const canInclude = fuzzyWords.length === 1 && fuzzyWords[0].replace(/[^a-z]/g, '').length === 0;
		for (const word of fuzzyWords) {
			if (!word) break;
			// generate words containing all searched letters
			let wordIndexes;
			for (const l of new Set(word)) {
				if (!wordIndexes) wordIndexes = wordDict[l];
				else {
					let _wordIndexes = new Set();
					for (const elem of wordDict[l]) { wordIndexes.has(elem) ? _wordIndexes.add(elem) : null }
					wordIndexes = _wordIndexes;
				}
			}
			if (!indexes) {
				let results = d3.filter(Array.from(wordIndexes), x => {
					const thisWord = index[x]['word']
					return canInclude ? thisWord.includes(word) : (thisWord.startsWith(word) || thisWord === word)
				});
				indexes = new Set()
				for (const res of results) { for (const elem of index[res]['indexes']) indexes.add(elem); }
			} else {
				let results = d3.filter(Array.from(wordIndexes), x => {
					const thisWord = index[x]['word']
					return canInclude ? thisWord.includes(word) : (thisWord.startsWith(word) || thisWord === word)
				});
				let _indexes = new Set()
				for (const res of results) { 
					for (const elem of index[res]['indexes']) indexes.has(elem) ? _indexes.add(elem) : null; 
				}
				indexes = _indexes;
			}
		}
		console.log(literalWords)
		for (const word of literalWords) {
			if (!word) break;
			// generate words containing all searched letters
			let wordIndexes;
			for (const l of new Set(word)) {
				if (!wordIndexes) wordIndexes = wordDict[l];
				else {
					let _wordIndexes = new Set();
					for (const elem of wordDict[l]) { wordIndexes.has(elem) ? _wordIndexes.add(elem) : null }
					wordIndexes = _wordIndexes;
				}
			}
			if (!indexes) {
				let results = d3.filter(Array.from(wordIndexes), x => {
					const thisWord = index[x]['word']
					return thisWord === word
				});
				indexes = new Set()
				for (const res of results) { for (const elem of index[res]['indexes']) indexes.add(elem); }
			} else {
				let results = d3.filter(Array.from(wordIndexes), x => {
					const thisWord = index[x]['word']
					return thisWord === word
				});
				let _indexes = new Set()
				for (const res of results) { 
					for (const elem of index[res]['indexes']) indexes.has(elem) ? _indexes.add(elem) : null; 
				}
				indexes = _indexes;
			}
		}
		// ensure actual phrase is included
		for (const literalRes of literalPhrases) {
			let allData = d3.filter(data, x => indexes.has(x.index))

			const filterFunc = (y) => {
				let noParen = ''
				let paren = 0
				for (const l of y) {
					if (l === '(') paren++;
					else if (l === ')') paren--;
					else if (paren === 0) noParen += l;
				}
				return noParen.toLowerCase().includes(literalRes)
			} 

			const unpack = (y) => {
				let result = []
				if (typeof y === 'object' && y !== null) {
					for (const x of Object.values(y)) result = result.concat(unpack(x));
				}
				else {
					result = y;
				}
				return result;
			}

			let goodData = d3.filter(
				allData,
				x => (
					d3.filter(x.defs, filterFunc) + d3.filter(unpack(x.forms), y => { return y.replaceAll('\u0301', '') === literalRes; } )
				).length > 0 || x.word.replaceAll('\u0301', '') === literalRes
			).map(x => x.index)
			
			const _indexes = d3.filter(Array.from(indexes), x => goodData.includes(x))
			indexes = new Set();
			for (const elem of _indexes) { indexes.add(elem); }
		}
		if (indexes) {
			numDisplayed = 300;
			data = d3.filter(data, x => indexes.has(x.index))
		}
	}
}
function select() {
	sortInfo = document.querySelector('select#sort').value;
	selectHelper();
	filterHelper();
	search();
	main(data.slice(0, numDisplayed));
}

function filter() {
	curFilter = document.querySelector('select#filter').value;
	selectHelper();
	filterHelper();
	search();
	main(data.slice(0, numDisplayed));
}

function search() {
	setURL()
	const letters = "aábcčdďeéěfghiíjklmnňoópqrřsštťuúůvwxyýzžабвгдежзийклмнопрстуфхцчшщъыьэюяєіїґ '\""
	const oldSearch = searchTerm;
	searchTerm = document.querySelector('input#search').value.toLowerCase();
	searchTerm = searchTerm.replace('“', '"').replace('”', '"').replace('«', '"').replace('»', '"')
	let newSearchTerm = ''
	for (const s of searchTerm) { if (letters.includes(s)) newSearchTerm += s; }
	searchTerm = newSearchTerm;
	if (oldSearch) {
		selectHelper();
		filterHelper();
	}
	searchHelper();
	main(data.slice(0, numDisplayed))
}

function setURL() {
	let urlSearchTerm = document.querySelector('input#search').value;
	let urlFilterTerm = document.querySelector('select#filter').value;
	let urlSortTerm = document.querySelector('select#sort').value;
	let url = window.location.href;
	url = url.split(/[#\?\&]/).reverse();
	let base = url.pop();
	let addedParam = false
	base += '#search'
	if (urlSearchTerm) {
		base += '?q=' + urlSearchTerm;
	}
	if (urlFilterTerm) {
		const startChar = addedParam ? '&' : '?';
		base += startChar + 'f=' + urlFilterTerm;
		addedParam = true
	}
	if (urlSortTerm) {
		const startChar = addedParam ? '&' : '?';
		base += startChar + 's=' + urlSortTerm;
	}
	window.history.replaceState("", "", base)
}

function readURL() {
	let urlRaw = window.location.href;
	let url = urlRaw.split(/[#\?\&]/).reverse();
	const base = url.pop();  // unused
	const search = url.pop(); // unused
	let params = [];
	while (url.length > 0) {
		params.push(url.pop().split(/=/));
	}
	for (const [var_, val_] of params) {
		if (var_ === 's') document.querySelector('select#sort').value = val_;
		if (var_ === 'f') document.querySelector('select#filter').value = val_;
		if (var_ === 'q') document.querySelector('input#search').value = decodeURI(val_);
	}
	select();
	filter();
}

function clear() {
	document.querySelector('input#search').value = ""
	search();
}

d3.select('#clear').on('click', clear)