/* eslint-disable react/jsx-pascal-case */
import React from "react";
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import  UserFooter from '../Layout/UserFooter';
import Booking_Table from './Booking_Table';
import { ProHeader } from "../Layout/ProHearder";

const { Content } = Layout;

class Provider_Details extends React.Component {
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
                    <Booking_Table/>
                </Content>
                <UserFooter />
            </Layout>
        )
    }
}
export default Provider_Details;