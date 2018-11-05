
import React, { Component } from 'react';
import Filter from './Filter'
import ListBookstores from './ListBookstores'
import bookstores from './bookstores'


class Map extends Component {
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
			// Addd fitbounds method
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
				
				this.showInfoWindow(marker)	
			})
			markers.push(marker)
			return markers
		})
		setTimeout(() => {
			this.setState({markers})
			console.log(markers)
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
			this.infowindow.open(this.map, marker)
			this.infowindow.addListener('closeclick', ()=>{
				this.infowindow.setMarker = null
			})
		}
	}

	matchMarker = (e) => {
		this.state.markers.map(marker => {
			if (e.target.innerHTML === marker.title) {
				this.showInfoWindow(marker)
			} return marker
		})

	}

	getDetail = (bookstore) => {
		
		let ll = `${bookstore.getPosition().lat()},${bookstore.getPosition().lng()}`		
		fetch(`https://api.foursquare.com/v2/venues/search?ll=${ll}&limit=1&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180527`)
		.then(results => results.json())
		.catch(error => error)
		.then(data => {
			console.log(data.response.venues[0])
			let id = data.response.venues[0].id
			console.log(id)
			return fetch(`https://api.foursquare.com/v2/venues/${id}/photos?&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180707`)
		})
		.catch(error => error)		
		.then(results => results.json())
		.then(data => {
		 	console.log(data.response.photos)
			return data.response.photos.items[0]
		})
		.then(photo => this.addDetail(photo))
		.catch(error => error)

	}

	addDetail = (photoinfo) => {
		
		let htmlContent=''
		let responseContainer = document.getElementById('bookstoreInfo')
		let link = `${photoinfo.prefix}${photoinfo.width}x${photoinfo.height}${photoinfo.suffix}`
		console.log(link)
		htmlContent=`
				<div class="photo">
					<img src="${link}" alt="photo of bookstore">
				</div>
				`
		responseContainer.insertAdjacentHTML('afterbegin', htmlContent)
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

export default Map;