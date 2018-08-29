import React, { Component } from 'react';

class ListItem extends Component {
      constructor(props) {
            super(props);
            this.state = {
                  itemData: this.props.itemData
            };

      }
      componentWillMount() {
            console.log(this.props.itemData, "listItems")
      }
      redirectTo(id){
            window.location='/product_desc?product='+id
      }
      render() {
            return (
                  <div className="list_container" onClick={()=>this.redirectTo(this.props.itemData._source.nid)}>
                        <div className="list_data">
                              <div className="list_img">
                                    <img src={this.props.itemData._source.products[0].image_url} height='100%' width='100%' />
                              </div>
                              <div className="list_desc">
                                    {this.props.itemData._source.products[0].title} [{this.props.itemData._source.products[0].variant_type}]
                              </div>
                        </div>
                        <div className="list_price">
                              <div>MRP: ₹{this.props.itemData._source.products[0].mrp/100}</div>
                              <div>SP: ₹{this.props.itemData._source.products[0].on_sale === true ? this.props.itemData._source.products[0].saleprice / 100 : this.props.itemData._source.products[0].mrp / 100 }</div>
                        </div>
                  </div>
            );
      }
}

export default ListItem;