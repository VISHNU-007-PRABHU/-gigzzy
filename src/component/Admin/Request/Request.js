import React from "react";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import  AdminSider from '../Layout/AdminSider';
import  AdminHeader  from '../Layout/AdminHeader';
import ProviderAccept from './Provider_Accept';
import CancelRequest from './Cancel_Request';
import { Layout, Tabs } from 'antd';
import UserRequest from "./User_Request";

const { Content } = Layout;
const { TabPane } = Tabs;

class Request extends React.Component {
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
                            <TabPane tab="User Request" key="1">
                                <UserRequest />
                            </TabPane>
                            <TabPane tab="Provider Request" key="2">
                                <ProviderAccept />
                            </TabPane>
                            <TabPane tab="Request Cancel" key="3">
                                 <CancelRequest/>
                            </TabPane>
                        </Tabs>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}


export default Request;
