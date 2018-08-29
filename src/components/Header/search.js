import React, { Component } from 'react';
import ListItem from './listItem';


class SearchResults extends Component {
      constructor(props) {
            super(props);
            this.state = { 
                  dataArray:this.props.dataArray
             };
      }
      componentWillMount(){
            console.log(this.props.dataArray,'1212')
      }
      render() {
            return (
                  <div>
                        {this.props.dataArray ? this.props.dataArray.map((item,index)=>{
                              console.log(item)
                              return(
                              <ListItem itemData={item}/>
                              )
                        }):""}
                        
                  </div>      
            );
      }
}

export default SearchResults;