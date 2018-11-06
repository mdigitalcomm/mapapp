import React, { Component } from 'react';
import Markers from './Markers'


export default class Map extends Component {

	state = {
		map: {}
	}

	componentDidMount() {
		/*Create the map*/
		let map = this.map()
		this.setState({ map: map })
	}

	map = () => new window.google.maps.Map(document.getElementById('map'), {
			center: {lat: 38.8717767, lng: -77.11730230000001},
			zoom: 12,
			mapTypeId: 'roadmap'
			// Addd fitbounds method
	})

	render() {
		const { filter, bookstores } = this.props
		return(
			<div id="map">
				<Markers 
					map={this.state.map}
					bookstores={bookstores}
				/>

			</div>
		)
	}
}