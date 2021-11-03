import React from "react";
import 'antd/dist/antd.css';
import {  Layout } from 'antd';
import { ProHeader } from '../Layout/ProHearder';
import UserFooter  from '../Layout/UserFooter';
import EarningsTable from './Earnings_Table';

const {  Content } = Layout;

class ProviderEarns extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <Layout className="white" style={{ height: '100vh' }}>
                <ProHeader />
                <Content className="p-4">
                    <EarningsTable/>
                </Content>
                <UserFooter />
            </Layout>
        )
    }
}
export default ProviderEarns;