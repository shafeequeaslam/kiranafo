import React, { Component } from 'react';


class Order_Status extends Component {
      constructor(props) {
            super(props);
            this.state = {  };
      }
      componentDidMount(){
       let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let status = urlStr.searchParams.get("status");
        console.log(status)
      }
      render() {
            return (
                  <div>Checking Status</div>
            );
      }
}

export default Order_Status;