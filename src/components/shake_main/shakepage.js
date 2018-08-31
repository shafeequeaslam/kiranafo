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
import gifticon from './gift-icon.png';
import couponicon from './coupon-icon.png';
import {Panel, PanelGroup } from 'react-bootstrap';
import './shakepage.css'

class ControlledPanelGroup extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      main: 1, 
      sub: 1
    };
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

redirectTo() {
        window.location.href = "/shake"
    }

  render() {
    return (
      <div>
        <div  style={{ height: this.state.main === 1 ? 'auto' : 50}}>
          <div style={{ height: 50, backgroundColor: '#f5f5f5' }} onClick={() => this.setaccordion(1, "main")}> <div className='faq' >FAQs</div></div>
          <div style={{display: this.state.main === 1 ? '' : 'none'}}>
            <div onClick={() => this.setaccordion(1, "sub")} style={{ height: this.state.sub === 1 ? 'auto' : 50 }}>
              <div style={{ height: 50, backgroundColor: '#fff' }}> 1.What is Shake Shake 11?</div>
              <div className='accordion_sub' style={{ height: 100,display: this.state.sub === 1 ? '' : 'none' }}> Shake Shake 11 is the latest trend taking over the city. It is an interactive feature on the Avenue11 app. All one needs to do is download the app, shake the phone while on the app for 11 seconds and win prizes. The game allows you to win the amazing gifts and also discount coupons which can be redeemed on your grocery shopping. The criteria is simple, you need to shake your phone to win!
If that’s not enough, one lucky winner will get a chance to win Vespa Scooter! So get playing! </div>

            </div>
            <div onClick={() => this.setaccordion(2, "sub")} style={{ height: this.state.sub === 2 ? 'auto' : 50 }}>
              <div style={{ height: 50}}>2. How do I participate in Shake Shake 11?</div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 2 ? '' : 'none' }}> Simply download the app – register yourself and click on Shake Shake 11 icon on the home screen to participate.</div>

            </div>
            <div onClick={() => this.setaccordion(3, "sub")} style={{ height: this.state.sub === 3 ? 'auto' : 50 }}>
              <div style={{ height: 50}}>3. What is the duration of the Shake Shake 11 campaign?</div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 3 ? '' : 'none' }}> The campaign begins from 1st August 2018 and ends on 31st August 2018</div>

            </div>
            <div onClick={() => this.setaccordion(4, "sub")} style={{ height: this.state.sub === 4 ? 'auto' : 50 }}>
              <div style={{ height: 50}}> 4.How many number of times can I participate in the contest?</div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 4 ? '' : 'none' }}> There is no restriction to the number of times you can enter the contest.</div>

            </div>
            <div onClick={() => this.setaccordion(5, "sub")} style={{ height: this.state.sub === 5 ? 'auto' : 50 }}>
              <div style={{ height: 50}}> 5.If I’m a resident living outside of Bangalore can I participate?</div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 5 ? '' : 'none' }}> Unfortunately, the contest is valid only for participants living in in South and East side of Bangalore</div>

            </div>
            <div onClick={() => this.setaccordion(6, "sub")} style={{ height: this.state.sub === 6 ? 'auto' : 50 }}>
              <div style={{ height: 50}}> 6.Is this contest restricted to the areas Avenue 11 servicing?</div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 6? '' : 'none' }}> Yes, this contest is applicable only for shoppers within the servicing area</div>

            </div>
            <div onClick={() => this.setaccordion(7, "sub")} style={{ height: this.state.sub === 7 ? 'auto' : 50 }}>
              <div style={{ height: 50}}> 7.What are the different prizes that I can win?</div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 7? '' : 'none' }}> Every day you have a chance to win exciting prizes like Google Home, Gold coins along with coupons and vouchers from various brands</div>

            </div>
          </div>
        </div>
        <div  style={{ height: this.state.main === 2 ? 'auto' : 50}}>
          <div style={{ height: 50, backgroundColor: '#f5f5f5' ,marginBottom:50}} onClick={() => this.setaccordion(2, "main")}> <div className='faq' >Terms & Conditions</div></div>
          <div style={{display: this.state.main === 2 ? '' : 'none'}}>
          <div onClick={() => this.setaccordion(1, "sub")} style={{ height: this.state.sub === 1 ? 'auto' : 50 }}>
            
            <div style={{ height: 100,fontWeight:'normal', display: this.state.sub === 1 ? '' : 'none' }}> By participating in contest(s), you agree to all the terms and conditions mentioned below.

Terms and Conditions:
For the purposes of these Terms and Conditions, wherever the context so requires "You" or "Your" shall mean any natural person who is a participant in the Contest and “We” or “Our” shall mean Planet 11.

THIS CONTEST IS A PART OF ONE OF THE SHAKE SHAKE 11 PROMOTION.

YOU AGREE THAT BY SUBMIITING OR MAKING AN ENTRY TO THE CONTEST YOU AGREE TO THESE TERMS AND CONDITIONS AS STATED BELOW AND YOU WILL BE BOUND BY THESE TERMS AND CONDITIONS FOR THE COURSE OF YOUR PARTICIPATION IN THE CONTEST.

By entering into this contest you agree that you meet all the eligibility criteria’s as provided under these terms and conditions.

You represent and warrant that you are not in breach of any of the terms and conditions stated herewith.

ELIGIBILITY
The eligibility criteria for entering this contest is as follows:
    a) You should be above the age of 18, in case you are not above the age of 18 you are not eligible
    b) You should be an individual residing and a legal resident of India
    c) You should be using this mobile application in the territory of Bangalore city.
DETAILS OF THE CONTEST & PRIZES:
1. Shake Shake 11 contest starts on 1st August 2018 and ends on 31st August 2018
2. Everyday winners will be decided by the system and posted on social media
3. Only one winner in the entire month will be able to win Vespa Scooter. All gifts and vouchers are allotted by a back-end system. Planet 11 doesn’t have any involvement in winner selection
4. The winners of Alexa, Vespa & Gold Coin will share a valid proof of identity and age in the form of a copy of PAN Card / Driving License / Voter ID / Indian passport. A copy of PAN card is mandatory for any prize worth INR 10,000 or more. The selected participant will automatically forfeit their claim to the Prize if they do not meet the eligibility criteria or do not comply with these terms and conditions. Each Prize will be awarded "AS IS" and WITHOUT WARRANTY OF ANY KIND, express or implied (including, without limitation, any implied warranty of merchantability or fitness for a particular purpose).
ADDITIONAL TERMS
1. Planet 11 may at its own discretion can change, modify, terminate or suspend the contest.
2. Planet 11 is not responsible for any harm that may be caused during the performing or participating in the contest.
3. Planet 11 at its own discretion, disqualify any participant at any time from this contest. 
4. If You use any illegal activities or any robotic, automatic or programmed activities to participate in the contest or to perform the said task or activity to win the contest, Planet 11 has all the rights to disqualify You.
MISCELLANEOUS
1. The contest is governed by the laws of India. In case of any dispute that arises during this contest the courts at Bangalore shall exercise their jurisdiction.
2. You agree that all Our decisions related to the contest shall, at all times, be final and binding on you. Failure by Planet 11 to enforce any of these T&Cs in any instance shall not be deemed to be a waiver of the terms and conditions and shall not give rise to any claim by any person.
LICENSE
1. You hereby grant Planet11 a permission to use Your name, image, videos or any other personally identifiable attributes (attributes) or any other personal attributes which exclusively belong to You. Such attributes may be embedded on an image, video, voice recordings, audio tapes or digital images.
2. You grant Planet11 permission to use Your attributes for promotional activities, advertisements, events or other contests in future. You hereby agree and acknowledge that You will not receive any compensation for such use of your attributes.
LIABILITY RELEASE
You hereby participating in this contest release Planet11 from any liability and agree to defend, hold harmless and indemnify Planet11 and any of its affiliates, employees, directors or agents against any liability or claim for personal injuries (including death), property loss or damage, and misuse of the benefits / prize offered under this contest, in connection with any activity or directly or indirectly, by reason of the acceptance, possession, or participation in the contest.
Other terms and conditions 
1. The promotion “shake shake11” is valid from 01/08/18 to 31/08/2018
2. This promotion is valid only in Bengaluru city only 
3. Shake shake11 promotion is valid only on Avenue11 app. 
4. Shake shake11 promotions is not valid on Avenue.com 
5. Shake shake11 promotion is valid for android & IOS mobile phone users
6. To participate in shake shake11 promotion customer/user must download the Avenue11 app from google play store and should shake his/her phone for minimum 11 secs
7. Planet 11 ecommerce solution India Pvt Ltd will not take any responsibility for damages for customers/user’s mobile phone which would incur while participating in shake shake11 promotions
8. The Customer shall not make any specific demand in respect of brand / make, variation in design, colour, shape or otherwise the physical appearance / technical features in respect of any prizes /gifts offered / own by him / her, under this promotion.
9. Planet 11 ecommerce solution India pvt. Ltd. will not be responsible for any issues related to service, installation and delivery of the prizes issued to the participants.
10. All prizes/gifts are non-negotiable (cannot be exchanged for cash) and non-transferable.
11. The offer is at the sole discretion of Planet11 Ecommerce Solution India Pvt Ltd. Planet11 ecommerce solution India Pvt. Ltd. reserves its right to alter / modify / change any / all the terms and conditions (or) totally withdraw the offer any time during the offer period, without assigning any reason and without any prior notice to the general public / customers.
12. The pictures, visual depiction shown / described in any promotional advertisement / material are only indicative nature and may not be the actual prizes.
13. The decision of Kirana11 /Planet 11 ecommerce solution India Private Limited with regard to the offer / promotion is final and binding on the customers.
14. All Disputes shall be subjected to exclusive jurisdiction of Courts at Bangalore.</div>

          </div>
          
          </div>

        </div>

      </div>
    );
  }
}

class shakepage extends Component {

  constructor(props) {
    super(props);
    this.toggle=this.toggle.bind(this);
    this.state = {
      buttonopen:true
    };
  }

toggle() {
    this.setState(prevState => ({
      buttonopen:!prevState.buttonopen
    }));
  }

  render() {

    return (
      <main style={{ maxWidth: '100vw', overflowX: 'hidden' }}>

        <div >
          <Header />
        </div>

        <div className='shakepage_banners'>
          <div>
        <button onClick={() => this.toggle()} className='button_red floatbutton'>
                My rewards
          </button>

          <div style={{display: this.state.buttonopen===false? 'block' : 'none'}} className='dropmenu'>
            <div onClick={() => this.redirectTo()} className='dropsub'><div style={{margin: 'auto'}}><img  style={{width:"28%"}} src={couponicon} alt="Logo" />Coupons</div></div>
            <div onClick={() => this.redirectTo()} className='dropsub'><div style={{margin: 'auto'}}><img  src={gifticon} alt="Logo" />Gifts</div></div>
          </div>

            <img  src={banner} alt="Logo" />
          </div>
          <div >
            <img  src={content} alt="Logo" />
          </div>
          <div >
            <img  src={content3} alt="Logo" />
          </div>
          <div >
            <img  src={rewards} alt="Logo" />
          </div>
          <div >
            <img src={gifts} alt="Logo" />
          </div>
          <div className='controlled_panel'>
            <ControlledPanelGroup />
          </div>
        </div>



      </main>
    );
  }
}

export default shakepage;