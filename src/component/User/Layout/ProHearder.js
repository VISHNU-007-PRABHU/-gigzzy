import React from 'react'
import {  Layout, Row, Col, Avatar, Menu, Icon,  Dropdown } from 'antd';
import main from '../../../image/Gigzzy.png';
import useReactRouter from 'use-react-router';
import {  FaUserCog } from "react-icons/fa";
import {  AiOutlineLogout } from "react-icons/ai";
const { Header } = Layout;

export const ProHeader = () => {
    const { history } = useReactRouter();
    const logout = () => {
        if (localStorage.getItem('providerLogin') === 'success') {
            localStorage.removeItem('providerLogin');
            localStorage.removeItem('provider');
            history.push('/provider_login');
        }
    }

    const menu = (
        <Menu>

            <Menu.Item>
                <div className="mr-1 d-flex align-items-center" onClick={() => { history.push('/provider_earnings') }}>
                    <FaUserCog className="mr-3 f_25" />
                    <span>My Earnings</span>
                </div>
            </Menu.Item>
            <Menu.Item>
                <div className="mr-1 d-flex align-items-center" onClick={() => { history.push('/provider_detail') }}>
                    <FaUserCog className="mr-3 f_25" />
                    <span>My Bookings</span>
                </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item>
                <div className="mr-1 d-flex align-items-center" onClick={logout} >
                    <AiOutlineLogout className="mr-3 f_25" />
                    <span>Logout</span>
                </div>
            </Menu.Item>

        </Menu>
    );

    return (
        <div>
            <Header className="white user_header px-0">
                <Row>
                    <Col lg={{ span: 20, offset: 2 }} className="px-1">
                        <img src={main} alt={'Jiffy'} className='w-75x object_fit cursor_point' onClick={() => { history.push('/provider_detail') }} />
                        <div className='float-right'>
                            <Dropdown overlay={menu} placement="bottomRight">
                                <Avatar
                                    className="ant-dropdown-link avatar_shadow"
                                    icon={<Icon type="user" style={{ verticalAlign: "baseline" }} />}
                                    src={JSON.parse(localStorage.getItem('provider')) ? JSON.parse(localStorage.getItem('provider')).img_url : ""} />
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </Header>
        </div>
    )
}