import React, { Component } from 'react';

class couponexpired extends Component {
      render() {
            return (
                  <div className='couponused_container'>
                      <div className='couponused_background'>
                        <div><h2>Hey!</h2></div>
                        <div className='couponused_text1'>This coupon is expired</div>
                        <div className='couponused_text2'>Shake your phone now!</div>
                        <div className='button_container'>
                        <button className="button_red button_width button_square">OK</button></div>
                      </div>
                  </div>
            );
      }
}

export default couponexpired;