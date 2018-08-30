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
                                    <img src={this.props.itemData.inner_hits.products.hits.hits[0]._source.image_url} height='100%' width='100%' />
                              </div>
                              <div className="list_desc">
                                    {this.props.itemData.inner_hits.products.hits.hits[0]._source.title} [{this.props.itemData.inner_hits.products.hits.hits[0]._source.variant_type}]
                              </div>
                        </div>
                        <div className="list_price">
                              <div>MRP: ₹{this.props.itemData.inner_hits.products.hits.hits[0]._source.mrp/100}</div>
                              <div>SP: ₹{this.props.itemData.inner_hits.products.hits.hits[0]._source.on_sale === true ? this.props.itemData.inner_hits.products.hits.hits[0]._source.saleprice / 100 : this.props.itemData.inner_hits.products.hits.hits[0]._source.mrp / 100 }</div>
                        </div>
                  </div>
            );
      }
}

export default ListItem;