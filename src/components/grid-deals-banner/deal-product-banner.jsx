import React, { Component } from 'react';
import { Container, Row, Col} from 'reactstrap';
import propTypes from 'prop-types';
import ThreeGridBanner from './3-grid-banner';
import FourGridHorizontalBanner from './4-grid-horizontal-banner';
import FourGridLeftFullBanner from './4-grid-left-full-banner';
import FourGridRightFullBanner from './4-grid-right-full-banner';
import FiveGridBanner from './5-grid-banner';
import Axios from 'axios';

class DealProductBanner extends Component {
    constructor(props){
       
        super(props);
         console.log(this.props,"deal_test")
        this.state={
                dealproductbanneritems : []
        
        }
    }
    componentWillMount(){
        if(this.props.api_type){
            Axios(this.props.api_type + '&sort=asc&mode=min', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then((data) => {
                    console.log(data.data);
                    this.setState({
                        dealproductbanneritems: data.data
                    })
                })
                .catch((err) => {
                    //console.log(err)
                })
            }
    }

   
    render() {
     
        if(this.props.isLoading){
            return <p className="loading">Loading...</p>
        }

        let deals_layout;
        if(this.state.dealproductbanneritems.length > 0){
            console.log(this.state.dealproductbanneritems)
           deals_layout = this.state.dealproductbanneritems[0]._source.deals_layout;
        }
        

        let grid_banner;

        if(deals_layout == '3 Grid banner'){
            console.log('here 3')
            grid_banner = <ThreeGridBanner bannerData = {this.state.dealproductbanneritems} />;
        } else if(deals_layout == '4 Grid Horizontal banner'){
            console.log('here 4')
            grid_banner = <FourGridHorizontalBanner bannerData = {this.state.dealproductbanneritems} />;
        } else if(deals_layout == '4 Grid Left banner full'){
            grid_banner = <FourGridLeftFullBanner bannerData = {this.state.dealproductbanneritems}  />;
        } else if(deals_layout == '4 Grid Right banner full'){
            grid_banner = <FourGridRightFullBanner bannerData = {this.state.dealproductbanneritems} />;
        } else if(deals_layout == '5 Grid Left banner full'){
            grid_banner = <FiveGridBanner bannerData = {this.state.dealproductbanneritems} />;
        }

    
        return (
            <Container className="deals-banner-container">
                <Row>
                    <h2>SUPER-DUPER STEALS</h2>
                </Row>
                <Row>
                    {grid_banner}
                </Row>
            </Container>
        );
    }
}

 

export default DealProductBanner;
