import React from 'react'
import { Link } from "react-router-dom";
import { Icon, Row, Col } from 'antd';

const content = {
    title: "How it works",
    btn_text: "Learn more"
}
const subcontent = [{
    icon: "message",
    title: "1.Signup and complete registration",
    data: ""
}, {
    icon: "thunderbolt",
    title: "2.Post a job or project",
    data: "From routine maintenance and repairs to dream  home renovations , we can help with any project - big or small"
}, {
    icon: "heart",
    title: "3.Accept quotes from service provider(s)",
    data: "From routine maintenance and repairs to dream  home renovations , we can help with any project - big or small"
}, {
    icon: "bulb",
    title: "4.Payment is processed after job completion",
    data: "From routine maintenance and repairs to dream  home renovations , we can help with any project - big or small"
}]
function How() {
    return (
        <div className="my-5">
            <Row gutter={[24, 24]} >
                <Col>
                    <h2 className="bold mb-5 text-center">{content.title}</h2>
                </Col>
            </Row>
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                {subcontent.map(itemdata => <>
                    <Col className="gutter-row" sm={24} md={6}>
                        <div className="d-flex flex-column align-items-start">
                            <h3 className="bold text-center w-100"><Icon type={itemdata.icon} /> </h3>
                            <h3 className="text-center w-100">{itemdata.title}</h3>
                            {/* <div className="">{itemdata.data}</div> */}
                        </div>
                    </Col>
                </>)}
            </Row>
            <Row gutter={[24, 24]} >
                <Col>
                    <div className="d-flex justify-content-around">
                        <Link to="/howlearnmore" target="_blank" className="normal_font_size">
                            {content.btn_text}
                        </Link>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default How
