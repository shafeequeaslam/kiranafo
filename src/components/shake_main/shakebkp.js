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
import { Panel,PanelGroup,toggle,collapsible} from 'react-bootstrap';

class shakepage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      activeKey: '1'
    };
  }

  handleSelect(activeKey) {
    this.setState({ activeKey });
  }

  render() {
    return (
      <PanelGroup
        accordion
        id="accordion-controlled-example"
        activeKey={this.state.activeKey}
        onSelect={this.handleSelect}
      >
        <Panel eventKey="1">
          <Panel.Heading>
            <Panel.Title toggle>Panel heading 1</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>Panel content 1</Panel.Body>
        </Panel>
        <Panel eventKey="2">
          <Panel.Heading>
            <Panel.Title toggle>Panel heading 2</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>Panel content 2</Panel.Body>
        </Panel>
      </PanelGroup>
    );
  }
}



export default shakepage;