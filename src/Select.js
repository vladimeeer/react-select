import React from 'react';
import ReactDOM from 'react-dom';
import Input from 'react-input-autosize';
import classNames from 'classnames';

import stripDiacritics from './utils/stripDiacritics';

import Async from './Async';
import Option from './Option';
import Value from './Value';

function stringifyValue (value) {
	if (typeof value === 'object') {
		return JSON.stringify(value);
	} else {
		return value;
	}
}

const stringOrNode = React.PropTypes.oneOfType([
	React.PropTypes.string,
	React.PropTypes.node
]);

const Select = React.createClass({

	displayName: 'Select',

	propTypes: {
		ignoreAccents: React.PropTypes.bool,       // whether to strip diacritics when filtering
		joinValues: React.PropTypes.bool,          // joins multiple values into a single form field with the delimiter (legacy mode)
		menuBuffer: React.PropTypes.number,        // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
		menuContainerStyle: React.PropTypes.object,// optional style to apply to the menu container
		menuRenderer: React.PropTypes.func,        // renders a custom menu with options
		menuStyle: React.PropTypes.object,         // optional style to apply to the menu
		onBlurResetsInput: React.PropTypes.bool,   // whether input is cleared on blur
		onClose: React.PropTypes.func,             // fires when the menu is closed
		onFocus: React.PropTypes.func,             // onFocus handler: function (event) {}
		onMenuScrollToBottom: React.PropTypes.func,// fires when the menu is scrolled to the bottom; can be used to paginate options
		onOpen: React.PropTypes.func,              // fires when the menu is opened
		onValueClick: React.PropTypes.func,        // onClick handler for value labels: function (value, event) {}
		openAfterFocus: React.PropTypes.bool,      // boolean to enable opening dropdown when focused
		optionClassName: React.PropTypes.string,   // additional class(es) to apply to the <Option /> elements
		required: React.PropTypes.bool,            // applies HTML5 required attribute when needed
		scrollMenuIntoView: React.PropTypes.bool,  // boolean to enable the viewport to shift so that the full menu fully visible when engaged
		simpleValue: React.PropTypes.bool,         // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
		style: React.PropTypes.object,             // optional style to apply to the control
		tabIndex: React.PropTypes.string,          // optional tab index of the control
		tabSelectsValue: React.PropTypes.bool,     // whether to treat tabbing out while focused to be value selection
		wrapperStyle: React.PropTypes.object,      // optional style to apply to the component wrapper
		addLabelRender: React.PropTypes.func,
		allowCreate: React.PropTypes.bool,         // whether to allow creation of new entries         
		openOnFocus: React.PropTypes.bool,         // always open options menu on focus
		autoBlur: React.PropTypes.bool,            // automatically blur the component when an option is selected
		autofocus: React.PropTypes.bool,           // autofocus the component on mount
		autosize: React.PropTypes.bool,            // whether to enable autosizing or not             
		asyncOptions: React.PropTypes.func,        // function to call to get options
		autoload: React.PropTypes.bool,            // whether to auto-load the default async options set
		backspaceRemoves: React.PropTypes.bool,    // whether backspace removes an item if there is no text input
		cacheAsyncResults: React.PropTypes.bool,   // whether to allow cache
		className: React.PropTypes.string,         // className for the outer element
		clearAllText: React.PropTypes.string,      // title for the "clear" control when multi: true
		clearValueText: React.PropTypes.string,    // title for the "clear" control
		clearable: React.PropTypes.bool,           // should it be possible to reset value
		delimiter: React.PropTypes.string,         // delimiter to use to join multiple values
		disabled: React.PropTypes.bool,            // whether the Select is disabled or not
		escapeClearsValue: React.PropTypes.bool,    // whether escape clears the value when the menu is closed
		filterOption: React.PropTypes.func,        // method to filter a single option  (option, filterString)
		filterOptions: React.PropTypes.any,       // method to filter the options array: function ([options], filterString, [values])
		ignoreCase: React.PropTypes.bool,          // whether to perform case-insensitive filtering
		inputProps: React.PropTypes.object,        // custom attributes for the Input (in the Select-control) e.g: {'data-foo': 'bar'}
		isLoading: React.PropTypes.bool,           // whether the Select is loading externally or not (such as options being loaded)
		labelKey: React.PropTypes.string,          // path of the label value in option objects
		matchPos: React.PropTypes.string,          // (any|start) match the start or entire string when filtering
		matchProp: React.PropTypes.string,         // (any|label|value) which option property to filter on
		multi: React.PropTypes.bool,               // multi-value input
		name: React.PropTypes.string,              // field name, for hidden <input /> tag
		newOptionCreator: React.PropTypes.func,    // factory to create new options when allowCreate set
		noResultsText: React.PropTypes.string,     // placeholder displayed when there are no matching search results
		onBlur: React.PropTypes.func,              // onBlur handler: function (event) {}
		onChange: React.PropTypes.func,            // onChange handler: function (newValue) {}
		onFocus: React.PropTypes.func,             // onFocus handler: function (event) {}
		onInputChange: React.PropTypes.func,       // onInputChange handler: function (inputValue) {}
		onOptionLabelClick: React.PropTypes.func,  // onCLick handler for value labels: function (value, event) {}
		optionComponent: React.PropTypes.func,     // option component to render in dropdown
		optionRenderer: React.PropTypes.func,      // optionRenderer: function (option) {}
		options: React.PropTypes.array,            // array of options
		placeholder: React.PropTypes.string,       // field placeholder, displayed when there's no value
		searchable: React.PropTypes.bool,          // whether to enable searching feature or not
		searchingText: React.PropTypes.string,     // message to display whilst options are loading via asyncOptions
		searchPromptText: React.PropTypes.string,  // label to prompt for search input
		singleValueComponent: React.PropTypes.func,// single value component when multiple is set to false
		value: React.PropTypes.any,                // initial field value
		valueComponent: React.PropTypes.func,      // value component to render in multiple mode
		valueKey: React.PropTypes.string,          // path of the label value in option objects
		valueRenderer: React.PropTypes.func        // valueRenderer: function (option) {}
	},

	statics: { Async },

	getDefaultProps () {
		return {
			addLabelRender: (label) => {return 'Add "{label}"?'.replace('{label}', label)},
			allowCreate: false,
			backspaceRemoves: true,
			clearable: true,
			clearAllText: 'Clear all',
			clearValueText: 'Clear value',
			delimiter: ',',
			disabled: false,
			escapeClearsValue: true,
			filterOptions: true,
			ignoreAccents: true,
			ignoreCase: true,
			inputProps: {},
			isLoading: false,
			joinValues: false,
			labelKey: 'label',
			matchPos: 'any',
			matchProp: 'any',
			menuBuffer: 0,
			multi: false,
			noResultsText: 'No results found',
			onBlurResetsInput: true,
			openAfterFocus: false,
			optionComponent: Option,
			placeholder: 'Select...',
			required: false,
			scrollMenuIntoView: true,
			searchable: true,
			simpleValue: false,
			tabSelectsValue: true,
			valueComponent: Value,
			valueKey: 'value',
		};
	},

	getInitialState () {
		return {
			inputValue: '',
			isFocused: false,
			isLoading: false,
			isOpen: false,
			isPseudoFocused: false,
			required: this.props.required && this.handleRequired(this.props.value, this.props.multi)
		};
	},

	componentDidMount () {
		if (this.props.autofocus) {
			this.focus();
		}
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.value !== nextProps.value && nextProps.required) {
			this.setState({
				required: this.handleRequired(nextProps.value, nextProps.multi),
			});
		}
	},

	componentWillUpdate (nextProps, nextState) {
		if (nextState.isOpen !== this.state.isOpen) {
			const handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
			handler && handler();
		}
	},

	componentDidUpdate (prevProps, prevState) {
		// focus to the selected option
		if (this.refs.menu && this.refs.focused && this.state.isOpen && !this.hasScrolledToOption) {
			let focusedOptionNode = ReactDOM.findDOMNode(this.refs.focused);
			let menuNode = ReactDOM.findDOMNode(this.refs.menu);
			menuNode.scrollTop = focusedOptionNode.offsetTop;
			this.hasScrolledToOption = true;
		} else if (!this.state.isOpen) {
			this.hasScrolledToOption = false;
		}

		if (prevState.inputValue !== this.state.inputValue && this.props.onInputChange) {
			this.props.onInputChange(this.state.inputValue);
		}
		if (this._scrollToFocusedOptionOnUpdate && this.refs.focused && this.refs.menu) {
			this._scrollToFocusedOptionOnUpdate = false;
			var focusedDOM = ReactDOM.findDOMNode(this.refs.focused);
			var menuDOM = ReactDOM.findDOMNode(this.refs.menu);
			var focusedRect = focusedDOM.getBoundingClientRect();
			var menuRect = menuDOM.getBoundingClientRect();
			if (focusedRect.bottom > menuRect.bottom || focusedRect.top < menuRect.top) {
				menuDOM.scrollTop = (focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight);
			}
		}
		if (this.props.scrollMenuIntoView && this.refs.menuContainer) {
			var menuContainerRect = this.refs.menuContainer.getBoundingClientRect();
			if (window.innerHeight < menuContainerRect.bottom + this.props.menuBuffer) {
				window.scrollBy(0, menuContainerRect.bottom + this.props.menuBuffer - window.innerHeight);
			}
		}
		if (prevProps.disabled !== this.props.disabled) {
			this.setState({ isFocused: false }); // eslint-disable-line react/no-did-update-set-state
		}
	},

	focus () {
		if (!this.refs.input) return;
		this.refs.input.focus();

		if (this.props.openAfterFocus) {
			this.setState({
				isOpen: true,
			});
		}
	},

	blurInput() {
		if (!this.refs.input) return;
		this.refs.input.blur();
	},

	handleTouchMove (event) {
		// Set a flag that the view is being dragged
		this.dragging = true;
	},

	handleTouchStart (event) {
		// Set a flag that the view is not being dragged
		this.dragging = false;
	},

	handleTouchEnd (event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if(this.dragging) return;

		// Fire the mouse events
		this.handleMouseDown(event);
	},

	handleTouchEndClearValue (event) {
		// Check if the view is being dragged, In this case
		// we don't want to fire the click event (because the user only wants to scroll)
		if(this.dragging) return;

		// Clear the value
		this.clearValue(event);
	},

	handleMouseDown (event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
			return;
		}

		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();

		// for the non-searchable select, toggle the menu
		if (!this.props.searchable) {
			this.focus();
			return this.setState({
				isOpen: !this.state.isOpen,
			});
		}

		if (this.state.isFocused) {
			// if the input is focused, ensure the menu is open
			this.setState({
				isOpen: true,
				isPseudoFocused: false,
			});
		} else {
			// otherwise, focus the input and open the menu
			this._openAfterFocus = true;
			this.focus();
		}
	},

	handleMouseDownOnArrow (event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
			return;
		}
		// If the menu isn't open, let the event bubble to the main handleMouseDown
		if (!this.state.isOpen) {
			return;
		}
		// prevent default event handlers
		event.stopPropagation();
		event.preventDefault();
		// close the menu
		this.closeMenu();
	},

	handleMouseDownOnMenu (event) {
		// if the event was triggered by a mousedown and not the primary
		// button, or if the component is disabled, ignore it.
		if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();

		this._openAfterFocus = true;
		this.focus();
	},

	closeMenu () {
		this.setState({
			isOpen: false,
			isPseudoFocused: this.state.isFocused && !this.props.multi,
			inputValue: '',
		});
		this.hasScrolledToOption = false;
	},

	handleInputFocus (event) {
		var isOpen = this.state.isOpen || this._openAfterFocus || this.props.openOnFocus;
		if (this.props.onFocus) {
			this.props.onFocus(event);
		}
		this.setState({
			isFocused: true,
			isOpen: isOpen
		});
		this._openAfterFocus = false;
	},

	handleInputBlur (event) {
		if (this.refs.menu && document.activeElement.isEqualNode(this.refs.menu)) {
			this.focus();
			return;
		}

		if (this.props.onBlur) {
			this.props.onBlur(event);
		}
		var onBlurredState = {
			isFocused: false,
			isOpen: false,
			isPseudoFocused: false,
		};
		if (this.props.onBlurResetsInput) {
			onBlurredState.inputValue = '';
		}
		this.setState(onBlurredState);
	},

	handleInputChange (event) {
		this.setState({
			isOpen: true,
			isPseudoFocused: false,
			inputValue: event.target.value,
		});
	},

	handleKeyDown (event) {
		if (this.props.disabled) return;
		switch (event.keyCode) {
			case 8: // backspace
				if (!this.state.inputValue && this.props.backspaceRemoves) {
					event.preventDefault();
					this.popValue();
				}
			return;
			case 9: // tab
				if (event.shiftKey || !this.state.isOpen || !this.props.tabSelectsValue) {
					return;
				}
				this.selectFocusedOption();
			return;
			case 13: // enter
				if (!this.state.isOpen) return;
				event.stopPropagation();
				this.selectFocusedOption();
			break;
			case 27: // escape
				if (this.state.isOpen) {
					this.closeMenu();
				} else if (this.props.clearable && this.props.escapeClearsValue) {
					this.clearValue(event);
				}
			break;
			case 38: // up
				this.focusPreviousOption();
			break;
			case 40: // down
				this.focusNextOption();
			break;
			case 188: // ,
				if (this.props.allowCreate && this.props.multi) {
					event.preventDefault();
					event.stopPropagation();
					this.selectFocusedOption();
				} else {
					return;
				}
			break;
			default: return;
		}
		event.preventDefault();
	},

	handleValueClick (option, event) {
		if (!this.props.onValueClick) return;
		this.props.onValueClick(option, event);
	},

	handleMenuScroll (event) {
		if (!this.props.onMenuScrollToBottom) return;
		let { target } = event;
		if (target.scrollHeight > target.offsetHeight && !(target.scrollHeight - target.offsetHeight - target.scrollTop)) {
			this.props.onMenuScrollToBottom();
		}
	},

	handleRequired (value, multi) {
		if (!value) return true;
		return (multi ? value.length === 0 : Object.keys(value).length === 0);
	},

	getOptionLabel (op) {
		return op[this.props.labelKey];
	},

	getValueArray () {
		let value = this.props.value;
		if (this.props.multi) {
			if (typeof value === 'string') value = value.split(this.props.delimiter);
			if (!Array.isArray(value)) {
				if (value === null || value === undefined) return [];
				value = [value];
			}
			return value.map(this.expandValue).filter(i => i);
		}
		var expandedValue = this.expandValue(value);
		return expandedValue ? [expandedValue] : [];
	},

	expandValue (value) {
		if (typeof value !== 'string' && typeof value !== 'number') return value;
		let { options, valueKey } = this.props;
		if (!options) return;
		for (var i = 0; i < options.length; i++) {
			if (options[i][valueKey] === value) return options[i];
		}
	},

	setValue (value) {
		if (this.props.autoBlur){
			this.blurInput();
		}
		if (!this.props.onChange) return;
		if (this.props.required) {
			const required = this.handleRequired(value, this.props.multi);
			this.setState({ required });
		}
		if (this.props.simpleValue && value) {
			value = this.props.multi ? value.map(i => i[this.props.valueKey]).join(this.props.delimiter) : value[this.props.valueKey];
		}
		this.props.onChange(value);
	},

	selectValue (value) {
		this.hasScrolledToOption = false;
		if (this.props.multi) {
			this.addValue(value);
			this.setState({
				inputValue: '',
			});
		} else {
			this.setValue(value);
			this.setState({
				isOpen: false,
				inputValue: '',
				isPseudoFocused: this.state.isFocused,
			});
		}
	},

	addValue (value) {
		var valueArray = this.getValueArray();
		this.setValue(valueArray.concat(value));
	},

	popValue () {
		var valueArray = this.getValueArray();
		if (!valueArray.length) return;
		if (valueArray[valueArray.length-1].clearableValue === false) return;
		this.setValue(valueArray.slice(0, valueArray.length - 1));
	},

	removeValue (value) {
		var valueArray = this.getValueArray();
		this.setValue(valueArray.filter(i => i !== value));
		this.focus();
	},

	clearValue (event) {
		// if the event was triggered by a mousedown and not the primary
		// button, ignore it.
		if (event && event.type === 'mousedown' && event.button !== 0) {
			return;
		}
		event.stopPropagation();
		event.preventDefault();
		this.setValue(null);
		this.setState({
			isOpen: false,
			inputValue: '',
		}, this.focus);
	},

	focusOption (option) {
		this.setState({
			focusedOption: option
		});
	},

	focusNextOption () {
		this.focusAdjacentOption('next');
	},

	focusPreviousOption () {
		this.focusAdjacentOption('previous');
	},

	createNewOption() {
		if (this.props.allowCreate && this.state.inputValue.trim()) {
			var inputValue = this.state.inputValue;
			return this.props.newOptionCreator ? this.props.newOptionCreator(inputValue) : {
				value: inputValue,
				label: inputValue,
				create: true
			};
		} else {
			return null;
		}
	},

	focusAdjacentOption (dir) {

		this._scrollToFocusedOptionOnUpdate = true;
		this._focusedOptionReveal = true;
		var ops = this.state.filteredOptions.filter(function(op) {
			return !op.disabled;
		});

		let newOption = this.createNewOption();
		if (newOption !== null) {
			ops = ops.slice();
			ops.unshift(newOption);
		}

		if (!this.state.isOpen) {
			this.setState({
				isOpen: true,
				inputValue: '',
				focusedOption: this._focusedOption || options[dir === 'next' ? 0 : options.length - 1]
			});
			return;
		}
		if (!ops.length) {
			return;
		}
		var focusedIndex = -1;
		for (var i = 0; i < ops.length; i++) {
			if (this.state.focusedOption === ops[i] || (this.state.focusedOption.create && ops[i].create)) {
				focusedIndex = i;
				break;
			}
		}
		var focusedOption = ops[0];
		if (dir === 'next' && focusedIndex > -1 && focusedIndex < ops.length - 1) {
			focusedOption = ops[focusedIndex + 1];
		} else if (dir === 'previous') {
			if (focusedIndex > 0) {
				focusedOption = ops[focusedIndex - 1];
			} else {
				focusedOption = ops[ops.length - 1];
			}
		}
		this.setState({
			focusedOption: focusedOption
		});
	},

	selectFocusedOption () {
		if (this.props.allowCreate && !this.state.focusedOption) {
			return this.selectValue(this.state.inputValue);
		}

		if (this._focusedOption) {
			return this.selectValue(this._focusedOption);
		}
	},

	renderLoading () {
		if (!this.props.isLoading) return;
		return (
			<span className="Select-loading-zone" aria-hidden="true">
				<span className="Select-loading" />
			</span>
		);
	},

	renderValue (valueArray, isOpen) {
		let renderLabel = this.props.valueRenderer || this.getOptionLabel;
		let ValueComponent = this.props.valueComponent;
		if (!valueArray.length) {
			return !this.state.inputValue ? <div className="Select-placeholder">{this.props.placeholder}</div> : null;
		}
		let onClick = this.props.onValueClick ? this.handleValueClick : null;
		if (this.props.multi) {
			return valueArray.map((value, i) => {
				return (
					<ValueComponent
						disabled={this.props.disabled || value.clearableValue === false}
						key={`value-${i}-${value[this.props.valueKey]}`}
						onClick={onClick}
						onRemove={this.removeValue}
						value={value}
						>
						{renderLabel(value)}
					</ValueComponent>
				);
			});
		} else if (!this.state.inputValue) {
			if (isOpen) onClick = null;
			return (
				<ValueComponent
					disabled={this.props.disabled}
					onClick={onClick}
					value={valueArray[0]}
					>
					{renderLabel(valueArray[0])}
				</ValueComponent>
			);
		}
	},

	buildMenu () {
		var focusedValue = this.state.focusedOption ? this.state.focusedOption[this.props.valueKey] : null;
		var renderLabel = this.props.optionRenderer || this.renderOptionLabel;
		if (this.state.filteredOptions.length > 0) {
			focusedValue = focusedValue == null ? this.state.filteredOptions[0] : focusedValue;
		}
		// Add the current value to the filtered options in last resort
		var options = this.state.filteredOptions;
		let newOption = this.createNewOption();
		if (newOption !== null) {
			options = options.slice();
			options.unshift(newOption);
		}
		var ops = Object.keys(options).map(function(key) {
			var op = options[key];
			var isSelected = this.state.value === op[this.props.valueKey];
			var isFocused = focusedValue === op[this.props.valueKey];
			var optionClass = classes({
				'Select-option': true,
				'is-selected': isSelected,
				'is-focused': isFocused,
				'is-disabled': op.disabled
			});
			var ref = isFocused ? 'focused' : null;
			var optionResult = React.createElement(this.props.optionComponent, {
				key: 'option-' + op[this.props.valueKey],
				className: optionClass,
				renderFunc: renderLabel,
				mouseDown: this.selectValue,
				mouseEnter: this.focusOption,
				mouseLeave: this.unfocusOption,
				addLabelRender: this.props.addLabelRender,
				option: op,
				ref: ref
			});
			return optionResult;
		}, this);

		if (ops.length) {
			return ops;
		} else {
			var noResultsText, promptClass;
			if (this.isLoading()) {
				promptClass = 'Select-searching';
				noResultsText = this.props.searchingText;
			} else if (this.state.inputValue || !this.props.asyncOptions) {
				promptClass = 'Select-noresults';
				noResultsText = this.props.noResultsText;
			} else {
				promptClass = 'Select-search-prompt';
				noResultsText = this.props.searchPromptText;
			}

			return (
				<div className={promptClass}>
					{noResultsText}
				</div>
			);
		}
	},

	renderInput (valueArray) {
		var className = classNames('Select-input', this.props.inputProps.className);
		if (this.props.disabled || !this.props.searchable) {
			return (
				<div
					{...this.props.inputProps}
					className={className}
					tabIndex={this.props.tabIndex || 0}
					onBlur={this.handleInputBlur}
					onFocus={this.handleInputFocus}
					ref="input"
					style={{ border: 0, width: 1, display:'inline-block' }}/>
			);
		}
		if (this.props.autosize) {
			return (
				<Input
					{...this.props.inputProps}
					className={className}
					tabIndex={this.props.tabIndex}
					onBlur={this.handleInputBlur}
					onChange={this.handleInputChange}
					onFocus={this.handleInputFocus}
					minWidth="5"
					ref="input"
					required={this.state.required}
					value={this.state.inputValue}
				/>
			);
		}
		return (
			<div className={ className }>
				<input
					{...this.props.inputProps}
					tabIndex={this.props.tabIndex}
					onBlur={this.handleInputBlur}
					onChange={this.handleInputChange}
					onFocus={this.handleInputFocus}
					ref="input"
					required={this.state.required}
					value={this.state.inputValue}
				/>
			</div>
		);
	},

	renderClear () {
		if (!this.props.clearable || !this.props.value || (this.props.multi && !this.props.value.length) || this.props.disabled || this.props.isLoading) return;
		return (
			<span className="Select-clear-zone" title={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
						aria-label={this.props.multi ? this.props.clearAllText : this.props.clearValueText}
						onMouseDown={this.clearValue}
						onTouchStart={this.handleTouchStart}
						onTouchMove={this.handleTouchMove}
						onTouchEnd={this.handleTouchEndClearValue}>
				<span className="Select-clear" dangerouslySetInnerHTML={{ __html: '&times;' }} />
			</span>
		);
	},

	renderArrow () {
		return (
			<span className="Select-arrow-zone" onMouseDown={this.handleMouseDownOnArrow}>
				<span className="Select-arrow" onMouseDown={this.handleMouseDownOnArrow} />
			</span>
		);
	},

	filterOptions (excludeOptions) {
		var filterValue = this.state.inputValue;
		var options = this.props.options || [];
		if (typeof this.props.filterOptions === 'function') {
			return this.props.filterOptions.call(this, options, filterValue, excludeOptions);
		} else if (this.props.filterOptions) {
			if (this.props.ignoreAccents) {
				filterValue = stripDiacritics(filterValue);
			}
			if (this.props.ignoreCase) {
				filterValue = filterValue.toLowerCase();
			}
			if (excludeOptions) excludeOptions = excludeOptions.map(i => i[this.props.valueKey]);
			return options.filter(option => {
				if (excludeOptions && excludeOptions.indexOf(option[this.props.valueKey]) > -1) return false;
				if (this.props.filterOption) return this.props.filterOption.call(this, option, filterValue);
				if (!filterValue) return true;
				var valueTest = String(option[this.props.valueKey]);
				var labelTest = String(option[this.props.labelKey]);
				if (this.props.ignoreAccents) {
					if (this.props.matchProp !== 'label') valueTest = stripDiacritics(valueTest);
					if (this.props.matchProp !== 'value') labelTest = stripDiacritics(labelTest);
				}
				if (this.props.ignoreCase) {
					if (this.props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
					if (this.props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
				}
				return this.props.matchPos === 'start' ? (
					(this.props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue) ||
					(this.props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue)
				) : (
					(this.props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0) ||
					(this.props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0)
				);
			});
		} else {
			return options;
		}
	},

	renderMenu (options, valueArray, focusedOption) {
		// Add the current value to the filtered options in last resort
		let newOption = this.createNewOption();
		if (newOption !== null) {
			options = options.slice();
			options.unshift(newOption);
		}
		
		if (options && options.length) {
			if (this.props.menuRenderer) {
				return this.props.menuRenderer({
					focusedOption,
					focusOption: this.focusOption,
					labelKey: this.props.labelKey,
					options,
					selectValue: this.selectValue,
					valueArray,
				});
			} else {
				let Option = this.props.optionComponent;
				let renderLabel = this.props.optionRenderer || this.getOptionLabel;

				return options.map((option, i) => {
					let isSelected = valueArray && valueArray.indexOf(option) > -1;
					let isFocused = option === focusedOption;
					let optionRef = isFocused ? 'focused' : null;
					let optionClass = classNames(this.props.optionClassName, {
						'Select-option': true,
						'is-selected': isSelected,
						'is-focused': isFocused,
						'is-disabled': option.disabled,
					});

					return (
						<Option
							className={optionClass}
							isDisabled={option.disabled}
							isFocused={isFocused}
							key={`option-${i}-${option[this.props.valueKey]}`}
							onSelect={this.selectValue}
							onFocus={this.focusOption}
							option={option}
							isSelected={isSelected}
							ref={optionRef}
							>
							{renderLabel(option)}
						</Option>
					);
				});
			}
		} else if (this.props.noResultsText) {
			return (
				<div className="Select-noresults">
					{this.props.noResultsText}
				</div>
			);
		} else {
			return null;
		}
	},

	renderHiddenField (valueArray) {
		if (!this.props.name) return;
		if (this.props.joinValues) {
			let value = valueArray.map(i => stringifyValue(i[this.props.valueKey])).join(this.props.delimiter);
			return (
				<input
					type="hidden"
					ref="value"
					name={this.props.name}
					value={value}
					disabled={this.props.disabled} />
			);
		}
		return valueArray.map((item, index) => (
			<input key={'hidden.' + index}
				type="hidden"
				ref={'value' + index}
				name={this.props.name}
				value={stringifyValue(item[this.props.valueKey])}
				disabled={this.props.disabled} />
		));
	},

	getFocusableOption (selectedOption) {
		var options = this._visibleOptions;
		if (!options.length) return;
		let focusedOption = this.state.focusedOption || selectedOption;
		if (focusedOption && options.indexOf(focusedOption) > -1) return focusedOption;
		for (var i = 0; i < options.length; i++) {
			if (!options[i].disabled) return options[i];
		}
	},

	renderOuter (options, valueArray, focusedOption) {
		let menu = this.renderMenu(options, valueArray, focusedOption);
		if (!menu) {
			return null;
		}

		return (
			<div ref="menuContainer" className="Select-menu-outer" style={this.props.menuContainerStyle}>
				<div ref="menu" className="Select-menu"
						 style={this.props.menuStyle}
						 onScroll={this.handleMenuScroll}
						 onMouseDown={this.handleMouseDownOnMenu}>
					{menu}
				</div>
			</div>
		);
	},

	render () {
		let valueArray = this.getValueArray();
		let options = this._visibleOptions = this.filterOptions(this.props.multi ? valueArray : null);
		let isOpen = this.state.isOpen;
		if (this.props.multi && !options.length && valueArray.length && !this.state.inputValue) isOpen = false;
		let focusedOption = this._focusedOption = this.getFocusableOption(valueArray[0]);
		let className = classNames('Select', this.props.className, {
			'Select--multi': this.props.multi,
			'is-disabled': this.props.disabled,
			'is-focused': this.state.isFocused,
			'is-loading': this.props.isLoading,
			'is-open': isOpen,
			'is-pseudo-focused': this.state.isPseudoFocused,
			'is-searchable': this.props.searchable,
			'has-value': valueArray.length,
		});

		return (
			<div ref="wrapper" className={className} style={this.props.wrapperStyle}>
				{this.renderHiddenField(valueArray)}
				<div ref="control"
						 className="Select-control"
						 style={this.props.style}
						 onKeyDown={this.handleKeyDown}
						 onMouseDown={this.handleMouseDown}
						 onTouchEnd={this.handleTouchEnd}
						 onTouchStart={this.handleTouchStart}
						 onTouchMove={this.handleTouchMove}>
					{this.renderValue(valueArray, isOpen)}
					{this.renderInput(valueArray)}
					{this.renderLoading()}
					{this.renderClear()}
					{this.renderArrow()}
				</div>
				{isOpen ? this.renderOuter(options, !this.props.multi ? valueArray : null, focusedOption) : null}
			</div>
		);
	}

});

export default Select;
