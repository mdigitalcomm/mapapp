import React, { Component } from 'react';

class InfoWindow extends Component {

	getDetail = (bookstore) => {
		
		let ll = `${bookstore.getPosition().lat()},${bookstore.getPosition().lng()}`		
		fetch(`https://api.foursquare.com/v2/venues/search?ll=${ll}&limit=1&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180527`)
		.then(results => results.json())
		.catch(error => error)
		.then(data => {
			console.log(data.response.venues[0])
			let id = data.response.venues[0].id
			return fetch(`https://api.foursquare.com/v2/venues/${id}/photos?&client_id=XBM3UHVYGW4PLT2PVS3CUKU2HWLND4DBS4MOUJ4YAOXAOKJI&client_secret=IT2KXHGWS0A2BXQFOTUE2OYTRK10DXH1H43EHXBM3BCPKVUU&v=20180707`)
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
		const { marker } = this.props

		return (
			<div id="bookstoreInfo">

			</div>

		)
	}
}

export default InfoWindow;