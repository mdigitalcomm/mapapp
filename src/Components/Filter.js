import React, { Component } from 'react'
import { SplitButton, MenuItem, Button, Glyphicon } from 'react-bootstrap'

class Filter extends Component {
	constructor(props) {
		super(props);
	}

	toggleList = () => {
		let map = document.getElementById("map")
		if (map.style.zIndex==="-1") {
			map.style.zIndex="0"
		} else {
			map.style.zIndex="-1"
		}
		
	}

	render() {
		const { title, onSelect } = this.props
		

		return (
			<div className="search">	
				<SplitButton
					id="filter-button"
					bsSize="large"
					title={title}
					onSelect={onSelect}
				>
					<MenuItem eventKey="">All</MenuItem>
					<MenuItem eventKey="VA">VA</MenuItem>
					<MenuItem eventKey="D.C.">D.C.</MenuItem>
				</SplitButton>

				<Button 
					bsSize="large" 
					id="toggle-button"
					onClick={() => this.toggleList()}
				>
					<Glyphicon glyph="th-list" />
				</Button>


			</div>
		)
}

}

export default Filter