import React, { Component } from 'react'
import { Row, Col } from "react-bootstrap"

export default class Map extends Component {
	componentDidMount() {
		let map = new window.google.maps.Map(document.getElementById('map'), {
			center: {lat: 40.7485722, lng: -74.0068633},
			zoom: 13,
			mapTypeId: 'roadmap'
		});
	}



	render() {
		return (
			<div>
				
				<input type="text" name="address" />
				

				<div id="map">
					Map loading...
				</div>				
			</div>

		)
	}
}