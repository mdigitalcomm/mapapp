import React, { Component } from 'react'

class ListBookstores extends Component {

	render() {
		const { onClick, listBookstores } = this.props
		return (
			<ul id="bookstores-list">
				{listBookstores.map(bookstore =>(
					<li key={bookstore.title}> 
						<div tabIndex="0" onKeyUp={onClick} onClick={onClick} className = "bookstore-name">{bookstore.title}</div>
						<div className ="bookstore-address">{bookstore.address}, {bookstore.city}, {bookstore.state}</div>
					</li>
				))}
			</ul>

		)
	}
}

export default ListBookstores;