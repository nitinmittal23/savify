import React from 'react';
//import './Footer.css';

function Footer({stickAtBottom}) {
    const today = new Date();
    const currentYear = today.getFullYear();
    return <footer style={{
            position:'relative',
            textAlign: "center",
            position: "left", 
            bottom:'10px', 
            fontWeight: "bold",
            fontSize: "20px",  
            width: "100%",
            backgroundcolor: "#fff",
            height: "40px",
            lineheight: "40px"
    }}>
                Copyrights &#169; {currentYear} Savify
           </footer>
}

export default Footer;