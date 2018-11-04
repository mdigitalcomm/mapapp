import React, { Component } from 'react'
import { ButtonToolbar, SplitButton, MenuItem } from 'react-bootstrap'
import Map from './Map'
import InfoWindow from './InfoWindow'

export default class List extends Component {
	state = {
		filter: '',
		bookstores: [],
		mapStatus: true,
		markerStatus: true
	}

	setFilter = (value) => {
		let filterValue = new RegExp(value)
		this.setState({filter: value})
		
		setTimeout(() => {
			let showingBookstores = this.bookstores.filter((bookstore) => filterValue.test(bookstore.state))
			this.setState({bookstores: showingBookstores})
		}, 100)
		
	
	}

	refreshMap = () => {
		this.setState({mapStatus: !this.state.mapStatus})
	}

	refreshMarker = () => {
		this.setState({markerStatus: !this.state.markerStatus})
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
		let mapStatus = this.state.mapStatus
		return (
			<div>
				<div className="left">
					<h1>Bookstores Near Me</h1>
					<div className="search">							
						<ButtonToolbar className="filter">
							<SplitButton 
								bsSize="large" 
								title={this.state.filter? this.state.filter: "All Regions" } 
								id="filter-button" 
								onSelect={eventKey => {
									this.setFilter(eventKey)
									this.refreshMap()
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
									<div onClick={() => this.refreshMarker()} 
										className="bookstore-name">{bookstore.title}</div>
									<div className="bookstore-address">{bookstore.address}</div>
								</li>
							))
						}
						
					</ul>				
				</div>
				<div>
					<Map 
						listBookstores={listBookstores}
						refresh = {mapStatus}
					/>		
				</div>
						
			</div>

		)
	}
}