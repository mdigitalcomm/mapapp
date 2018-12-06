import React, { Component } from 'react'
import { SplitButton, MenuItem, Button, Glyphicon } from 'react-bootstrap'

class Filter extends Component {

	toggleList = () => {
		let map = document.getElementById("map")
		if (map.style.zIndex==="-1") {
			map.style.zIndex="0"
		} else {
			map.style.zIndex="-1"
		}
		
	}

	// componentDidUpdate(prevProps) {
	// 	console.log(this.props.onSelect）
	// 	console.log(prevProps.onSelect）
	// 	if (this.props.onSelect !== prevProps.onSelect) {
			
	// // 		// const key = process.env.REACT_APP_GOOGLE_MAPS_KEY
	// // 		// window.initMap = this.initMap
	// // 		// this.loadJS(`https://maps.googleapis.com/maps/api/js?libraries=places&key=${key}&callback=initMap`)
	// 	}
	// }

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
					<MenuItem eventKey="D.C.">D.C.</MenuItem>
					<MenuItem eventKey="VA">VA</MenuItem>
					<MenuItem eventKey="NY">NY</MenuItem>
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

export default Filter;