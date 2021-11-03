import React from "react";
import 'antd/dist/antd.css';
// import '../../css/template.scss';
import '../../../scss/Dashboard.scss';
import AdminSider from '../Layout/AdminSider';
import AdminHeader from '../Layout/AdminHeader';
import BookingChart from "./Booking_chart";
import EarningChart from "./Earning_Chart";
import CancelChart from "./Cancel_Chart";
import Others from "./Other";
import { Layout, Row, Col } from 'antd';


const { Content } = Layout;

class Dashboard extends React.Component {
    state = {
        collapsed: false,
    };

    onToggle = (val) => {
        console.log(val);
        this.setState({
            collapsed: val,
        });
    };
    render() {
        const { collapsed } = this.state;
        return (
            <Layout style={{ height: '100vh' }}>
                {/* sidebar */}
                <AdminSider update_collapsed={collapsed} />
                {/* main frame */}
                <Layout>
                    <AdminHeader />
                    <Content style={{ background: '#fff', minHeight: "auto" }} className="main_frame bg-transparent">
                        <Row gutter={[12, 24]}>
                            <Col lg={18} md={24}>
                                <EarningChart />
                            </Col>
                            <Col lg={6} md={24}>
                                <Others/>
                            </Col>
                        </Row>

                        <Row gutter={[12, 24]} className="mt-3">
                            <Col lg={12} md={24}>
                                    <BookingChart />
                            </Col>
                            <Col lg={12} md={24}>
                                    <CancelChart />
                            </Col>
                        </Row>

                    </Content>
                </Layout>
            </Layout>
        );
    }
}


export default Dashboard;




