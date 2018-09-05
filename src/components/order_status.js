import React, { Component } from 'react';


class Order_Status extends Component {
      constructor(props) {
            super(props);
            this.state = {  };
      }
      componentWillReceiveProps(){
       let url = window.location.href;
        let url_string = url;
        let urlStr = new URL(url_string);
        let status = urlStr.searchParams.get("status");
        console.log(status);
        if(status === "failure"){
              alert('Payment failed, Please try again');
              let order_id=JSON.parse(localStorage.getItem('order_id'))
            // window.location.href='/checkout?order_id='+order_id
        }
      }
      componentWillMount(){
            let url = window.location.href;
             let url_string = url;
             let urlStr = new URL(url_string);
             let status = urlStr.searchParams.get("status");
             console.log(status);
             if(status === "failure"){
                   alert('Payment failed, Please try again');
                   let order_id=JSON.parse(localStorage.getItem('order_id'))
                   window.history.go('/checkout?order_id='+order_id)
             }
           }
      render() {
            return (
                  <div>Checking Status</div>
            );
      }
}

export default Order_Status;