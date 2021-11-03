import React from "react";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import AdminSider from '../Layout/AdminSider';
import AdminHeader from '../Layout/AdminHeader';
import SiteSetting from './Site_Setting';
import { Layout, Tabs } from 'antd';
import PayoutSettings from "./Payout_Setting";

const { Content } = Layout;
const { TabPane } = Tabs;

class Settings extends React.Component {
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

        return (
            <Layout style={{ height: '100vh' }}>
                <AdminSider update_collapsed={this.state.collapsed} />
                <Layout>
                    <AdminHeader />
                    <Content className="main_frame">
                        <Tabs>
                            <TabPane tab="Payouts Setting" key="1">
                                <PayoutSettings />
                            </TabPane>
                            <TabPane tab="Site Setting" key="2">
                                <SiteSetting />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}


export default Settings;
