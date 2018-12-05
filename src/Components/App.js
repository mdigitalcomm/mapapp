
import React, { Component } from 'react';
import './App.css';
import { Helmet } from 'react-helmet';
import Filter from './Filter';
import ListStores from './ListStores';
import stores from './stores';

class App extends Component {
	
		state = {
			filter: '',
			stores: [],
			markers: [],
			error: '',
			infowindow: null
		}
		
	componentDidMount() {
		this.getGoogleMaps().then((google) => {
			
			/* Create the map and initiate infowindow */
			let map = this.initMap()
			this.setState({infowindow: new window.google.maps.InfoWindow()})
			/* Display markers of all stores */
			this.addMarkers(stores, map)
		})
	}
	/* Load Google Maps asynchronously */
	getGoogleMaps = () => {
		if (!this.googleMapsPromise) {
			this.googleMapsPromise = new Promise((resolve, reject) => {
				window.resolveGoogleMapsPromise = () => {
					resolve(window.google)
					delete window.resolveGoogleMapsPromise
				}
				const script = document.createElement("script")
				const key = process.env.REACT_APP_GOOGLE_MAPS_KEY
				script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${key}&callback=resolveGoogleMapsPromise`
				script.async = true
				document.body.appendChild(script)
			})
		} 
		return this.googleMapsPromise
	}

	initMap = () => new window.google.maps.Map(document.getElementById('map'), {
			center: {lat: 38.8717767, lng: -77.11730230000001},
			zoom: 12,
			mapTypeId: 'roadmap'
	})

	setFilter = (value) => {
		/*Click filter to show selected locations*/
		let filterValue = new RegExp(value)
		this.setState({filter: value})
		setTimeout(() => {
			let showingStores = stores.filter((store) => filterValue.test(store.state))
			this.setState({stores: showingStores})
		}, 100)
	
	}


	addMarkers = (stores, map) => {
		let markers = []
		let bounds = new window.google.maps.LatLngBounds()
		
		stores.map(store => {			
			let position = new window.google.maps.LatLng(store.lat, store.lng)
			let marker = new window.google.maps.Marker({
				map: map,
				position: position,
				title: store.title,
				address: store.address,
				animation: window.google.maps.Animation.DROP,
			})

			let markerAnimation = () => {
				marker.setAnimation(window.google.maps.Animation.BOUNCE)
				setTimeout(()=> {marker.setAnimation(null)}, 750)
			}

			bounds.extend(marker.position)		

			/*Click marker to show infowindow*/
			marker.addListener('click', () => {				
				this.showInfoWindow(marker)
				markerAnimation()
			})
			markers.push(marker)
			return markers
		})
		/*Center map to show all markers*/
		map.fitBounds(bounds)
		map.panToBounds(bounds)
		setTimeout(() => {
			this.setState({markers})
		}, 100)
	}
	
	showInfoWindow = (marker) => {
		let infowindow = this.state.infowindow
		this.getDetail(marker)
		infowindow.setContent(`<h2 tabindex="0" id="storeTitle">${marker.title}</h2>
			<p className ="store-address">Address: ${marker.address}</p>
			<div tabindex="0" id="storeInfo"></div>
		`)
		/*Click the marker to open the infowindow, click again to close it*/
		infowindow.open(this.initMap, marker)
		infowindow.addListener('closeclick', ()=>{
			infowindow.setMarker = null
		})

	}

	matchMarker = (e) => {
		/** Match markers on the map with the list of stores **/
		/** so that when a name in the list is clicked, **/ 
		/** the infowindow of that store pops up **/
		this.state.markers.map(marker => {
			let markerAnimation = () => {
				marker.setAnimation(window.google.maps.Animation.BOUNCE)
				setTimeout(()=> {marker.setAnimation(null)}, 750)
			}

			if (e.target.innerHTML === marker.title) {
				this.showInfoWindow(marker)
				markerAnimation()
				// Hide list view on small screens
				let toggleButton = document.getElementById("toggle-button")
				if (toggleButton.style.display !== 'none' ) {
					document.getElementById("map").style.zIndex = 0
				}

			} return marker
		})

	}


	getDetail = (store) => {
		/*Get the ID of the venue first*/
		let ll = `${store.getPosition().lat()},${store.getPosition().lng()}`
		let cid = process.env.REACT_APP_FOURSQUARE_CLIENT_ID
		let secret = process.env.REACT_APP_FOURSQUARE_CLIENT_SECRET
		
		fetch(`https://api.foursquare.com/v2/venues/search?ll=${ll}&limit=1&client_id=${cid}&client_secret=${secret}&v=20180527`)
		.then(results => results.json())
		.then(data => {
			let id = data.response.venues[0].id
		/*Get photos of the venue using venue ID fetched above*/
			return fetch(`https://api.foursquare.com/v2/venues/${id}/photos?&client_id=${cid}&client_secret=${secret}&v=20180707`)
		})
		.then(results => results.json())
		.then(data => {
		/*Return the photos of the venue*/
			return data.response.photos.items
		})
		/*Insert photos into the infowindow*/
		.then(photos => {
			this.addDetail(photos)
		})
		.catch(error => this.errorMessage(error))	
	}

	errorMessage = (error) => {
		document.getElementById('storeInfo').textContent = 
		`Sorry, there was a problem getting the photos.
		${error}`
	}

	addDetail = (photos) => {		
		if (photos.length === 0) {
			document.getElementById('storeInfo').textContent = "Sorry, no photo can be found"
		} else {
			/*Add the photos of the venue to infowindow*/
			let htmlContent=''
			let responseContainer = document.getElementById('storeInfo')
			photos.map(photo => {
				/*Get the link of the photo*/
				let link = `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`
				
				return htmlContent=`
						<div class="photo">
							<img src="${link}" alt="photo of store"> 
							<p class="source">Photo source: Foursquare</p>
						</div>
						`
			})
			responseContainer.insertAdjacentHTML('beforeend', htmlContent)
		}		
	}

	render() {

		let listStores = this.state.filter ? this.state.stores : stores
		return (
			<div>
				<Helmet>
					<title>Smithsonian Museums</title>
				</Helmet>
				<div className="left">
					<h1 tabIndex="0">Smithsonian Museums, Galleries, and Zoo</h1>
											
					<Filter 
						title={this.state.filter? this.state.filter: "All Regions" } 							
						onSelect={eventKey => {
							this.setFilter(eventKey)
							setTimeout(() => this.addMarkers(this.state.stores, this.initMap()), 200)
						}} 
					/>
										
					<ListStores 
						listStores={listStores}
						onClick={event => this.matchMarker(event)}													 
					/>													
				</div>
				
				<div ref="map" id="map" role="application">					
				</div>				
			</div>

		)
	}
}

export default App;

// let loadJS = (src) => {
// 		let ref = window.document.getElementsByTagName("script")[0]
// 		let script = window.document.createElement("script")
// 		script.src = src
// 		script.async = true
// 		ref.parentNode.insertBefore(script, ref)
// 	}