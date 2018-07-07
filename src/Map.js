import React, { Component } from 'react'
import { ButtonToolbar, SplitButton, MenuItem } from 'react-bootstrap'
import InfoWindow from './InfoWindow'

export default class Map extends Component {
	state = {
		filter: '',
		parks: [],
		markers: []
	}

	componentDidMount() {		
		/* Create the map */
		let map = this.map()
		/*Showing markers of all parks*/
		this.addMarkers(this.parks, map)
	}

	map = () => new window.google.maps.Map(document.getElementById('map'), {
			center: {lat: 38.8717767, lng: -77.11730230000001},
			zoom: 12,
			mapTypeId: 'roadmap'
	})

	setFilter = (value) => {
		let filterValue = new RegExp(value)
		this.setState({filter: value})
		setTimeout(() => {
			let showingParks = this.parks.filter((park) => filterValue.test(park.address))
			this.setState({parks: showingParks})
		}, 100)
	
	}

	addMarkers = (parks, map) => {
		let markers = []
		parks.map(park => {			
			let marker = new window.google.maps.Marker({
				map: map,
				position: park.location,
				title: park.title,
				address: park.address,
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
			this.getPhoto(marker)
			infowindow.setContent(`<div>${marker.title}</div>
				<div id="parkPhoto"><div>`)
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

	getPhoto = (park) => {
		fetch('https://api.yelp.com/v3/businesses/search?term=${park.title}&location={park.address}', {
			headers: {
				'API_KEY': 'S6YR7w2iVj535AtFP_dyltabDdPPqjAFONm86pacxD9DozOhy8FnY5-mRRXlTl7XWDPNPb25793dp0twHaBE9Abbg3_twXNcg31yGIrb3yk_ZrBZOYGrgIrzQNVAW3Yx'
			}
		}).then(response => console.log(response.json()))
		// fetch(`https://api.foursquare.com/v2/venues/search?near=${park.address}&query=${park.title}&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180527`)
		// .then(response => console.log(response.json()))
		// // .then(data => console.log(data.response.venues))
	}

	addPhoto = (data) => {
		let htmlContent=''
		let responseContainer = document.getElementById('parkPhoto')
		const firstImage = data.results[0]
		if(firstImage) {
			htmlContent=`
				<img src="${firstImage.urls.small}" alt="name" style="width: 400px; height: 300px">
				`
		} else {
			htmlContent = 'No image available'
		}
		responseContainer.insertAdjacentHTML('afterbegin', htmlContent)
	}

	parks = [
			{
				title: "Potomac Overlook Regional Park",
				address: "2845 Marcey Rd, Arlington, VA 22207",
				location : {lat : 38.913048, lng : -77.1078129 }
			},
			{
				title: "Dora Kelley Nature Park",
				address: "5750 Sanger Ave, Alexandria, VA 22311",
				location : {lat : 38.8283123, lng : -77.13097259999999}
			},
			{
				title: "Windy Run Park",
				address: "2420 N Kenmore St, Arlington, VA 22207",
				location : {lat : 38.9037858, lng : -77.09773679999999}
			},
			{
				title: "Mount Vernon Trail",
				address: "1198 George Washington Memorial Pkwy, Alexandria, VA 22314",
				location : {lat : 38.7930927, lng : -77.04951439999999}
			},
			{
				title: "Cavalier Trail Park",
				address: "600 S Maple Ave, Falls Church, VA 22046",
				location : {lat : 38.8793574, lng : -77.17916049999999}
			},
			{
				title: "Lake Accotink Park",
				address: "7500 Accotink Park Rd, Springfield, VA 22150",
				location : {lat : 38.7938813, lng : -77.2151542}
			},
			{
				title: "Holmes Run Stream Valley Park",
				address: "3437 Charleson St, Annandale, VA 22003",
				location : {lat : 38.8497181, lng : -77.19405309999999}
			},
			{
				title: "Lucky Run Park",
				address: "2620 S Walter Reed Dr, Arlington, VA 22206",
				location : {lat : 38.8425555, lng : -77.10437329999999}
			}

		]

	render() {
		let listParks = this.state.filter ? this.state.parks : this.parks
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
									setTimeout(() => this.addMarkers(this.state.parks, this.map()), 200)
								}}>
								
								<MenuItem eventKey="">All</MenuItem>
								<MenuItem eventKey="Arlington">Arlington</MenuItem>
								<MenuItem eventKey="Alexandria">Alexandria</MenuItem>
								<MenuItem eventKey="Annandale">Annandale</MenuItem>
								<MenuItem eventKey="Falls Church">Falls Church</MenuItem>
								<MenuItem eventKey="Springfield">Springfield</MenuItem>
							</SplitButton>
						</ButtonToolbar>
					</div>
					<ul className="parks-list">
						{listParks.map(park => (
								<li key={park.title}>
									<div onClick={(event) => this.matchMarker(event)} 
										className="park-name">{park.title}</div>
									<div className="park-address">{park.address}</div>
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