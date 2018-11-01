import React, { Component } from 'react'
import { ButtonToolbar, SplitButton, MenuItem } from 'react-bootstrap'
import InfoWindow from './InfoWindow'

export default class Map extends Component {
	state = {
		filter: '',
		bookstores: [],
		markers: []
	}

	componentDidMount() {		
		/* Create the map */
		let map = this.map()
		/*Showing markers of all bookstores*/
		this.addMarkers(this.bookstores, map)
	}

	map = () => new window.google.maps.Map(document.getElementById('map'), {
			center: {lat: 38.8717767, lng: -77.11730230000001},
			zoom: 12,
			mapTypeId: 'roadmap'
			// Addd fitbounds method
	})

	setFilter = (value) => {
		let filterValue = new RegExp(value)
		this.setState({filter: value})
		setTimeout(() => {
			let showingBookstores = this.bookstores.filter((bookstore) => filterValue.test(bookstore.state))
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
		// htmlContent=`
		// 		<p>${photo}</p>
		// 		`
		// responseContainer.insertAdjacentHTML('afterbegin', htmlContent)
	}

	bookstores = [
			{
				title: "Politics and Prose Bookstore",
				address: "5015 Connecticut Ave NW",
				city: "Washington",
				state: "D.C.",
				lat : 38.955433406841465, 
				lng : -77.06970870494843
			},
			{
				title: "Washington Monument Bookstore",
				address: "Washington Memorial Drwy SW",
				city: "Washington",
				state: "D.C.",
				lat : 38.889276459346284, 
				lng : -77.03189689261164
			},
			{
				title: "George Mason University - Arlington Campus Bookstore",
				address: "3401 Fairfax Dr",
				city: "Arlington",
				state: "VA",
				lat : 38.88743859540963, 
				lng : -77.09402561187744
			},
			{
				title: "Georgetown University Bookstore",
				address: "3800 Reservoir Rd NW",
				city: "Washington",
				state: "D.C.",
				lat : 38.91015334940311, 
				lng : -77.07438111305237
			},
			{
				title: "NOVA Bookstore",
				address: "8333 Little River Tpke",
				city: "Annandale",
				state: "VA",
				lat : 38.83286355537448, 
				lng : -77.23544332092266
			},
			{
				title: "GW Bookstore",
				address: "800 21st St NW",
				city: "Washington",
				state: "D.C.",
				lat : 38.9001324513647, 
				lng : -77.04667624668473
			},
			{
				title: "Marymount University Bookstore",
				address: "2807 N Glebe Rd",
				city: "Arlington",
				state: "VA",
				lat : 38.90485705525619, 
				lng : -77.1271488650243
			},
			{
				title: "DeVry Crystal City Bookstore",
				address: "2450 Crystal Dr",
				city: "Arlington",
				state: "VA",
				lat : 38.85476415, 
				lng : -77.05058921666667
			}

		]

	render() {
		let listBookstores = this.state.filter ? this.state.bookstores : this.bookstores
		return (
			<div>
				<div className="left">
					<h1>Hiking Trails Near Me</h1>
					<div className="search">							
						<ButtonToolbar className="filter">
							<SplitButton 
								bsSize="large" 
								title={this.state.filter? this.state.filter: "All Regions" } 
								id="filter-button" 
								onSelect={eventKey => {
									this.setFilter(eventKey)
									setTimeout(() => this.addMarkers(this.state.bookstores, this.map()), 200)
								}}>
								
								<MenuItem eventKey="">All</MenuItem>
								<MenuItem eventKey="VA">VA</MenuItem>
								<MenuItem eventKey="D.C.">D.C.</MenuItem>
							</SplitButton>
						</ButtonToolbar>
					</div>
					<ul className="bookstores-list">
						{listBookstores.map(bookstore => (
								<li key={bookstore.title}>
									<div onClick={(event) => this.matchMarker(event)} 
										className="bookstore-name">{bookstore.title}</div>
									<div className="bookstore-address">{bookstore.address}</div>
								</li>
							))
						}
						
					</ul>				
				</div>
				<div id="map">
				</div>				
			</div>

		)
	}
}