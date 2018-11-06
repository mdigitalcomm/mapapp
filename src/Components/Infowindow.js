import React, { Component } from 'react';

export default class Infowindow extends Component {
	
	infowindow = () => new window.google.maps.Infowindow()

	render() {
		return(
			<div id="bookstoreInfo">

			</div>
		)
	}
}
