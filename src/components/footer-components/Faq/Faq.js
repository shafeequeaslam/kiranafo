import React, { Component } from 'react';
import './Faq.css'

class Faq extends React.Component {
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
  render() {
    return (
      <div>
        <div  style={{ height: this.state.main === 1 ? 'auto' : 50}}>
          <div style={{ height: 50, backgroundColor: '#f5f5f5' }} onClick={() => this.setaccordion(1, "main")}> <div className='faq' >FAQs</div></div>
          <div style={{display: this.state.main === 1 ? '' : 'none'}}>
            <div onClick={() => this.setaccordion(1, "sub")} className='faq_sub' style={{ height: this.state.sub === 1 ? 'auto' : 50 }}>
              <div className='faq_title'><div> What cities and locations do you operate in?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100,display: this.state.sub === 1 ? '' : 'none' }}>Avenue11 currently operates in Bengaluru.</div>

            </div>
            <div onClick={() => this.setaccordion(2, "sub")} className='faq_sub' style={{ height: this.state.sub === 2 ? 'auto' : 50 }}>
              <div className='faq_title'><div>Do you deliver to my location?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 2 ? '' : 'none' }}>We deliver in selected localities across the cities we are present in. You can edit your location settings to check if we deliver in your area.</div>

            </div>
            <div onClick={() => this.setaccordion(3, "sub")} className='faq_sub' style={{ height: this.state.sub === 3 ? 'auto' : 50 }}>
              <div className='faq_title'><div>What is the minimum order value?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 3 ? '' : 'none' }}>The minimum order value is Rs. 499/-.</div>

            </div>
            <div onClick={() => this.setaccordion(4, "sub")} className='faq_sub' style={{ height: this.state.sub === 4 ? 'auto' : 50 }}>
              <div className='faq_title'><div> How to apply Discount Coupon?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 4 ? '' : 'none' }}> A user can apply discount coupon from the Payment page. We allow only one coupon usage per delivery. A user can view the money saved by coupon discount on the bottom section of the Avenue11 App.</div>

            </div>
            <div onClick={() => this.setaccordion(5, "sub")} className='faq_sub' style={{ height: this.state.sub === 5 ? 'auto' : 50 }}>
              <div className='faq_title'><div> Do you charge any amount or taxes over and above the rates shown?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 5 ? '' : 'none' }}>No, we do not charge anything over and above the rates shown.</div>

            </div>
            <div onClick={() => this.setaccordion(6, "sub")} className='faq_sub' style={{ height: this.state.sub === 6 ? 'auto' : 50 }}>
              <div className='faq_title'><div>How can I make changes to my order before and after confirmation?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 6? '' : 'none' }}>You can edit your order in the cart before checkout. If you’ve already placed your order, you can cancel and reorder with the required list from the website or call us on our toll-free number.</div>

            </div>
            <div onClick={() => this.setaccordion(7, "sub")} className='faq_sub' style={{ height: this.state.sub === 7 ? 'auto' : 50 }}>
              <div className='faq_title'><div> How do I get a refund?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 7? '' : 'none' }}><div class="panel-body">
             <p>Customer needs to call our toll-free number 1800-123-0110 for any refund related issues.</p>
           <ul>
             <li>If The payment is made by CASH, the refund will be made to your Paytm wallet or bank account.</li>
             <li>Alternatively, if the payment has been made online, one can get an online refund to your account. Refund to your account takes around 7-10 business days to reflect in your account.</li>
           </ul>
         </div>
    </div>
   
        <div onClick={() => this.setaccordion(8, "sub")} className='faq_sub' style={{ height: this.state.sub === 8 ? 'auto' : 50 }}>
            <div className='faq_title'><div>What If I want to return something?</div><div>+</div></div>
            <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 8? '' : 'none' }}>
            <p>If you’re dissatisfied with the products delivered, You will have to return the below items immediately and send it back with the delivery boy.</p>

            <p>Dairy Products (Milk/Curd etc.)</p>

            <p>Fruits and Vegetables</p>

            <p>Meat and Seafood</p>

            <p>For other products, please register a complaint by calling us within 48 hours. Our customer support team will get in touch with you to resolve this issue.</p></div>
        </div>



            <div onClick={() => this.setaccordion(9, "sub")} className='faq_sub' style={{ height: this.state.sub === 9 ? 'auto' : 50 }}>
              <div className='faq_title'><div> How can I review my receipt?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 9? '' : 'none' }}>We will send it to you on your email address. Also, you can look at your transaction history in the My Orders tab on the app.</div>

            </div>

            <div onClick={() => this.setaccordion(10, "sub")} className='faq_sub' style={{ height: this.state.sub === 10 ? 'auto' : 50 }}>
              <div className='faq_title'><div> What if I don’t receive my order by the scheduled time?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 10? '' : 'none' }}>On rare occasions, due to unforeseen circumstances, your order might be delayed. In case of imminent delay, our customer support executive will keep you updated about the delivery time of your order. We will work with you to make sure you are not inconvenienced as a result of the delay.</div>

            </div>

            <div onClick={() => this.setaccordion(11, "sub")} className='faq_sub' style={{ height: this.state.sub === 11 ? 'auto' : 50 }}>
              <div className='faq_title'><div> Can I change the delivery address of my order?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 11? '' : 'none' }}>Now, we do not offer this option. You can, however, cancel your order and reorder in a different locality.</div>

            </div>

            <div onClick={() => this.setaccordion(12, "sub")} className='faq_sub' style={{ height: this.state.sub === 12 ? 'auto' : 50 }}>
              <div className='faq_title'><div> What are your delivery timings?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 12? '' : 'none' }}>Depending upon the Locations, our delivery time varies between 7AM to 9PM.</div>

            </div>

            <div onClick={() => this.setaccordion(13, "sub")} className='faq_sub' style={{ height: this.state.sub === 13 ? 'auto' : 50 }}>
              <div className='faq_title'><div>How will I know if any item in my order is unavailable?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 13? '' : 'none' }}>You will receive SMS informing you about the unavailable items in this situation. Refunds (if any) will also be initiated within 12-18 business hours.</div>

            </div>

            <div onClick={() => this.setaccordion(14, "sub")} className='faq_sub' style={{ height: this.state.sub === 14 ? 'auto' : 50 }}>
              <div className='faq_title'><div>How will I know if any item in my order is unavailable?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 14? '' : 'none' }}>You will receive SMS informing you about the unavailable items in this situation. Refunds (if any) will also be initiated within 12-18 business hours.</div>

            </div>

            <div onClick={() => this.setaccordion(15, "sub")} className='faq_sub' style={{ height: this.state.sub === 15? 'auto' : 50 }}>
              <div className='faq_title'><div>What Is the payment options that you support?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 15? '' : 'none' }}>COD, Online payment and PayU money</div>

            </div>

            <div onClick={() => this.setaccordion(16, "sub")} className='faq_sub' style={{ height: this.state.sub === 16 ? 'auto' : 50 }}>
              <div className='faq_title'><div>What will happen if my money is deducted but order not placed?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 16? '' : 'none' }}>Please update this to our Trust Center by calling 1800-123-0110, They will have the amount refunded to you.</div>

            </div>

            <div onClick={() => this.setaccordion(17, "sub")} className='faq_sub' style={{ height: this.state.sub === 17 ? 'auto' : 50 }}>
              <div className='faq_title'><div>Can I place order at midnight?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 17? '' : 'none' }}>Yes, You can. However, the delivery starts from 7AM Hence, you can expect the delivery only after 7AM</div>

            </div>

            <div onClick={() => this.setaccordion(18, "sub")} className='faq_sub' style={{ height: this.state.sub === 18 ? 'auto' : 50 }}>
              <div className='faq_title'><div>What if a customer Stays in Whitefield but wants to order for Koramangala?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 18? '' : 'none' }}>You can surely do that provided, we have service in that location and there is someone to pick your item at the delivery point.</div>

            </div>

            <div onClick={() => this.setaccordion(19, "sub")} className='faq_sub' style={{ height: this.state.sub === 19 ? 'auto' : 50 }}>
              <div className='faq_title'><div>How do I contact customer service?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 19? '' : 'none' }}>Our customer service team is available throughout the week, all seven days from 7AM to 10PM. They can be reached at 1800-123-0110 , WhatsApp on 934-123-0110 or via email at <a href="mailto:trustcenter@avenue11.com"/>trustcenter@avenue11.com</div>

            </div>

            <div onClick={() => this.setaccordion(20, "sub")} className='faq_sub' style={{ height: this.state.sub === 20 ? 'auto' : 50 }}>
              <div className='faq_title'><div> How do I track the Order?</div><div>+</div></div>
              <div className='accordion_sub' style={{ height: 100, display: this.state.sub === 20? '' : 'none' }}>Once the orders is accepted, the customer gets an email and SMS of the same.</div>

            </div>

            

             
  

            </div>
          </div>
        </div>

      </div>
    );
  }
}


export default Faq;