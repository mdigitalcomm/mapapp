import React, { Component } from 'react'

class ListStores extends Component {

	render() {
		const { onClick, listStores } = this.props
		return (
			<ul id="stores-list">
				{listStores.map(store =>(
					<li key={store.title}> 
						<div tabIndex="0" onKeyUp={onClick} onClick={onClick} className = "store-name">{store.title}</div>
						<div className ="store-address">{store.address}, {store.city}, {store.state}</div>
					</li>
				))}
			</ul>

		)
	}
}

export default ListStores;