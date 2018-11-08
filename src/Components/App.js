
import React, { Component } from 'react';
import './App.css';
import Filter from './Filter';
import ListBookstores from './ListBookstores';
import bookstores from './bookstores';


class App extends Component {
	state = {
		filter: '',
		bookstores: [],
		markers: [],
	}

	componentDidMount() {		
		/* Create the map */
		let map = this.map()
		/*Showing markers of all bookstores*/
		this.addMarkers(bookstores, map)
	}

	map = () => new window.google.maps.Map(document.getElementById('map'), {
			center: {lat: 38.8717767, lng: -77.11730230000001},
			zoom: 12,
			mapTypeId: 'roadmap'
			// Addd fitBounds method
	})

	setFilter = (value) => {
		/*Click filter to show selected locations*/
		let filterValue = new RegExp(value)
		this.setState({filter: value})
		setTimeout(() => {
			let showingBookstores = bookstores.filter((bookstore) => filterValue.test(bookstore.state))
			this.setState({bookstores: showingBookstores})
		}, 100)
	
	}


	addMarkers = (bookstores, map) => {
		let markers = []
		let bounds = new window.google.maps.LatLngBounds()
		bookstores.map(bookstore => {			
			let position = new window.google.maps.LatLng(bookstore.lat, bookstore.lng)
			let marker = new window.google.maps.Marker({
				map: map,
				position: position,
				title: bookstore.title,
				address: bookstore.address,
				animation: window.google.maps.Animation.DROP,
			})

			bounds.extend(marker.position)		

			/*Click marker to show infowindow*/
			marker.addListener('click', () => {
				
				this.showInfoWindow(marker)	
			})
			markers.push(marker)
			return markers


		})
		map.fitBounds(bounds)
		
		setTimeout(() => {
			this.setState({markers})
		}, 100)

		
	}

	infowindow = new window.google.maps.InfoWindow()
	
	showInfoWindow = (marker) => {
		if (this.infowindow.marker !== marker) {
			this.infowindow.marker = marker
			this.getDetail(marker)
			this.infowindow.setContent(`<div>${marker.title}</div>
				<div id="bookstoreInfo"></div>
			`)
			/*Click the marker to open the infowindow, click again the close it*/
			this.infowindow.open(this.map, marker)
			this.infowindow.addListener('closeclick', ()=>{
				this.infowindow.setMarker = null
			})
		}
	}

	matchMarker = (e) => {
		/*match markers on the map with the list of bookstores */
		/*so that when a name in the list is clicked, the infowindow of that bookstore pops up*/
		this.state.markers.map(marker => {
			if (e.target.innerHTML === marker.title) {
				this.showInfoWindow(marker)
			} return marker
		})

	}

	getDetail = (bookstore) => {
		/*Get the ID of the venue first*/
		let ll = `${bookstore.getPosition().lat()},${bookstore.getPosition().lng()}`		
		fetch(`https://api.foursquare.com/v2/venues/search?ll=${ll}&limit=1&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180527`)
		.then(results => results.json())
		.catch(error => error)
		.then(data => {
			console.log(data.response.venues[0])
			let id = data.response.venues[0].id
			console.log(id)
		/*Get photos of the venue using venue ID fetched above*/
			return fetch(`https://api.foursquare.com/v2/venues/${id}/photos?&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180707`)
		})
		.catch(error => error)		
		.then(results => results.json())
		.then(data => {
		 	console.log(data.response.photos)
		/*Return the 1st photo of the venue*/
			return data.response.photos.items
		})
		.then(photos => this.addDetail(photos))
		.catch(error => error)

	}

	addDetail = (photos) => {
		/*Add the photos of the venue to infowindow*/
		let htmlContent=''
		let responseContainer = document.getElementById('bookstoreInfo')
		photos.map(photo => {
			/*Get the link of the photo*/
			let link = `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`
			return htmlContent=`
					<div class="photo">
						<img src="${link}" alt="photo of bookstore">
					</div>
					`
		})
		responseContainer.insertAdjacentHTML('beforeend', htmlContent)
		
	}


	render() {

		let listBookstores = this.state.filter ? this.state.bookstores : bookstores
		return (
			<div>
				<div className="left">
					<h1>Bookstores Near Me</h1>
											
					<Filter 
						title={this.state.filter? this.state.filter: "All Regions" } 							
						onSelect={eventKey => {
							this.setFilter(eventKey)
							setTimeout(() => this.addMarkers(this.state.bookstores, this.map()), 200)
						}} 

					/>
										
					<ListBookstores 
						listBookstores={listBookstores}
						onClick={event => this.matchMarker(event)} 							 
					/>						
								
				</div>
				
				<div id="map">
					
				</div>				
			</div>

		)
	}
}

export default App;