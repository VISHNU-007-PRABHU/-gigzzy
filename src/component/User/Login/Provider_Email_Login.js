import React from "react";
import 'antd/dist/antd.css';
import { Button, Row, Col, Typography, Form, Input } from 'antd';
import jiffy from '../../../image/Gigzzy.png';
import main from '../../../image/main.png';
import '../../../scss/user.scss';
import { EMAIL_LOGIN } from '../../../graphql/User/login';
import { client } from "../../../apollo";
import { Alert_msg } from "../../Comman/alert_msg";
const { Text, Title } = Typography;
class Provider_Email_Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            register: 0,
            otp_login: 0,
            email_login: 1,
            country_code: '',
            login: 0,
        };
    }

    emailLogin = async () => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            if (!err) {
                await client.query({
                    query: EMAIL_LOGIN,
                    variables: { role: 2, email: values.email, password: values.password },
                    fetchPolicy: 'no-cache',
                }).then(result => {
                    console.log(result.data.sign_up.status);
                    if (result.data.sign_up.status === 'success') {
                        localStorage.setItem('providerLogin', 'success');
                        localStorage.setItem('provider', JSON.stringify(result.data.sign_up));
                        this.props.history.push('/provider_detail');
                    }
                    Alert_msg(result.data.sign_up);
                });

            }
        });
    }



    render() {
        const { form } = this.props;
        return (
            <Row style={{ overflow: 'auto', height: '100vh' }}>
                <Col lg={12} className="d-none d-lg-flex d-xl-flex justify-content-center align-items-center overflow-hidden h-100">
                    <div className="d-flex justify-content-around">
                        <img src={jiffy} alt="jiffy" style={{width:500}}/>
                    </div>
                </Col>
                <Col lg={12} md={24} sm={24} className="froms" style={{ overflow: 'auto', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                    <div className={this.state.email_login ? "w-75 mw-450" : " d-none"}>
                        <Row>
                            <Col span={24} className="d-flex d-sm-flex d-lg-none justify-content-around py-3 my-2">
                                <img src={jiffy} alt="jiffy" width='12' style={{ width: '7em', height: '3em' }} height='10' />
                            </Col>
                            <Col span={24} className="d-flex justify-content-around py-3">
                                <Title level={2}> <Text className="primary_color" strong={true} >LOGIN</Text></Title>
                            </Col>
                            <Row>
                                <Col className="" lg={24}>
                                    <Form.Item label="Email">
                                        {form.getFieldDecorator("email", {
                                            rules: this.state.email_login ? [{ required: true ,message: 'Enter Email'}] : []
                                        })(<Input placeholder="Email" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col className="" lg={24}>
                                    <Form.Item label="Password">
                                        {form.getFieldDecorator("password", {
                                            rules: this.state.email_login ? [{ required: true,message: 'Enter Password' }] : []
                                        })(<Input.Password placeholder="Password" className="input_border border_less" onPressEnter={this.emailLogin} />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Col span={24}>
                                <Button type="primary" size="large" block className={this.state.email_login ? '' : 'd-none'} htmlType="submit" onClick={this.emailLogin}>
                                    Submit
                                </Button>
                            </Col>
                            <Col span={24} className="d-flex justify-content-center py-3">
                                <Text>or</Text>
                            </Col>
                            <Col span={24} className="d-flex justify-content-center">
                                <Button type="link" onClick={() => { this.props.history.push('/provider_login') }}><Text>Are you new here ? <span className="primary_color">Register</span></Text></Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
}
export default Form.create()(Provider_Email_Login);
