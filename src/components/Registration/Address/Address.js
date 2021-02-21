import React from 'react'

class Address extends React.Component {
  constructor(props) {
    super(props)

    this.widget = null
    this.address_line_1 = React.createRef()
    this.address_line_2 = React.createRef()
    this.suburb = React.createRef()
    this.state = React.createRef()
    this.postcode = React.createRef()
  }

  componentDidMount() {
    const script = document.createElement('script')

    script.src = 'https://api.addressfinder.io/assets/v3/widget.js'
    script.async = true
    script.onload = this.loadWidget
    document.body.appendChild(script)
  }

  componentWillUnmount() {
    if (this.widget) {
      this.widget.destroy()
      this.widget = null
    }
  }

    loadWidget = () => {
      const { AddressFinder } = window

      this.widget = new AddressFinder.Widget(
        document.getElementById('address_line_1'),
        process.env.REACT_APP_ADDRESS_KEY,
        'AU',
      )
      this.widget.on('result:select', (fullAddress, metaData) => {
        this.address_line_1.current.value = metaData.address_line_1
        this.address_line_2.current.value = metaData.address_line_2
        this.suburb.current.value = metaData.locality_name
        this.state.current.value = metaData.state_territory
        this.postcode.current.value = metaData.postcode
      })
    }

    render() {
      return (
        <form className="formBox" method="get">
          <div className="formTitle">Shipping Address</div>

          <div className="formHeader">Address Line 1</div>
          <input type="search" id="address_line_1" className="formInput" placeholder="Search address here..." ref={this.address_line_1} />

          <div className="formHeader">Address Line 2</div>
          <input className="formInput" ref={this.address_line_2} />

          <div className="formHeader">Suburb</div>
          <input className="formInput" ref={this.suburb} />

          <div className="formHeader">State</div>
          <input className="formInput" ref={this.state} />

          <div className="formHeader">Postcode</div>
          <input className="formInput" ref={this.postcode} />
        </form>
      )
    }
}

export default Address
