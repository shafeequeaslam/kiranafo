import React, { Component } from 'react';
import Axios from 'axios';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Header from '../Header/header';
import AccSidebar_Footer from '../Sidebar/acc_side_2';


class AboutUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            html: ''
        };
    }
    componentDidMount() {
        Axios('https://cms.avenue11.com/kirana11_api/node/26.json', {
            method: 'GET',
            headers: {
            }
        })
            .then((res) => {
                this.setState({
                    html: res.data.body.und[0].value
                })
            })
            .catch((err) => {
                console.log(err)
            })
        console.log(this.state.html)

    }


    render() {
        return (
            <main>
                <div>
                    <Header />
                </div>
                <div style={{ display: 'flex', width: '90%', margin: '50px auto' }}>
                    <div className="col-sm-3" style={{ padding: 0 }}>
                        <AccSidebar_Footer activeType={0} />
                    </div>

                    <div className="col-sm-9" style={{border:'1px solid #d4d4d4',padding:10,minHeight:500}}>

                        <div>{ReactHtmlParser(this.state.html)}</div>
                    </div>
                </div>
            </main>
        );
    }
}

export default AboutUs;