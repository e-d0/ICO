let faker = require('faker');
var fs = require('fs');
var moment = require('moment')

let data = {};

/**
* Types preset
*/
data.types = [
    {
      "id": 0,
      "name": "White List",
      "code": "whitelist"
    },
    {
      "id": 1,
      "name": "KYC",
      "code": "kyc"
    },
    {
      "id": 2,
      "name": "Pre ICO",
      "code": "pre"
    },
    {
      "id": 3,
      "name": "Начало ICO",
      "code": "start"
    },
    {
      "id": 4,
      "name": "Завершение ICO",
      "code": "end"
    },
    {
      "id": 5,
      "name": "ICO",
      "code": "ico"
    }
  ]
/**
* Events preset
*/
/**
* generate events
*/
let eventsCount = 50
let daysBefore = 20
let daysAfter = 20
function generateEvents(eventsCount) { return Array(eventsCount).fill(null).map(
	(el, i) => {

		let type = faker.random.arrayElement(data.types)
		let nextDate = moment().add('days', daysAfter).format('YYYY-MM-DD')
    let prevDate = moment().subtract(daysBefore, "days").format('YYYY-MM-DD')

		let event = {
				      "id": i,
				      "name": faker.company.companyName(),
				      "created_at": faker.date.recent(30),
				      "updated_at":  faker.date.recent(30),
				      "date": faker.date.between(prevDate, nextDate),
				      "type": faker.random.arrayElement(['start', 'end']),
				      "category": type.code,
				      "user_ico": faker.random.boolean(),
				      "notifications": [
				      ],
				      "note": {
				        "user_id": null,
				        "event_id": null,
				        "text": ""
				      }
	    		}
		return event
	})

}

data.events = generateEvents(eventsCount)

/**
* generate ICO
*/

const icoCount = 10

function generateICO(icoCount) { return Array(icoCount).fill(null).map(
	(el, i) => {

		let nowDate = new Date()
		let prevMonth = moment(nowDate.setMonth(nowDate.getMonth() - 1) ).format('YYYY-MM-DD')
		let nextMonth = moment(nowDate.setMonth(nowDate.getMonth() + 1) ).format('YYYY-MM-DD')

		let item = {
				"id": i,
				"title": faker.commerce.product() + 'coin',
				"ticker": faker.finance.currencyCode(),
				"rating": faker.finance.amount(0,10,2),//returns "1.95"
				"hard_cap": faker.random.number({min:100000, max:999900}),
				"current_cap": faker.random.number({min:100000, max:999900})/faker.finance.amount(1,5,1),
				"market_cap": faker.random.number({min:100000, max:999900}),
				"ico_price": faker.random.number({min:1000, max:100000}),
				"market_price": faker.random.number({min:1000, max:100000}),
				"starts": faker.date.between(prevMonth , nowDate ),
				"ends": faker.date.between(prevMonth , nextMonth ),
				"status": faker.random.arrayElement(['canceled', 'trading', 'upcoming', 'active', 'completed']),
				"forum_posts_count": faker.random.number({min:0, max:100}),
				"reviews_count": faker.random.number({min:10, max:100}),
				"user_review": faker.random.boolean(),
				"at_calendar": faker.random.boolean(),
				"usd_roi": faker.finance.amount(0,10,2),
				"btc_roi": faker.finance.amount(0,10,2),
				"eth_roi": faker.finance.amount(0,10,2),
				"24h_roi": faker.finance.amount(0,10,2)+'%',
				"bg": faker.commerce.color(),
				"icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAD0klEQVRIS5WWW0wdVRSGv7VnDlAO1FKKWmgQjJhGiOVNE0GS1lgNjRdaS73WpCRGo1wKMaYPvvTBxBsFNVYTqqnaiNVQUm+xsVbbEI0aNaU1JgoBbCmlQoTD7ZyZvc0MQoEz56DrabLXP/+/9vrXrIyQJIabWRtWbFPCRgMlSsgBjDYMi9CtXY5Honx45dNcSEQjQQmPOF2x11Y8DKQkKwKIas1BrXk23MDgUmycwGQL9ypFm0DWMsSL0hpGYg67VjZwZGFikcBEK4/bwquA+j/kC7DaMTwRruWNubN5gfFmqlJsDicjt26s9xzAPfsmqBSIjQXVoWccts7dxBe49DJ5GSG6BVbF9fCKIsx4P+gZQjt+QZ8/iRk4hn3HB0QP5MLMX3EiBkbHHYpzGhj0BaZaeUsJjwaVE9rZh6StQV/4DrWuAvfH55G0bCS3jNihGxJ20tG0heuoEa/6zBC9QCgeLajcCqyb9/qEC8O7ldv1DPr3dr9tAREdcyiQyVbqLaE5malWWQtWaS1mrBe3aw/q2rtRRfeBWOieTpzPqgJFXE29TLZw1FJsSSYQqv4ZydmAPtOG81WND7U27MYqf8l/jn1UgRn8Jo7CNRyVqVZ6lVCQUCA1m5SaIb9a98RTuN3eFINV2oRV9sKswOFbMENdQWb3yMwrRIBwIgFVeA92Zce/aYOJnINoBMm6HkSh/zyB03kbGDeIIuIJTADpiQSssmas0nrM3724Xz+J5G/GWv8QpK2GqUvEOjZiRk4nej0i0630iZCfCBGq/gnJKUWfPYBzfJcPkxVXYVf/gGSsw4z8SuxQsbcD4yi0odfz4FMl3Lk0a936OpKRhyqs9FvhHNuJ/u3gPCxUdXJ2dN0o0f1hME68B5qPvSlqshSzbs2FlUbori+Qq28Ca3aZmvEBzPlTmPE+ZFUR6rqts+fnThHrKA9sgOuyW0ZayA8r/gDsOFQoE3vT20heOUwMIWtKFkOiY8Q6N2OGvg0ScCKTFM6tineV8GAQyvNAD3Zh+j/H3tKJ88k2SMkAd9qfIKYvBlavDe+sqOURX8C7RbritMDKxWiFXfEauucIkn87qqCS2HvrE83D/LmBsYkoJdmNDFxe1y3sSFEc8oYkiEHS14I3NRe/X07ARF3uz6yn3Z+4hejIPhpDlm94oMhyzJ7nrktjev3l3RZHFNnHA7ZivwiZ/4FwUVtimscy63h/4XuBlY6+yDWpNs9ZFtu9tbOMkONq2qdhz+o6+pdik7ZitJmCVJvtYtgkQrHg/7Z43+ywMZwxhi9nYrRnNdGXqIh/AClEYn33iJn+AAAAAElFTkSuQmCC",
				"summary": "opisanie",
				"platform": [
				"ETH",
				"WAVES"
				],
				"category": [
				"finance",
				"software"
				],
				"forum_link": "/forum/tatat",
				"review_link": "/review/tatasf",
				"user_review_link": "/review/#32",
				"ico_details_link": "/details/ahaha",
				"logo": "data:image/png;base64,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",
				"gradient": "radial-gradient(farthest-side at 75% -75%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)"
		    }
		return item
	})

}

data.ico = generateICO(icoCount)


/**
*
*/
data.currencies = [
    {
      "id": 1,
      "title": "DOLLAR",
      "icon": "&#36;",
      "ticker": "USD"
    },
    {
      "id": 2,
      "title": "Bitcoin",
      "icon": "BTC",
      "ticker": "BTC"
    },
    {
      "id": 3,
      "title": "Etherium",
      "icon": "ETH",
      "ticker": "ETH"
    },
    {
      "id": 4,
      "title": "WAVES",
      "icon": "WAVES",
      "ticker": "WAVES"
    }
  ]
/**
* generate data for each currency
*/
data.currencies.forEach(function(currency) {
		currency["price"] = faker.finance.amount(10,1000,1)
		currency["24_change"] = faker.finance.amount(0,5,2)
		currency["market_cap"] = faker.finance.amount(100,100000,2)
		currency["24H_volume"] = faker.finance.amount(100000,99999000,0)
})

/**
* generate coins
*/

data.coins = [
    {
      "id": 0,
      "title": "Monero",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFMElEQVRIS52Wb0yVVRzHv7/nPPdeIbjwAKKJ/5Js84au7WI6rhqSUg1uFgauV4pK1qhZrpXrRdPeuOqFsZkb0zntVUpWA0USl6YX0OGtzV1oZUoJYhBy8fLPy/Occ9p54BKKf2Zne7a7c5/z/fz+Pb/fIdx7kdcL/dhCZEx3YhUEVkMgG0DG2OvXoeEigJNw4VT2eXQGg7AAyLvl6O6NpwFnaCXmIxPvQkMRGFIgAPvhY28zAOpRpzl6wXEUV1GRdRqXW4CRiZoTAbTKgLt+LfzQsBMM82COCd/HTXtbA+CwQVf4bexYUoOaYBiRmDfjgCUpcJ9fgw1wYheAeFv8UZaCAEMwsX3p9zh0odeG2E7CDksZikHYByDOjub/WfoYZARl2QdRFQRMBaC/XodndgKOQ0OG5OghwICEa3LKHkDVEJUSYdKRBoEOaCigSvyqqsVx8RnshQubpYkeLrCXAUuJYSU4HA+FKBMZTGnhRy5xgTGUkxOpuI192QdQTrIcczCCSwDckuHGPxGUtvShL3cGPiUNOQ+ExMQlGk7fwIcLE5GSloQDxPE4gAj6sJDkRmyCC/tVcUkHuoLXsWVDDU588SJynp+FjwnwQcA5yZNR8REpETjVgU/eO4Gmg3685M1AJZmYBidUwW4iWYoquPCaqhob0Ik3Flej+knA9WU+fKtn4yMiLL8D8p/42foO7Co/gYY/gGizH2vGAQ5AjOCIArRBx1z1IU0EqHQqyJ4XsDx/Fj4gDc+B23bFLD/zQzs+e6cOASWutu8AqO/DRJsKkfrTqQp2AuDYokWL4trb2/WkpHC04iks98/B+6QhVwlJgTO11/D5278hcOuW4YqLizM7OzuHm/14edyD0aYRvR/geGFhYdbAwMCyUCj0bVZCT3jbfKwofALl6sutuYo9u3/HudBAWorH43k1Pj7+XF1dXUuzH4WTAaX4Ezrm3BWiYyUlJXmDg4MVQ0NDh1taWioznd2RxQY8yqxL/WhpHUpP8ng8byYkJBRHo9Gt9fX1p5v98I8DxkNUiqNIQJGdZB3dv1zDW95qfFdSUpI7PDxcxRgb6uvrq2xtbd3f3d3dpQDp6enTPB5PWXJy8hYhxJTe3t7iQCDwU/MrKPLOwl4ykW73p0F8Q1Yp1oh4lGgqEw5Efu7AgWdrcLGoqCjXNM2vGWNThRDt/f39NkRKSR6PZ7Pb7d6iadpMznl3T0/PuqamprMNfmQvnomNmgm3cAFiAIepeCoSom5MV6mWDDx6G90nuzC4YMGCFZmZmVWapqWPdcb2SCRyRLWWxMTEYiKapX5LKbtCoVBxW1vbufxpeMw1BenEweACXBH8bTc7r9frYIy5icjUdV1alkW6ri8zDOOQpmlpQggQkdQ0rVcIoc4YyhNN0yClVB6sF0I0xs5KKR2c80gwGLSbHQoKCgwhxG5d1+cKISx1mIiSAWQR0WjtK3NptLtLecfgGuGch4iob8wInXPeFolEtgUCgXBsHjj9fv86TdP2EZF6wdaTUqpaeOgiIjXvJGNMwU0pZVl1dbUK58j4wDEMI8nn861njO0ionjLerShoOu6Eh+yLGt7Y2PjV+Fw+Nb4wIlFwDAMd05Ojp8xtpMxNk95ouL/oKXyoCwXQlyxLGtHY2NjTTgcnjwyJ4g4fT7f/NTU1K1EtJYxlqJiPhEWE1U54Zz3SimP3rx5s6KhoeGy3UMnrEm3ipg3APS8vLwZbrd7Fec8X0qZLaW0ry1EdJ2I7GsL5/xUbW1tJ3Dva8u/EVdnAa3C9pIAAAAASUVORK5CYII=",
      "ticker": "XMR",
    },
    {
      "id": 1,
      "title": "Etherium",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAD50lEQVRIS6WVx0psXRCFq80ZnYhhYJgoCA5EQUTRgTgygiA4caSIoKLoG/gM4jPowBdQMWPEBCYwB4yYU9vh8tVPNYf/3tsO7obD6dN771q71lpV2+X3+/3yl+Hz+cSmeYeEhMj397eEhoZKWFiYzrHG6/Xqtw3Wvb+/S0xMjLiCAbDBCbK3t6cxMjMzFSQiIkJcLpeu4c0DGIN5RlAAOyEbOdHw8LDs7u5Kc3Oz5Ofna0AGQXnCw8P1+/PzU6KiojTjHzNgI7Ts7OzI6OiozM3NSV1dnbS0tEhsbKwG4bGT89to/RHA+L27u5PZ2VlZW1uT1dVViYyMlJ6eHiktLdVg0MHjdrs1A8tEaQumAZs/Pj40MM/V1ZUsLS3J+fm5ZtHe3i5paWni8XgUlICAoI0JHxSARYeHhzI+Pi4PDw8KtrKyImdnZ5KUlKQAtbW1Ghw6yAI6zWF/pMj44zSPj49KzebmpkRHR8vLy4tSdHJyIl9fX1JcXCz9/f2Sm5urgaHGKbC6yOfzKUtmN/409yDs1NSUBgPg+vpalpeX9c161rW1tUlTU5PEx8frycnahA8AgG68mc2en5+VmsvLSw2ETQ8ODmR9fV2/AWRfenq69PX1SUlJiVrTKDILqwagWqHgHPje398PcA/I09OT3N7eys3NjQoJ71ZoDQ0N0tnZKSkpKSo4/zNUAyiyCmQSoY6OjmRoaEhOT0+FTNCCUzMPwNvbW0BIgBISEmRgYECqqqoUGC2stbjcbrefP8zDZADA4OCgWhLnQIcVE1aFLgZ7oAWRe3t7FcCCW224PB6Pn6AMRGIThUXfoS1Qudvb27qRTI0u1ufk5GixZWdnS3l5uWRlZUlcXJwKzVpAlCIDMGHgG0FxC3NbW1syMzOjmd3f36tjCFhUVKTfiYmJUl1dLampqf8FteBUMgBmLU4Fz9BxcXEhCwsLSkdGRoYKPDk5Ka+vr1JQUKDZbmxsqCFaW1uloqJCsySWdVIFw0XQYv3DLAv3UAQIWdAScAeCkxGtg9N3dHRIfX29Nj4CcjjnvaAAdomYkGZZHETlIjZiMqgDNIHGmpoa6erqkuTk5MAl9FuhOevAWi2AgPCNDtPT09oeoGtxcVH7U2FhoXR3d0teXp5ak8D/v4C0DnARqTlvJbvFAAHs+PhY5ufnlTLe8E9hVVZW6rVoTc5JUaCSvV6vHyTn3Wp9xvqS6TE2NiYTExNSVlamwkIN+3jskNa6tQ857wMqz9kyLLi9cc/IyIjS09jYqFem86JnnmxMR+Jp7ZABJ3Autu5qXRUQ1mBV/qPnWPe1m4z9Rqlp8eOlH/DbP/z4BTcZC+bon+3sAAAAAElFTkSuQmCC",
      "ticker": "ETH"
    },
    {
      "id": 2,
      "title": "DigitalCash",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAANUlEQVRIS+3SsQkAAAwCQd1/aUf4yu5TS4TD5nw9/48FKCyRRCiAAVckEQpgwBVJhAIYuK9oesQAGQOvmYAAAAAASUVORK5CYII=",
      "ticker": "DASH"
    },
    {
      "id": 3,
      "title": "EOS",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAD3ElEQVRIS51WXSikexj/zcxrhjnY2R0ZY9iDC5HUzkqRxI0b7bkQkgsXEmWVC1cUygVFERsXbtSefNxpp9hNSZ1NXOGMFNHZsD7nA4NmMO877/Y8k10fszPTeWuad5qZ5/f1PM//VdjtDhlhXLL8+GcKhSKMfwGKcACouCCocF+UsERR/Pk5GFJIACoeEREBp9OB0dFR2O12NDY2Ij09HV5vaJCQAEqlgtlOTU3hy+cvECURubm5aGhowMuXr+D1eoMqCQtgeXkZH4Y+wOF0QBAEKJVK1NfX4927v6BSqfA0n4eWBQVQqZTY39/HyMgIFhYWcHd3B0mSoNFokJWVhebmZrx9m/P/AMgat9uNyclJTExM4OTk5Cf76+trxMfHo6SkBE1NTUhISIAk+QJmHUSBjMXFRQwMDGB3d5fDTU1NZfbb29uIiYmBwWBAXV0dKisroVZrAip5BkB+kq8u1wUGBwcxPz+Pvb09aLVa6PV69v/i4gJOp5MBMzIy0NnZidev/wwPgHRSkW/f/kN3dzcODw+xubmJuLg4eDwezoGACCAtLQ3R0dFoaWlBQUEBAMUzkGcK/MMkY2lpCT09Pbi9veXC9Do+PuaWNRqNbFFUVBS3aW1tLWpqaqBSCfD5HmfxDIDYS5K/74eHh9kuYr+xscHW0BUZGQmz2YyrqytQ4KWlpWhra4NW+0c4AP7u6evrg8VigTZKC32cHisrK7i5uWEAIpGTk8PqXC4XsrOz0dvbC4MhITyLbLZTtLa2svekgGw7PT3F2dkZA5DvZBOtELJMp9OxneY3ZtCekvFrMT6xSAGKwGr9Fx0dHczw6OiIWVGxg4MDvqe+p4kmRUlJSZB9Mt43vUdFRYUf4MHmfQRATAlgenoaY2NjHOD6+jozjo2N5ZCpi5KTkxnc4XBwJ1FGhYWF3E2CEBEcwOu9w9DQEFZXV7G1tcXWEAAVoVCJNU0xeX9+fs6Dl5eXx993dXVB90L3wKAA54HH40Z7ezsXvry85HfKgYqSdPKcgqfJdnvcrIwGjrqpv78fJlPS7xX4l4mMr1//wcePf/Oio44iK2iSqe+pg8geCpwGjuaB2JeVlaG8vJwtenjaBVwVlMPB9+/4ZLFgbm6OraCiarWa1RAo3ZN1+fn5qKqqQmZmJhemfIMC3K9E2qa0mtfW1jA+Pg6r1YqUlBQesp2dHZhMJlRXV6OoqIiV+XyBj/ag5wEpIcaUxezsLGZmZnhlFBcXc0smJiZCFCW2lfZQoCvkiUbBku8ajRo2m43b1GhMhM8ncfFQTxchAe5Z+Z8sBC4oit7fMn6q4gdNNTRPeYHBVQAAAABJRU5ErkJggg==",
      "ticker": "EOS"
    },
    {
      "id": 4,
      "title": "NEO",
      "icon": "data:image/png;base64,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",
      "ticker": "NEO",
    }
  ]


/**
* generate data for each coin
*/
data.coins.forEach(function(coin) {

		let nowDate = new Date()
		let prevMonth = moment(nowDate.setMonth(nowDate.getMonth() - 1) ).format('YYYY-MM-DD')

		coin.color = faker.commerce.color()
		coin["market_price"] = faker.finance.amount(100,10000,2)
		coin["24_change"] = faker.finance.amount(0,5,2)
		coin["market_cap"] = faker.finance.amount(100,990000,2)
		coin["24H_volume"] = faker.finance.amount(100000,999990000,0)
		coin["status"] = faker.random.arrayElement(["trading","ico"])
		coin["ico_price"] = faker.finance.amount(20,1000,2)
		coin["roi_week"] = faker.finance.amount(20,1000,2)
		coin["roi_month"] = faker.finance.amount(20,1000,2)
		coin["date"] = faker.date.between(prevMonth , nowDate )
		coin["price"] = faker.finance.amount(20,10000,2)
})


/*
* Generate empty Portfolio
*/

data.portfolios = []

let portfolio = {
      "id": 1,
      "title": "Portfolio #1",
      "is_private": false,
      "profit": "0",
      "coin": []
    }

data.portfolios.push(portfolio)


/**
* Generate markets
*/
data.markets =  [
    {
      "id": 1,
      "title": "Kraken",
      "icon": "data:image/png;base64,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",
      "market_url": "/market/asdfs"
    },
    {
      "id": 2,
      "title": "POLONIEX",
      "icon": "data:image/png;base64,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",
      "market_url": "/market/asdfs",
    },
    {
      "id": 3,
      "title": "BITTREX",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAASCAYAAADBnymNAAALaUlEQVRYR+2YeVjU1RrHvzPDAAOzMA7DMizDwBAQIKiYcmWxwhIpr8ZN06uQpabWvZZm6U1DKulmtNxHlDJbtEWtFJfY1OvVoLQEBRSRRDZZRYRhYIBZ73POj5kBZ7Cn/zvP4/OMZ97zvu/5vMt5B5bJZDIBQGX3MN6t6AGLRf43dpEtngMb4W6OSA8VQuTItgj80jmEnOpeEC0bosWIkjihqnsY28fRNVoz0bs70ROf1ahw7taQreG7dsLFjtg4aQK19XzJLaj1RrtnHNksyPkOmK/gI1LiZJHRG01YfvYWDMyV7S6DEdgV7wE3Jzb+26LB57V9lEmSjwvSQ4Q2ZzIudKNeraM+ZU1zhz/fgcqwzGB/bBnAc6fawLJHdkQdAREhccL+FD+wRwJQ2NiP9Wc7QOLzcZIMCb6uKGnVYOXJ1nvqosYBXFgciC0/3wLR83sr1puHTx/xgdEExB2sR++wfbAWPSYTvnjUBw94u9AtndGEmK9vQHePYwR+6UIFPFwcqPzco81o6tOBwwLy58nhL+Ra1Je0DGDlCLM5Cj6yE7ws31nBNvfjufwmetnUMDHkbtZID+mNOFrbiza1DgajCWfS7oMXnzFQWKfC+pMt9PNHc+RIkPPR0qdDUX2fxUhlhwanG9X07LJJ7pDwRqIKIG3iBJQ29+NGr9Yi/131HbSodVQuPUoCc375CLhIDhIyYL+ohWrYgBCJM+YEiyxnjSYTrt0eQlGdigZ2lkKADx/1s4LdUwOS6JEePCQF2mYgOb8kYgJcuExVlrdrkHa0kX5+SM7HjmR/RpfBhMcP1OGmWkdlCxcp4e7C3Gtsxjb04bnDN+jmJ6lBiAsYa/T7y93IONlMo5i3NBThnkwWFNb2YH0+Y/ij+UFIUNg6+01FF7adboHWYELhM/dDKXG2OGDvQ/q311HW0g+lhIej6aE2IhRs7mWohvRIDhEjOyVgjAwJxLx911B3exBKdx6OpjE6CIyYnEroDSakRkrwxiwG0u+t14qbcaS6GwYTsGeEzd7yW3jnbCtI1Lck+WFRlPsYNdaMrevFqgO1DNjFoZgRaM0Csne4oguv59dT5/JXR0Ep5VHZoqvdWJ9XRw3kPhWCBKWbjZ/flHUiq7iRgi0YdXa8C6V/WYPy5j4opS44sjLSLtj4D8qhGtRj9v0SZM9X2sg8+/U1/NKogp/YGYVroixgp26/AFLuqdEeyExR/B5T+n3/sAHJuyrRo9FBIeHhs7+HIjm3EkM6I0I9XXHwmXBwzL1xRKMV7G93sGpvNd3e/FgQovwFFqOaYQO2Fzagpn0AUoEjTrwcAy6HKZWiy11Yf/AaAzYtHAkhE2zBnm9D1g/10OqNKFgXA6UHk+3jraf3VKGssY/KHfnnZPtgs84zYCPdkb3QNqufyq3AldZ+hMlc8d2aSVawb/xMMzb+PjHSZ/jY6OY7cRDha727WSC/qgsbDl6jrVImdkZ77zD9fHBNNO6X8W30WMHWdGPVJxX0USK9kJSbebFZLBCO/u4ueD89EqGjFBVVdOLlfVdoH8xdEY2EMIkt2NIWZOXVQqs3oWBTLJRervcGu/Miyup7oPTi48iGaXbAmhD/eglUGh1mTfTAmwvDLDLE93O1d7Dxm6tMZk6TIXOBuRUYMXXjWeiNRvqK2xsOIvyE+HbdVLv+LdlRjorGXst3s6M9kb00wq6sBWzJlS6syimjo0WYvwhurtbXjzhb1dCLwWEDPN2ccGhzHMR8R2i1WhRf7MCmkUzf9XwMEiKkNob2n2lC1rdXodUZkZ+ZCKWdCJsP9ff344XdV1Be1wOltwB5W+Lsgk3YcBoqjdYGEJlOyKPl4sxBXLgUr6YGw5XLZAlJlpmvkYw1QsDjwl1kfaDNRoK9BXhvRbSNzbo2NZ7M+tkSFMJJ5MLF8Yw4iAW2b4YVbFUnVr13nirc/XIsZkR6jFF+ub4HCzLOwoHDwquLI7DkkSCoVCqcLG/H1n21tBXsWjcdCVGetmBPNSDrqyraCvLfSYLSx7bUzIeam5vw+leNKP+tF0ofIfK2PWgf7AtFUA1oaXXpR8+zLBYcuWw4cdmIVIjx2uL7wDEyoxzHwQHzMsnjZURqohxbl9kCtJd+ZFJY+lYJqm70wJHLwSuLQpH5RTWt4sf/4ouslVPGbwUll9qx+u1SOo/u3pyAGVHWmYycGhjUIWbJYTg4sLF4thKblk2iYE/92oqte6pp5uzaFIf4aC+qw7xI9hwovoGszy8xGfufZCj9bCeHMWA/vY7yaz1Q+omQl/0I1TdaJymrhOXHoOrXInGKDK+kMY+TOSuLz93EjgNXaPU9+bAcS2dJ6XkCdv7GC9AZjHjiIQUyVjD9m/h4r/l9f1Ed3vrsEm2Tq/8WjsenC5B9oAGnyzrp+X2ZD2JS6DhTQUlZG1ZnnqaZ9/EbD2PGZO8xUbhy/TYWrC2kYNPnhWLdssno6+vDqXM3sXVXJT23M2Mmpk+UgpSzefH5fBw60Yi3d1+gYH/4eC6U/iJ60dFyXC4Xzs7OIBmbkVuD8upuKP3dcDgnhQbQYDBQlWw2G0KRCIlLvodKrcXseDm2b2DaxfDwMG1PBFLq2lNo7xrAtChPbF6uhMFgZMCu/Ylm7PykQLy4lOm9rq6ucHR0tMk64mNrhwqpa4sxOKSHzMMVx3LnorWlCepBYNmW89DpjAjwEeLQjhRwHay/SK2t4NcWrN50gjoVGSKBm9BqyGBkofJqFzRDOpiMJmx7dQYeSwqGWq3GqZImbP2wnDq1c9ssxE72HAOMOH2o8AbezjlPwe57PxHBCgnc3NzQ22t9CMjFiCwF++FllF/uglIuxuE982gAR4MVCIVITN0PlXoYs+J8sXZZCPz8/DA4OEjhEvjp606jvrkXUyI9kLk2AnqDgQG78n8UrJfUFUr5yGho/hlvMsJgMOGl5RHw8hBAJBJhzb9O4KeyNhgNJuRsS8LMWH80NDTQ+xac7cJHXzGT1IvPTsGziyZaK9X8k7bkXDPWrC8A+655bHQYjUYTwkLckZudBLFYyIA904DM7b8wYN9NxvSp3rZgj/+Gf3/wE7RaA/buTIIyyB1isXh8sO9cxMXKWwhSiHH4ywW2YAVCzEzZS8EmJfrjHyvCIJfLx4B9+vli1Df2YEqUF7a+Es2A5TjgibRiCna8RYJ/YM8c+PsKUV7Zg5f+dYIyiY/1R/abD9KqImCZR5KD1RtK0d7RDwcOG8f2L4SPjGlzloxtbOrF0eM1tC9ptcMwGPQjtlng8Vzg5MSBIkCEmMmeYLFMNJoEbPXVNpSUttJx68nUSfD3E9qAvVrTjaIT1SCBmZuigEw2YVywTU1NOPNjGzo6ByB1F+CZp6fZgBUKRcjJLYVGMwSFXIQHpkrHgCVVl3fsOtR9ekilToidJqa2yf7xgnb6HpgrgFySw+bQuw4Naehj+MS8YHh6iPBDQRO6bqspxL8+FgyZTAQXFxcLWHKmrV2Hi5fu0D98RE/0RkI88yvQAnZ0BDs7OzEwMGDZCgwMpNkwNGT9C5QZbHd3t0VOJpOBw+HYgCUXam5utjwQpA2Ml7EErPnSPB4P3t7eNmCJ7Y6ODmg0GuYSLBYCAgIsGWt26G4fCSBfX1/aKkb3d9KCyLp586bFR+Lf3e3KycnJBqzZRyOdjZlHmz6G/f39JvNFyIZAIMCfYEED/0fAkgeWwCWLBI7V19dn0uuZsicbJMp/gv3jYO9+YFkDAwNjMpaMR6S8R5e9j4+PZZQhASApTzKbtAsSKfNyd3enrYC0DbMcKRVSCaR0zbMiOUv+kR5t3jOPW+3t7ZbIk9IjOokdczYQ+bt9JHukDRGfdTqdxbY9H6VSKU0g0kbMtsmDRBZJKPOeUCikduyNhG1tbZayt+cj0f9/h10ppK6G0h8AAAAASUVORK5CYII=",
      "market_url": "/market/asdfs"
    },
    {
      "id": 4,
      "title": "HUOBI",
      "icon": "data:image/png;base64,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",
      "market_url": "/market/asdfs"
    }
  ]

function generateCoinsMonthChanges (coinsID ,coinMonthChangesCount, prevMonth, nowDate) {
  		let coinsChanges = []
  		for (let i = 0; i <= coinsID; i++) {
  			coinsChanges.push(
      				{
						"coin_id": i,
						"month_price_change": generateMonthPriceChange(coinMonthChangesCount, prevMonth, nowDate)
      				}
  				)
  		}
  		return coinsChanges
}

function generateMonthPriceChange (coinMonthChangesCount, prevMonth, nowDate) {
		let arr = []
		for (let i = 0; i <= coinMonthChangesCount; i++) {
			arr.push(
				{
	              "price": faker.finance.amount(0,10,2),
	              "date": faker.date.between(prevMonth , nowDate )
	            }
	        )
		}
		return arr
}

data.markets.forEach(function(market) {

		let nowDate = new Date()
		let prevMonth = moment(nowDate.setMonth(nowDate.getMonth() - 1) ).format('YYYY-MM-DD')
		let coinMonthChangesCount = 30

		/**
		* generate coins ID
		*/
		let coinsID = data.coins.length > 0 ? data.coins.length : 2

		market["price"] = faker.finance.amount(0,10,2)
      	market["volume"] = faker.finance.amount(100000,999990000,0)
      	market["coins_month_changes"] = generateCoinsMonthChanges (coinsID ,coinMonthChangesCount,prevMonth, nowDate)
})


/*
* Generate Trade overview
*/


data.trade_overview = []

let tradeOverviewCount = 30

for (let i = 0; i <= tradeOverviewCount; i++) {
	let nowDate = new Date()
	let prevMonth = moment(nowDate.setMonth(nowDate.getMonth() - 1) ).format('YYYY-MM-DD')
	data.trade_overview.push({
		"date": faker.date.between(prevMonth , nowDate ),
		"price": faker.finance.amount(0,10,2)
	})
}

/*
* Generate Operations per day
*/

data.operations_by_day = []

let operationsByDayCount = 30

function generateOperations (operationsCount) {
	let arr = []
      		for (let i = 0; i <= operationsCount; i++) {
      			let type = faker.random.arrayElement(["bought","swapped","sold"])
      			arr.push(
      					{
				          "type": type,
				          "value": faker.finance.amount(0,10,2),
				          "ticker": faker.random.arrayElement(data.coins).ticker,
				          "swapped_in": type === "swapped" ? faker.finance.amount(0,10,2) : null,
      					  "swapped_in_ticker": type === "swapped" ? faker.random.arrayElement(data.coins).ticker : null
				        }
      				)
      		}
      		return arr
}

for (let i = 0; i <= operationsByDayCount; i++) {
	let nowDate = new Date()
	let prevMonth = moment(nowDate.setMonth(nowDate.getMonth() - 1) ).format('YYYY-MM-DD')
	let date = faker.date.between(prevMonth , nowDate )
	let operationsCount = 5

	data.operations_by_day[i] = {
		"date": date,
      	"portfolio_cost": faker.finance.amount(0,9999000,2),
      	"operations": generateOperations(operationsCount)
	}


}

/**
* GENERATE !!!
*/
fs.writeFile('generated_data.json', JSON.stringify(data), (err) => {
  if (err) throw err;
  console.log('Random data generated.');
  console.log('generated_data.json succefully created!');
});
