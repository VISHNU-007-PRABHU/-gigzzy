import React from 'react'
import { withRouter } from "react-router";
import { Layout, Row, Col, Avatar, Menu, Icon, message, Dropdown, Drawer } from 'antd';
import DrawerForm from './DrawerForm';
const { Header } = Layout;
class AdminHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            change: 1,
        }
    }

    handleButtonClick(e) {
        message.info('Click on left button.');
        console.log('click left button', e);
    }

    handleMenuClick(e) {
        console.log(e);
        if (e.key === '/admin') {
            message.info('Logout Success');
            localStorage.removeItem('adminLogin');
        }
        this.props.history.push({ pathname: e.key });
    }
    render() {

        const menu = (
            <Menu onClick={(key) => { this.handleMenuClick(key) }}>

                <Menu.Item key="/admin-settings" className=" d-flex align-items-center px-3">
                    <Icon type="setting" />
                    Setting
        </Menu.Item>
                <Menu.Item key="/admin" className="d-flex align-items-center px-3">
                    <Icon type="logout" />
                    Logout
        </Menu.Item>
            </Menu>
        );

        return (
            <div>
                <Header className="bg-gradient header_layout">
                    <Row>
                        <Col span={12}>
                            <DrawerForm />
                        </Col>
                        <Col span={11}>
                            <div className='float-right'>
                                <Dropdown className='cursor_point' overlay={menu} placement="bottomCenter">
                                    <Avatar style={{ backgroundColor: "Green", verticalAlign: 'middle' }} size="large">
                                        Admin
                                     </Avatar>
                                </Dropdown>

                            </div>
                        </Col>
                    </Row>
                </Header>
            </div >
        )
    }
}
export default withRouter(AdminHeader);

