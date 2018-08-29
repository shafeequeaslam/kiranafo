import React, { Component } from 'react';

class giftreg extends Component {
      render() {
            return (
                 <div>
                      <div className='coupon_container1'>
                       <div className='pad10'>
                        <div><h2>Hooray!</h2></div>
                        <div className='coupon_rs'><h4>You've won Activa 5G</h4></div>
                        <div style={{ color:'green'}}><h5>Yay!Your Reward is Confirmed</h5></div>
                      <div><h4>Details</h4></div>
                      <div className='details'>
                        <div className='margin'>1. Thank you for registering your reward.It will be available for collection after 15th September 2018</div>
                        <div className='margin'>2. The transaction and the order delivery has to be completed succesfully for the user to be eligible for the coupon</div>
                        <div className='margin'>3. If the order is cancelled or modified then coupon will be revoked</div>
                     </div>   
                       <div className='grey_line'></div>
                       <div className='registered'><h5>Registered</h5></div>
                       <div className='coupon_container1'>
                       <button className="button_red button_square">OK</button></div>
                       </div>
                       </div>
                 </div>
            );
      }
}

export default giftreg;