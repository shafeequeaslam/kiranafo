import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import withRouter from 'react-router/withRouter';
import './couponactive.css';

class couponactive extends Component {
      
      render() {
            return (
                  <div>
                      <div className='coupon_container1'>
                       <div className='pad10'>
                        <div><h2>Hooray!</h2></div>
                        <div className='coupon_rs'><h4>You've won Rs.80</h4></div>
                        <div className='shop'>Shop for Rs.599 to redeem</div>
                        <div className='use_code'>
                          <div className='use_code_use'>USE CODE:
                             <div className='use_code_code'>A11SS55</div>
                            </div>
                          </div>
                        <div><h4>Details</h4></div>
                     <div className='details'>
                        <div className='margin'>1. You need to shop for Rs.499/- and above within 24 hours to claim your coupon</div>
                        <div className='margin'>2. The transaction and the order delivery has to be completed succesfully for the user to be eligible for the coupon</div>
                        <div className='margin'>3. If the order is cancelled or modified then coupon will be revoked</div>
                     </div>   
                        <div className='grey_line'></div>
                        
                        <div className='coupon_expires'>Coupon Expires in : <div>5:00 HRS</div></div>
                        <div className='button_container'>
                        <button className="button_red button_square">OK</button>
                        </div>
                       </div>


                      </div>
                        </div>
            );
      }
}

export default couponactive;