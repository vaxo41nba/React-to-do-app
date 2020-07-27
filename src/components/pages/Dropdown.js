import React, { Component, createRef } from 'react';
import TextField from '@material-ui/core/TextField';

let bigArray = [];
for (let j = 1; j <= 10000; j++) {
	bigArray.push('Item No' + j);
}

const initialState = {
	array: bigArray,
	countedArray: [],
	filteredArray: [],
	searchPattern: [],
	inputValue: '',
	amount: 100,
};

const inputField = createRef();
const barField = createRef();
const loadMoreRef = createRef();

class Dropdown extends Component {
	state = initialState;

	searchPattern = () => {
		let { searchPattern } = this.state;
		return new RegExp(searchPattern.map((e) => `(?=.*${e})`).join(''), 'i');
	};

	addload100ItemsListener = () => {
		loadMoreRef.current.addEventListener('click', this.load100Items);
	};
	removeload100ItemsListener = () => {
		loadMoreRef.current.removeEventListener('click', this.load100Items);
	};
	addloadAndFilterListener = () => {
		loadMoreRef.current.addEventListener('click', this.loadAndFilter);
	};
	removeloadAndFilterListener = () => {
		loadMoreRef.current.removeEventListener('click', this.loadAndFilter);
	};

	handleChange = (e) => {
		let { array } = this.state;
		let value = e.target.value;
		if (value.length) {
			this.setState(
				{
					inputValue: value,
					amount: 100,
					searchPattern: value.split(' '),
				},
				() => {
					this.setState(
						{
							filteredArray: array.filter((item) =>
								item.match(this.searchPattern())
							),
						},
						() => {
							this.filterByAmount();
							this.removeload100ItemsListener();
							this.addloadAndFilterListener();
						}
					);
				}
			);
		}
	};

	filterByAmount = () => {
		let { filteredArray, amount } = this.state;
		let countedArray = [];
		for (let i = 0; i < Math.min(filteredArray.length, amount); i++) {
			countedArray.push(filteredArray[i]);
		}
		this.setState({ countedArray: countedArray });
	};

	loadMore = () => {
		let { amount } = this.state;
		this.setState({ amount: amount + 100 });
	};

	loadAndFilter = () => {
		this.loadMore();
		this.filterByAmount();
	};

	load100Items = () => {
		let { countedArray, amount, array } = this.state;
		if (countedArray.length > amount) {
			this.setState({
				countedArray: array.filter(
					(e, i, arr) => arr.indexOf(e) < amount + 100
				),
			});
		} else {
			this.setState({
				countedArray: array.filter((e, i, arr) => arr.indexOf(e) < amount),
			});
		}
	};

	render() {
		let { inputValue, countedArray } = this.state;
		console.log(this.state);
		return (
			<React.Fragment>
				<TextField
					inputRef={inputField}
					className="regInputField"
					size="small"
					variant="outlined"
					onChange={(e) => {
						this.handleChange(e);
						if (!e.target.value.length) {
							this.setState(initialState);
						}
					}}
					onClick={() => {
						if (
							!inputValue &&
							document.activeElement === inputField.current
						) {
							this.removeloadAndFilterListener();
							this.addload100ItemsListener();
							this.load100Items();
						}
					}}
					onFocus={(e) => {
						this.handleChange(e);
					}}
					onBlur={() => {
						setTimeout(() => {
							this.setState(initialState);
						}, 100);
					}}
				/>
				<div
					className={
						countedArray.length >= 20
							? 'scrollBar'
							: !inputValue || countedArray.length === 0
							? 'hide'
							: 'barShow'
					}
					id={'listbar'}
					ref={barField}
					onScroll={() => {
						if (
							barField.current.scrollTop +
								barField.current.clientHeight +
								500 >=
							barField.current.scrollHeight
						) {
							loadMoreRef.current.click();
						}
					}}
				>
					{countedArray.map((item, i) => (
						<div
							key={i}
							onClick={() => {
								this.setState(initialState);
								inputField.current.value = item;
							}}
						>
							{item}
						</div>
					))}
					<button
						ref={loadMoreRef}
						onClick={this.loadMore}
						style={{ display: 'none' }}
						id={'button'}
					>
						Load More
					</button>
				</div>
			</React.Fragment>
		);
	}
}

export default Dropdown;
