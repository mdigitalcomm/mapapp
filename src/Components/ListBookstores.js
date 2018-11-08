import React, { Component } from 'react'

class ListBookstores extends Component {

	render() {
		const { onClick, listBookstores } = this.props
		return (
			<ul className="bookstores-list">
				{listBookstores.map(bookstore =>(
					<li tabindex="0" key={bookstore.title} onClick={onClick}> 
						<div className = "bookstore-name">{bookstore.title}</div>
						<div className = "bookstore-address">{bookstore.address}, {bookstore.city}, {bookstore.state}</div>
					</li>
				))}
			</ul>

		)
	}
}

export default ListBookstores;