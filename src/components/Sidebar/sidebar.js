import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';


class Sidebar extends Component {
    constructor(props){
        super(props);
        this.state={
            active: 0
                }
    }
    componentWillMount(){
       
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
                        { this.props.menuItems.map((data,i) => {
                            return(
                            <NavItem key={i} onClick={()=>this.setState({active:i})}>
                                <NavLink href="#" active={this.state.active === i }>{data.name}</NavLink>
                            </NavItem>
                            )
                        })}

                    </Nav>
                </div>
            </div>
        );
    }
}

export default Sidebar;