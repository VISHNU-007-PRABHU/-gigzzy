import React, { useCallback,useEffect } from "react";
import useReactRouter from 'use-react-router';

// Alert_file //
import { Alert_msg } from '../../Comman/alert_msg';

//img files //
import jiffy from '../../../image/Gigzzy.png';

// antd files //
import { Layout, Icon, Avatar, Input, Tooltip, Button, Typography, Card, Row, Col } from 'antd';

// graphql flies //
import { useMutation } from "@apollo/react-hooks";
import { ADMIN_LOGIN } from '../../../graphql/Admin/login';

// css files  //
import '../../../scss/LoginPage.scss';
import '../../../scss/template.scss';
const { Header, Content } = Layout;
const { Text } = Typography;


export const LoginPage = (props) => {
    const { history } = useReactRouter();
    const [adminlogin] = useMutation(ADMIN_LOGIN);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    useEffect(() => {
        localStorage.getItem('adminLogin') === "success"? history.push({ pathname: '/admin-dashboard' }) : history.push({ pathname: '/admin' }); 
    }, []);

    const onClick = useCallback(
        async (event) => {
            if (email === '' || password === '') {
                Alert_msg({ msg: "Please Fill All Data", status: 'failed' });
            }else{
                const res = await adminlogin({ variables: { "email": email, "password": password } });
                if (res.data.adminLogin.info.status === "success") {
                    localStorage.setItem('adminLogin', 'success');
                    history.push('/admin-dashboard');
                } else {
                    Alert_msg(res.data.adminLogin.info);
                }
            }
        }, [adminlogin]
    );
    return (
        <div className="h-100">
            <Layout style={{ height: '100vh' }}>
                <Header className='header'>
                    <img src={jiffy} alt='' className='mx-4 logo_img object_fit' />
                </Header>
                <Content className='d-flex justify-content-center'>
                    <Card bordered={true} className="m-auto" >
                        <Row gutter={[24, 24]}>
                            <Col span={24} className="d-flex">
                                <Avatar icon="user" className="mx-auto" />
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]}>
                            <Col span={24} className="d-flex">
                                <Text className="mx-auto" strong>Admin Login</Text>
                            </Col>
                        </Row>
                        <Input size="large"
                            placeholder="Enter your email"
                            className="input"
                            type="email"
                            suffix={<Tooltip title="only admin enter this site" >
                                <Icon type="info-circle"
                                    style={
                                        { color: 'rgba(0,0,0,.45)' }}
                                /> </Tooltip>
                            }
                            onChange={event => setEmail(event.target.value)} />
                        <Input.Password size="large"
                            placeholder="Password"
                            className="my-3"
                            onChange={event => setPassword(event.target.value)}
                            onPressEnter={onClick}
                        />
                        <Button size="large"
                            type="primary"
                            block className="admin_login_btn"
                            onClick={onClick} >
                            Login
                        </Button>
                    </Card>
                </Content>
            </Layout>
        </div>
    );

};