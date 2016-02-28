import React, { Component, PropTypes } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';

const articles = [
	  {
	    name: 'C',
	    year: 1972
	  },
	  {
	    name: 'C#',
	    year: 2000
	  },
	  {
	    name: 'C++',
	    year: 1983
	  },
	  {
	    name: 'Clojure',
	    year: 2007
	  },
	  {
	    name: 'Elm',
	    year: 2012
	  },
	  {
	    name: 'Go',
	    year: 2009
	  },
	  {
	    name: 'Haskell',
	    year: 1990
	  },
	  {
	    name: 'Java',
	    year: 1995
	  },
	  {
	    name: 'Javascript',
	    year: 1995
	  },
	  {
	    name: 'Perl',
	    year: 1987
	  },
	  {
	    name: 'PHP',
	    year: 1995
	  },
	  {
	    name: 'Python',
	    year: 1991
	  },
	  {
	    name: 'Ruby',
	    year: 1995
	  },
	  {
	    name: 'Scala',
	    year: 2003
	  }
]

function getArticleSuggestions(value) {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;

	return inputLength === 0 ? [] : articles.filter(article =>
		article.name.toLowerCase().slice(0, inputLength) === inputValue
	);
}

function getSuggestionValue(suggestion) {
	return suggestion.name;
}

function renderSuggestion(suggestion) {
	return (
		<span>{suggestion.name}</span>
	);
}

export default class WikiForm extends Component {
	static propTypes = {
		isMobile: PropTypes.bool
	}

	componentDidMount() {
		const { query } = this.props;
		if(query && query.q) {
			this.setState({value: query.q});
		}
	}

	state = {
		value: '',
		articles: getArticleSuggestions('')
	}

	onChange(event, { newValue, method }) {
		this.setState({value: newValue});
	}

	onSuggestionsUpdateRequested({ value }) {
		this.setState({
			articles: getArticleSuggestions(value)
		});
	}

	onSuggestionSelected(event, {suggestion, suggestionValue, method}) {
	}

	handleSubmitLink(event) {
		const { pushState } = this.props;
		const { value } = this.state;
		if(value.length > 0) {
			const articleTitle = value.trim().replace(/ /g, '+')
			pushState(null, `/quiz?q=${articleTitle}`)
			document.getElementById('wiki_input').blur()
		}
	}

	tooltip(text) {
		return (
			<Tooltip id={'wiki_input' + text}><b>{text}</b></Tooltip>
		)
	}

	render() {
		const style = require('./WikiForm.scss');
		const { isMobile, isNotHomeView } = this.props;
		const { value, articles } = this.state;
		const inputProps = {
			type: 'search',
			id: 'wiki_input',
			name: 'q',
			ariaLabel: 'search',
			autoFocus: !isNotHomeView,
			style: {
				height: isNotHomeView ? '38px' : '48px',
				fontSize: isMobile || isNotHomeView ? '16px' : '18px',
				lineHeight: '22px'
			},
			placeholder: isMobile ? 'Search Wikipedia...' : 'Search Wikipedia articles...',
			value,
			onChange: ::this.onChange,
		}
		return (
				<form
					onSubmit={(e, q) => {
						e.preventDefault()
						this.handleSubmitLink()
					}}
					action='/quiz'
					id={style.wiki_form} 
					role="search"
					className="display_flex flex_vertical flex_center">
					<div 
					style={{marginBottom: isNotHomeView ? '0' : '20px', width: isMobile ? '100%' : '605px'}} 
					className={'input_wrapper relative' + ' ' + (isNotHomeView || isMobile ? 'small' : '')}>
						<Autosuggest
							suggestions={articles}
							onSuggestionsUpdateRequested={::this.onSuggestionsUpdateRequested}
		                    getSuggestionValue={getSuggestionValue}
		                    onSuggestionSelected={::this.onSuggestionSelected}
		                    renderSuggestion={renderSuggestion}
		                    inputProps={inputProps}
						/>
						<OverlayTrigger 
							delayShow={500} 
							delayHide={0} 
							placement="bottom" 
							overlay={::this.tooltip('Click to transform Wiki page')}>
							<span 
								style={{
									fontSize: '1.1em',
									top: isMobile && isNotHomeView ? '11px' : ''
								}}
								onClick={() => {
									if(value.length > 0) {
										this.handleSubmitLink()
									} else {
										this.refs.wiki_input.focus()
									}
								}}
								id={style.input_icon}
								className="fa fa-search right">
							</span>
						</OverlayTrigger>
					</div>
					{
						!isMobile && !isNotHomeView
						&&
						<div className="flex_horizontal">
							<button 
								style={{
									marginRight: '10px'
								}}
								type="submit"
								className="button primary_green">
								Transform
							</button>
							<button 
								onClick={() => this.props.openHowItWorks()}
								className="button primary_white">
								How It Works
							</button>
						</div>
					}
				</form>
		);
	}
}
