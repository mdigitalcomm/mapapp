import React, { Component } from 'react';
import Infowindow from './Infowindow'

export default class Markers extends Component {
	state = {
		markers: [],
		infowindowStatus: false,
		clickedMarker:{}
	}

	componentDidMount() {
		setTimeout(() => {
			const { bookstores, map } = this.props
			console.log(bookstores)
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

			/*Click marker to show infowindow*/
			marker.addListener('click', () => {
				this.setState({clickedMarker: marker})
				this.setState({infowindowStatus: true})
				console.log(this.state.clickedMarker)
			})

			markers.push(marker)
			return markers


		})
		setTimeout(() => {
			this.setState({markers})
			console.log(markers)
		}, 100)

	}


	render() {
		const { bookstores, map } = this.props
		return(
			<div className="markers">
				{bookstores.map(bookstore => (
					<Infowindow
						key={bookstore.title}
						map = {map}
						clickedMarker={this.state.clickedMarker}
						infowindowStatus={this.state.infowindowStatus}

					/>	
				))}
						
			</div>

		)
	}
}