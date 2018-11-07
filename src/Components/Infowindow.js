import React, { Component } from 'react';

export default class Infowindow extends Component {
	
 	infowindow = () => new window.google.maps.Infowindow()

	showInfoWindow = (marker) => {
		const { map } = this.props
		if (this.infowindow.marker !== marker) {
			this.infowindow.marker = marker
			this.getDetail(marker)
			this.infowindow.setContent(`<div>${marker.title}</div>
				<div id="bookstoreInfo"></div>
			`)
			/*Click the marker to open the infowindow, click again the close it*/
			this.infowindow.open(map, marker)
			this.infowindow.addListener('closeclick', ()=>{
				this.infowindow.setMarker = null
			})
		}
	}

	getDetail = (bookstore) => {
		/*Get the ID of the venue first*/
		let ll = `${bookstore.getPosition().lat()},${bookstore.getPosition().lng()}`		
		fetch(`https://api.foursquare.com/v2/venues/search?ll=${ll}&limit=1&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180527`)
		.then(results => results.json())
		.catch(error => error)
		.then(data => {
			let id = data.response.venues[0].id
		/*Get photos of the venue using venue ID fetched above*/
			return fetch(`https://api.foursquare.com/v2/venues/${id}/photos?&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180707`)
		})
		.catch(error => error)		
		.then(results => results.json())
		.then(data => {
		/*Return the photos of the venue*/
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
		const { clickedMarker } = this.props
		return(
			<div id="infoWindow">
			</div>
		)
	}
}
