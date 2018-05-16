import React, { Component } from 'react'

export default class Map extends Component {
	componentDidMount() {
		let map = new window.google.maps.Map(document.getElementById('map'), {
			center: {lat: 40.7485722, lng: -74.0068633},
			zoom: 13,
			mapTypeId: 'roadmap'
		});
	}

	style = {
		height: "500px",
		width: "1000px"	
	}

	render() {
		return (
			<div id="map" style={this.style}>
				loading map...
			</div>

		)
	}
}