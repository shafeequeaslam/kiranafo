import React, { Component } from 'react';
import play from'./google-play-icon_0.jpg'
import mobile from'./download-app-website_image.jpg'
import './banner.css'

class Banner extends React.Component {


  render() {
    return (
      <div className='mobile-app-banner'>
         <div style={{width:'50%',display:'flex',justifyContent: 'flex-end'}}>
         <div>
             <img src={mobile} alt="Download kirana11 App"/>
          </div></div>
         <div className='downloadApp'>
           <div >
           <div>
              <h2>Download <br/> Kirana11 App</h2>

           </div>
           <div>
              <p>Shop on the go for groceries and <br/> daily essentials on the Kirana11app</p>
              
           </div>
           <div>
             <img src={play} alt="Download kirana11 App"/>
           </div>
           </div>
          </div>

          </div>
      )}

   }
   
   export default Banner;  <h3>Shop on the go for groceries and <br/> daily essentials on the Avenue11app</h3> 