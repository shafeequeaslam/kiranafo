import React, { Component } from 'react';
import { Nav, NavItem, NavLink, Label, Input } from 'reactstrap';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const brand_arr = [];

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check_id: []
        }
        console.log(this.props);
    }
    componentWillMount() {
        console.log(this.props);
        let chck = [];
        if (this.props.brandItems) {
            console.log('here1')
            for (let i = 0; i < this.props.brandItems.length; i++) {

                chck[i] = false
            }
            this.setState({
                check_id: []
            })
            setTimeout(() => {
                this.setState({
                    check_id: chck
                })
            }, 100)
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        let chck = [];
        if (nextProps.brandItems) {
            console.log('here')
            for (let i = 0; i < this.props.brandItems.length; i++) {

                chck[i] = false
            }
            this.setState({
                check_id: []
            })
            setTimeout(() => {
                this.setState({
                    check_id: chck
                })
            }, 100)
        }
    }
    filterData(i, id) {
        this.setState({ active: i })
        this.props.dataId(id, i)
    }
    sendData(i, id) {
        if (this.state.checked_state != id) {
            this.setState({
                checked_state: id
            })
            this.props.brandData(id)

        }
        else{
            this.setState({
                checked_state: undefined
            })
        this.props.brandData(undefined)
        }
    }
    search(e){
        let searchText=e.target.value;
        console.log(searchText)
        let suggestions = [];
        let choices= this.props.brandItems;
        console.log(this.props.brandItems)
        for (let i=0;i<choices.length;i++){
            if (choices[i].key.toUpperCase().indexOf(searchText.toUpperCase())!= -1 ) 
            suggestions.push(choices[i]);
        }
        console.log(suggestions);
        setTimeout(()=>{
                this.setState({
                    searchItems:suggestions
                })
        },200)
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
                    <div className="headerOne" style={{display:this.props.brandItems ? '':'none'}}>Brands</div>
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
                    <div style={{display:this.props.brandItems ? '':'none'}}>
                        <input type="text" onChange={(e)=>this.search(e)} />
                    </div>
                    <Nav vertical className="sidebarList" style={{display:this.state.searchItems ? '':'none'}}>
                        {this.state.searchItems ? this.state.searchItems.map((data, i) => {
                            console.log(data);
                            return (
                                <NavItem key={i} onClick={() => this.sendData(i, data.ids.buckets[0].key)}>
                                    <NavLink href="#">
                                        <Label check>
                                            <input type="checkbox" checked={this.state.checked_state == data.ids.buckets[0].key ? true : false} />{' '}
                                            {data.key}
                                        </Label>
                                    </NavLink>
                                </NavItem>
                            )
                        }) : ''}

                    </Nav>
                    <Nav vertical className="sidebarList" style={{display:this.state.searchItems ? 'none':''}}>
                        {this.props.brandItems ? this.props.brandItems.map((data, i) => {
                            return (
                                <NavItem key={i} onClick={() => this.sendData(i, data.ids.buckets[0].key)}>
                                    <NavLink href="#">
                                        <Label check>
                                            <input type="checkbox" checked={this.state.checked_state == data.ids.buckets[0].key ? true : false} />{' '}
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