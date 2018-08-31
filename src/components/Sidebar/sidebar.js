import React, { Component } from 'react';
import { Nav, NavItem, NavLink,Label,Input } from 'reactstrap';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const brand_arr=[];

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check_id:[]
        }
        console.log(this.props);
    }
    componentWillMount() {
        console.log(this.props);
        let chck=[];
        if(this.props.brandItems){
            console.log('here1')
            for(let i=0;i<this.props.brandItems.length;i++){
                
                chck[i]=false
            }
            this.setState({
                check_id:[]
            })
            setTimeout(()=>{
                this.setState({
                    check_id:chck
                })
            },100)
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log(this.props);
        let chck=[];
        if(nextProps.brandItems){
            console.log('here')
        for(let i=0;i<this.props.brandItems.length;i++){
            
            chck[i]=false
        }
        this.setState({
            check_id:[]
        })
        setTimeout(()=>{
            this.setState({
                check_id:chck
            })
        },100)
    }
    }
    filterData(i, id) {
        this.setState({ active: i })
        this.props.dataId(id,i)
    }
    sendData(i, id) {
       this.setState({
           checked_state:id
       })
      
        this.props.brandData(id)
    }
    render() {
        return (
            <div style={{ border: '1px solid #dedede' }}>
                <div className="redBar"></div>
                <div className="sidebarMenu">
                    <div className="headerOne">Category</div>
                    <div className="headerTwo" style={{ color: '#d33238' }}>{this.props.category_name}</div>
                    {/* <ul className="sidebarList">
                        <li>Health & Energy Drinks</li>
                        <li>Fruit Drinks & Juices</li>
                        <li>Health & Energy Drinks</li>
                        <li>Fruit Drinks & Juices</li>
                        <li>Health & Energy Drinks</li>
                        <li>Fruit Drinks & Juices</li>
                        <li>Health & Energy Drinks</li>
                        <li>Fruit Drinks & Juices</li>
                    </ul> */}
                    <Nav vertical className="sidebarList">
                        {this.props.menuItems ? this.props.menuItems.map((data, i) => {
                            console.log(data);
                            return (
                                <NavItem key={i} onClick={() => this.filterData(i, data)}>
                                    <NavLink href="#" active={this.state.active === i}>{ReactHtmlParser(data.name)}</NavLink>
                                </NavItem>
                            )
                        }) : ''}

                    </Nav>
                </div>

                <div className="sidebarMenu">
                    <div className="headerOne">Brands</div>
                    {/* <ul className="sidebarList">
                        <li>Health & Energy Drinks</li>
                        <li>Fruit Drinks & Juices</li>
                        <li>Health & Energy Drinks</li>
                        <li>Fruit Drinks & Juices</li>
                        <li>Health & Energy Drinks</li>
                        <li>Fruit Drinks & Juices</li>
                        <li>Health & Energy Drinks</li>
                        <li>Fruit Drinks & Juices</li>
                    </ul> */}
                    <Nav vertical className="sidebarList">
                        {this.props.brandItems ? this.props.brandItems.map((data, i) => {
                            console.log(data);
                            return (
                                <NavItem key={i} onClick={() => this.sendData(i, data.ids.buckets[0].key)}>
                                    <NavLink href="#">
                                        <Label check>
                                            <input type="checkbox" checked={this.state.checked_state == data.ids.buckets[0].key ? true :false}/>{' '}
                                            {data.key}
                                        </Label>
                                    </NavLink>
                                </NavItem>
                            )
                        }) : ''}

                    </Nav>
                </div>
            </div>
        );
    }
}

export default Sidebar;