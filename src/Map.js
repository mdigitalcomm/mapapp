import React, { Component } from 'react'

export default class Map extends Component {
	componentDidMount() {
		/* Create the map */
		let map = new window.google.maps.Map(document.getElementById('map'), {
			center: {lat: 38.8717767, lng: -77.11730230000001},
			zoom: 12,
			mapTypeId: 'roadmap'
		})

		/*Create markers*/
		let markers = []
		this.parks.map(park => {			
			let marker = new window.google.maps.Marker({
				map: map,
				position: park.location,
				title: park.title,
				animation: window.google.maps.Animation.DROP,
			})
			markers.push(marker)
			
			/*Click marker to show infowindow*/
			marker.addListener('click', () => {
				let infowindow = new window.google.maps.InfoWindow()
				if (infowindow.marker !== marker) {
					infowindow.marker = marker
					infowindow.setContent(`<div>${marker.title}</div>`)
					infowindow.open(this.map, marker)
					infowindow.addListener('closeclick', ()=>{
						infowindow.setMarker = null
					})
				}
			})
			return markers 
		})
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
		return (
			<div>
				<div className="left">
					<h2>Hiking Trails</h2>
					<input type="text" name="address" />
					<ul>
						{this.parks.map(park => (
							<li >{park.title}</li>
						))}
					</ul>				
				</div>
				<div id="map">
					Map loading...
				</div>				
			</div>

		)
	}
}