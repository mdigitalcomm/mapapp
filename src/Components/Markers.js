import React, { Component } from 'react';
import Infowindow from './Infowindow'

export default class Markers extends Component {
	state = {
		markers: []
	}

	componentDidMount() {
		setTimeout(() => {
			const { bookstores, map } = this.props
			this.addMarkers(bookstores, map)
		}, 500)
	}

	addMarkers = (bookstores, map) => {
		let markers = []
		bookstores.map(bookstore => {			
			let marker = new window.google.maps.Marker({
				map: map,
				position: new window.google.maps.LatLng(bookstore.lat, bookstore.lng),
				title: bookstore.title,
				address: bookstore.address,
				animation: window.google.maps.Animation.DROP,
			})
			markers.push(marker)
			return markers
		})
		setTimeout(() => {
			this.setState({markers})
		}, 100)
	}


	render() {
		const { bookstores } = this.props
		return(
			<div className="markers">
				{bookstores.map(bookstore => (
					<Infowindow
						key={bookstore.title}
						store={bookstore}
					/>	
				))}
						
			</div>

		)
	}
}