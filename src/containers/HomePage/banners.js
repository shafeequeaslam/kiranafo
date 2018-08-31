import React, { Component } from 'react';
import Axios from 'axios';

import './home.css'

class HomePageBanners extends Component {
      constructor(props) {
            super(props);
            this.state = {};
      }
      componentWillMount() {
         
      }
      render() {
            return (
                              <div className="heroContainer" onClick={()=>this.props.bannerData(this.props.data._source.banners)}>
                                    <img src={this.props.data._source.banners.web_banner_path} max-width="100%" width='100%' height='100%' />
                                   
                              </div>
                 
            );
      }
}

export default HomePageBanners;