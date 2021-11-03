import React, { Suspense } from "react";
import 'antd/dist/antd.css';
import { Layout, Row, Col, Skeleton, Icon } from 'antd';
import { HowLearnMoreData } from './HowLearnMoreData';
import howprovider from "../../../image/howprovider.jpg";
import howcustomer from "../../../image/howcustomer.jpg";

const { Content } = Layout;
const UserHeader = React.lazy(() => import('../Layout/UserHeader'));
const UserFooter = React.lazy(() => import('../Layout/UserFooter'));

const content = {
    title: "How it works",
}

function HowLearnMore() {
    return (
        <Layout className="white" style={{ minHeight: '100vh' }}>
            <span className=" d-none d-md-block">
                <Suspense fallback={<Skeleton active />}>
                    <UserHeader />
                </Suspense>
            </span>
            <Content className="px-1">
                <Row gutter={[24, 24]} >
                    <Col>
                        <h2 className="bold mb-5 text-center">{content.title}</h2>
                    </Col>
                </Row>
                {HowLearnMoreData.map(parentdata => {
                    return (
                        <>
                            <Row gutter={[16, 16]}>
                                <Col lg={{ span: 20, offset: 2 }}>
                                    <div>
                                        <h6 style={{ color: "green" }}>{parentdata.title}</h6>
                                        <Row className={parentdata.title === "Customers" ? "flex-row-reverse d-flex align-items-center" : "d-flex align-items-center"}>
                                            <Col sm={24} md={12}>
                                                <img lodaing="lazy" className="loading img-fluid p-5" src={parentdata.title === "Customers" ? howcustomer : howprovider} />
                                            </Col>
                                            <Col sm={24} md={12}>
                                                {parentdata.data.map(innerdata => <>
                                                    <div className="d-flex align-items-center">
                                                        <h3 className="bold"><Icon type={innerdata.icon} /> </h3>
                                                        <h4 className="px-3">{innerdata.title}</h4>
                                                        {/* <div className="">{itemdata.data}</div> */}
                                                    </div>
                                                </>)}
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    )
                })}
            </Content>
            <span className=" d-none d-md-block">
                <Suspense fallback={<Skeleton active />}>
                    <UserFooter />
                </Suspense>
            </span>
        </Layout>)
}

export default HowLearnMore
