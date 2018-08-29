import React, { Component } from 'react';


class giftunreg extends Component {
      render() {
            return (
                  <div>
                      <div className='coupon_container'>
                       <div className='pad10'>
                        <div><h2>Hooray!</h2></div>
                        <div className='coupon_rs'><h4>You've won Activa 4G</h4></div>
                        <div className='shop'>Shop for Rs.2999 to make it yours!</div>
                        <div><h4>Details</h4></div>
                     <div className='details'>
                        <div className='margin'>1. You need to shop for Rs.499/- and above within 24 hours to claim your coupon</div>
                        <div className='margin'>2. The transaction and the order delivery has to be completed succesfully for the user to be eligible for the coupon</div>
                        <div className='margin'>3. If the order is cancelled or modified then coupon will be revoked</div>
                     </div>   
                        <div className='grey_line'></div>
                        
                        <div className='coupon_expires'>Gift expires in 5:00 HRS</div>
                        <div className='button_container'>
                        <button className="button_red" style={{borderRadius:'0px', width: '30%' }}>OK</button></div>
                       </div>
                      </div>
              </div>
            );
      }
}

export default giftunreg;