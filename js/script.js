'use strict'

const output = document.querySelector('.output span')
const buttons = document.querySelector('.buttons')
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '±']
const operators = ['*', '-', '+', '/']

let firstOperand = ''
let lastOperand = ''
let operator = ''
let result = ''

const handleKeyDown = (e) => {
	const allSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '_', '*', '-', '+', '%', '/', 'Enter', 'Escape']
	let target = e.key
	if (!allSymbols.includes(target)) return
	if (target === '_') target = '±'
	if (target === 'Escape') target = 'AC'
	if (target === 'Enter') target = '='
	calculation(target)
}

const handleClick = (e) => {
	if (!e.target.classList.contains('button')) return
	let target = e.target.dataset.value
	calculation(target)
}

function calculation(target) {
	if (numbers.includes(target)) {
		// Работаем с первым операндом
		if (result && target !== '±') clear()
		if (!operator) {
			// Проверка на наличие точки
			if (target === '.' && firstOperand.includes('.')) return
			if (target === '.') {
				if (!firstOperand) {
					firstOperand = '0'
				}
			}
			// Убираем/добавляем унарный минус
			if (target === '±') {
				if (!firstOperand) {
					firstOperand = '0'
				}
				firstOperand = String(firstOperand).split('')
				if (firstOperand[0] === '-') {
					firstOperand.shift()
				} else {
					firstOperand.unshift('-')
				}
				firstOperand = firstOperand.join('')
				output.innerHTML = (+firstOperand).toLocaleString('RU', { maximumFractionDigits: 6 })
				return
			}
			// Уменьшаем шрифт, если длинна числа > 9
			if (firstOperand.length >= 8) {
				output.classList.add('low')
			} else {
				output.classList.remove('low')
			}
			// Максимальное число цифр - 12
			if (firstOperand.length > 11) return
			firstOperand += target
			output.innerHTML = (+firstOperand).toLocaleString('RU', { maximumFractionDigits: 6 })
		} else {
			// Работаем со вторым операндом
			output.classList.remove('lowlow')
			// Проверяем на наличие точки
			if (target === '.' && lastOperand.includes('.')) return
			if (target === '.') {
				if (!lastOperand) {
					lastOperand = '0'
				}
			}
			// Убираем/добавляем унарный минус
			if (target === '±') {
				if (!lastOperand) {
					lastOperand = '0'
				}
				lastOperand = lastOperand.split('')
				if (lastOperand[0] === '-') {
					lastOperand.shift()
				} else {
					lastOperand.unshift('-')
				}
				lastOperand = lastOperand.join('')
				output.innerHTML = (+lastOperand).toLocaleString('RU', { maximumFractionDigits: 6 })
				return
			}
			// Уменьшаем шрифт, если длинна числа > 9
			if (lastOperand.length >= 8) {
				output.classList.add('low')
			} else {
				output.classList.remove('low')
			}
			// Максимальное число цифр - 12
			if (lastOperand.length > 11) return
			lastOperand += target
			output.innerHTML = (+lastOperand).toLocaleString('RU', { maximumFractionDigits: 6 })
		}
		// Работаем с оператором
	} else if (operators.includes(target)) {
		if (!firstOperand) return
		if (firstOperand && lastOperand && operator) {
			handleResult(operator)
		}
		operator = target
		result = ''
		// Работаем с "="
	} else if (target === '=') {
		if (!firstOperand || !operator) return
		if (!lastOperand) {
			lastOperand = firstOperand
		}
		handleResult(operator)
		if (lastOperand.length >= 8) {
			output.classList.add('low')
		} else {
			output.classList.remove('low')
		}
		if (firstOperand.length <= 8) {
			removeClasses()
		}
		// Работаем со сбросом
	} else if (target === 'AC') {
		clear()
		// Работаем с процентами
	} else if (target === '%') {
		if (!firstOperand || !operator || !lastOperand) return
		handleProcent(operator)
	}
}

const removeClasses = () => {
	output.classList.remove('low', 'lowlow')
}
// Обработка нажатого оператора

const outputState = () => {
	if (String(Math.round(firstOperand)).length >= 9) {
		output.classList.add('lowlow')
	} else if (String(Math.round(firstOperand)).length > 6 && String(Math.round(firstOperand)).length < 9) {
		output.classList.add('low')
	} else {
		removeClasses()
	}
	output.innerHTML = (+firstOperand).toLocaleString('RU', { maximumFractionDigits: 2 })
	lastOperand = operator = ''
}

function handleResult(currentOperator) {
	switch (currentOperator) {
		case '+': result = firstOperand = +firstOperand + +lastOperand
			outputState()
			break
		case '-': result = firstOperand = firstOperand - lastOperand
			outputState()
			break
		case '*': result = firstOperand = firstOperand * lastOperand
			outputState()
			break
		case '/': result = firstOperand = firstOperand / lastOperand
			outputState()
			break
	}
}

// Обработка нажатого процента
function handleProcent(currentOperator) {
	switch (currentOperator) {
		case '+': result = firstOperand = +firstOperand + (firstOperand / 100 * lastOperand)
			outputState()
			break
		case '-': result = firstOperand = firstOperand - (firstOperand / 100 * lastOperand)
			outputState()
			break
		case '*': result = firstOperand = firstOperand / 100 * lastOperand
			outputState()
			break
		case '/': result = firstOperand = lastOperand / firstOperand
			outputState()
			break
	}
}

const clear = () => {
	lastOperand = firstOperand = result = operator = ''
	output.textContent = '0'
	removeClasses()
}

document.addEventListener('keydown', handleKeyDown)
buttons.addEventListener('click', handleClick)