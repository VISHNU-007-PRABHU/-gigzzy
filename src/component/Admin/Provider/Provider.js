
import React from "react";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import AdminSider from '../Layout/AdminSider';
import AdminHeader from '../Layout/AdminHeader';
import ProviderComponent from './Provider_Table';
import { Layout, Tabs,Button } from 'antd';
import PendingProvider from "./PendingProvider";
const { Content } = Layout;
const { TabPane } = Tabs;
class Provider extends React.Component {
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
                    <Content className="main_frame ">
                        <Tabs tabBarExtraContent={
                            <Button type="primary" onClick={() => { this.props.history.push('/admin-provider/add'); }}>
                                Add Provider
                            </Button>
                        }>
                            <TabPane tab="Pending Provider" key="1">
                                <PendingProvider/>
                            </TabPane>
                            <TabPane tab="Approved Provider" key="2">
                                <ProviderComponent />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}


export default Provider;
