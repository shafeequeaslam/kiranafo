import React, { Component } from 'react';
import classnames from 'classnames'
import '../../App.css';
import { Link } from 'react-router-dom'
import Header from '../../components/Header/header';
import content3 from './3-content.jpg';
import rewards from './4-rewards-.jpg';
import gifts from './5-gifts-and-rewards.jpg';
import banner from './shakeshake-banner.jpg';
import content from './content.jpg';
import { Panel, PanelGroup } from 'react-bootstrap';

class ControlledPanelGroup extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      main: 1, sub: 1
    };
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  setaccordion(id, type) {
   
    this.setState({
      [type]: id
    })
    if(type =="main"){
      this.setState({
        sub:1
      })
  }
  }
  render() {
    return (
      <div>
        <div  style={{ height: this.state.main === 1 ? 'auto' : 50,border:"2px solid" }}>
          <div style={{ height: 50, backgroundColor: '#fff' }} onClick={() => this.setaccordion(1, "main")}> Acc1</div>
          <div style={{display: this.state.main === 1 ? '' : 'none'}}>
            <div onClick={() => this.setaccordion(1, "sub")} style={{ height: this.state.sub === 1 ? 'auto' : 50 }}>
              <div style={{ height: 50, backgroundColor: 'red' }}> 121</div>
              <div style={{ height: 100, display: this.state.sub === 1 ? '' : 'none' }}> Data goes here </div>

            </div>
            <div onClick={() => this.setaccordion(2, "sub")} style={{ height: this.state.sub === 2 ? 'auto' : 50 }}>
              <div style={{ height: 50, backgroundColor: 'red' }}> 121</div>
              <div style={{ height: 100, display: this.state.sub === 2 ? '' : 'none' }}> Data goes here</div>

            </div>
          </div>
        </div>
        <div  style={{ height: this.state.main === 2 ? 'auto' : 50,border:"2px solid"}}>
          <div style={{ height: 50, backgroundColor: '#fff' }} onClick={() => this.setaccordion(2, "main")}> Acc2</div>
          <div style={{display: this.state.main === 2 ? '' : 'none'}}>
          <div onClick={() => this.setaccordion(1, "sub")} style={{ height: this.state.sub === 1 ? 'auto' : 50 }}>
            <div style={{ height: 50, backgroundColor: 'red' }}> 121</div>
            <div style={{ height: 100, display: this.state.sub === 1 ? '' : 'none' }}> Data goes here</div>

          </div>
          <div onClick={() => this.setaccordion(2, "sub")} style={{ height: this.state.sub === 2 ? 'auto' : 50 }}>
            <div style={{ height: 50, backgroundColor: 'red' }}> 121</div>
            <div style={{ height: 100, display: this.state.sub === 2 ? '' : 'none' }}> Data goes here</div>

          </div>
          </div>
        </div>

      </div>
    );
  }
}

class shakepage extends Component {

  render() {

    return (
      <main style={{ maxWidth: '100vw', overflowX: 'hidden' }}>

        <div>
          <Header />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ minHeight: 400, color: '#666' }}>
            <img style={{ maxWidth: '100vw', margin: 'auto' }} src={banner} alt="Logo" />
          </div>
          <div >
            <img style={{ maxWidth: '100vw', margin: 'auto' }} src={content} alt="Logo" />
          </div>
          <div >
            <img style={{ maxWidth: '100vw', margin: 'auto' }} src={content3} alt="Logo" />
          </div>
          <div >
            <img style={{ margin: 'auto' }} src={rewards} alt="Logo" />
          </div>
          <div style={{ maxWidth: '100vw', margin: 'auto' }}>
            <img src={gifts} alt="Logo" />
          </div>
          <div style={{ width: '93%', fontWeight: 'bold', textAlign: 'left', backgroundColor: '#f5f5f5', margin: 'auto', minHeight: 100 }}>
            <ControlledPanelGroup />
          </div>
        </div>



      </main>
    );
  }
}

export default shakepage;