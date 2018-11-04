import { Component } from 'react';

export default class Map extends Component {
	state = {
		markers: []
	}
	

	componentDidMount() {
		/* Create the map */
		let map = this.map()
		/*Showing markers of all bookstores*/
		let bookstores = this.props.listBookstores
		this.addMarkers(bookstores, map)
	}


	componentWillReceiveProps(nextProps) {
		const { listBookstores, refresh } = this.props
		let map = this.map()
		// console.log(refresh)
		// console.log(nextProps.refresh)
		if (nextProps.refresh == refresh) {
			this.addMarkers(nextProps.listBookstores, map)
		}
	}

	map = () => new window.google.maps.Map(document.getElementById('map'), {
			center: {lat: 38.8717767, lng: -77.11730230000001},
			zoom: 12,
			mapTypeId: 'roadmap'
			// Addd fitbounds method
	})

	addMarkers = (bookstores, map) => {
		/*Create markers for bookstores*/
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

	showInfoWindow = (marker) => {
		let infowindow = new window.google.maps.InfoWindow()
		if (infowindow.marker !== marker) {
			infowindow.marker = marker
			this.getDetail(marker)
			infowindow.setContent(`<div>${marker.title}</div>
				<div id="bookstoreInfo"><div>`)
			infowindow.open(this.map, marker)
			infowindow.addListener('closeclick', ()=>{
				infowindow.setMarker = null
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
			return fetch(`https://api.foursquare.com/v2/venues/${id}/photos?&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180707`)
			// return fetch(`https://api.foursquare.com/v2/venues/${id}?&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180707`)
		})		
		.then(results => results.json())
		.then(data => {
		 	console.log(data.response.photos)
			return data.response.photos.items[0]
		})
		.then(photo => this.addDetail(photo))

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
		return null
	}
}
