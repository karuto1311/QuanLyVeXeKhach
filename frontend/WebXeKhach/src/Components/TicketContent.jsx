import React from "react";
import '../assets/Css/Ticket.css';


function TicketContent(){
    return(
        
        <div>
            <h1>TRA CỨU THÔNG TIN ĐẶT VÉ</h1>
        <div className="ticket-container">
           <div className="ticket-box">
            <div>Tìm thông tin vé của mình</div>
            <div className="form-ticket">
                <form className="form-ticket">
                    <div>
                        Nhập số điện thoại
                        <input type="text"></input>
                    </div>
                    <div>
                        Nhập mã số vé     
                        <input type="text"></input>
                    </div>
                    <div>
                        <button className="button-ticket-2">Tìm vé</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </div>
    )

}
export default TicketContent;