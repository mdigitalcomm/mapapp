import React, { Component } from 'react'
import { SplitButton, MenuItem } from 'react-bootstrap'

class Filter extends Component {
	
render() {
	const { title, onSelect } = this.props
	return (
		<div className="search">	
			<SplitButton
				id="filter-button"
				bsSize="large"
				title={title}
				onSelect={onSelect}
				tabindex = "-1"
			>
				<MenuItem eventKey="">All</MenuItem>
				<MenuItem eventKey="VA">VA</MenuItem>
				<MenuItem eventKey="D.C.">D.C.</MenuItem>
			</SplitButton>
		</div>
	)
}

}

export default Filter