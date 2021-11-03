import React from "react";
import 'antd/dist/antd.css';
import { Button, Row, Col, Typography, Form, Input, Modal } from 'antd';
import jiffy from '../../../image/Gigzzy.png';
import main from '../../../image/main.png';
import '../../../scss/user.scss';
import { EMAIL_LOGIN,SEND_FORGET_EMAIL } from '../../../graphql/User/login';
import { client } from "../../../apollo";
import { Alert_msg } from "../../Comman/alert_msg";
const { Text, Title } = Typography;
class Email_Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            register: 0,
            forget_pwd: false,
            otp_login: 0,
            email_login: 1,
            country_code: '',
            login: 0,
            forget_email: ""
        };
    }

    emailLogin = async () => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            if (!err) {
                await client.query({
                    query: EMAIL_LOGIN,
                    variables: { role: 1, email: values.email, password: values.password },
                    fetchPolicy: 'no-cache',
                }).then(result => {
                    console.log(result.data.sign_up.status);
                    if (result.data.sign_up.status === 'success') {
                        localStorage.setItem('userLogin', 'success');
                        localStorage.setItem('user', JSON.stringify(result.data.sign_up));
                        this.props.history.push('/');
                    }
                    Alert_msg(result.data.sign_up);
                });

            }
        });
    }


    submitemail = async () => {
        console.log(this.state.forget_email);
        if (this.state.forget_email) {
            await client.query({
                query: SEND_FORGET_EMAIL,
                variables: { role: 1, email: this.state.forget_email },
                fetchPolicy: 'no-cache',
            }).then(result => {
                if (result.data.confirm_email.status === 'success') {
                    this.setState({forget_pwd:false});
                }
                Alert_msg(result.data.confirm_email);
            });
        }else{
            Alert_msg({msg:"please Enter Email",status:"failed"});
        }
    };

    render() {
        const { form } = this.props;
        return (
            <>
                <Row style={{ overflow: 'auto', height: '100vh' }}>
                    <Col lg={12} className="d-none d-lg-flex d-xl-flex justify-content-center align-items-center overflow-hidden h-100">
                        <div className="d-flex justify-content-around">
                            <img src={jiffy} alt="jiffy" style={{width:300}}/>
                        </div>
                    </Col>
                    <Col lg={12} md={24} sm={24} className="froms" style={{ overflow: 'auto', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className={this.state.email_login ? "w-75 mw-450" : " d-none"}>
                            <Row>
                                <Col span={24} className="d-flex d-sm-flex d-lg-none h4 justify-content-around py-3 my-2">
                                    <img src={main} alt="jiffy" width='12' style={{ width: '12em', height: '4em' }} height='10' class="img_cover"/>
                                </Col>
                                <Col span={24} className="d-flex justify-content-around py-3">
                                    <Title level={2}> <Text className="primary_color" strong={true} >LOGIN</Text></Title>
                                </Col>
                                <Row>
                                    <Col className="" lg={24}>
                                        <Form.Item label="Email">
                                            {form.getFieldDecorator("email", {
                                                rules: this.state.email_login ? [{ required: true,message: 'Enter Email' }] : []
                                            })(<Input className="input_border" />)}
                                        </Form.Item>
                                    </Col>
                                    <Col className="" lg={24}>
                                        <Form.Item label="Password">
                                            {form.getFieldDecorator("password", {
                                                rules: this.state.email_login ? [{ required: true,message: 'Enter Password' }] : []
                                            })(<Input.Password  className="input_border border_less"  onPressEnter={this.emailLogin}/>)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Col span={24} className="mb-2">
                                    <Button className="float-right primary_color" type="link" onClick={() => { this.setState({ forget_pwd: true }) }}>Forgot Password ?</Button>
                                </Col>
                                <Col span={24}>
                                    <Button type="primary" size="large" block className={this.state.email_login ? '' : 'd-none'} htmlType="submit" onClick={this.emailLogin}>
                                        Submit
                                </Button>
                                </Col>
                                <Col span={24} className="d-flex justify-content-center py-3">
                                    <Text>or</Text>
                                </Col>
                                <Col span={24} className="d-flex justify-content-center">
                                    <Button type="link" onClick={() => { this.props.history.push('/login') }}><Text>Are you new here ? <span className="primary_color">Register</span></Text></Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Modal
                    title="Reset password"
                    className="new_modal"
                    centered
                    visible={this.state.forget_pwd}
                    onOk={this.submitemail}
                    onCancel={() => this.setState({ forget_pwd: false })}
                >
                    <div className="w-100 p-4">
                        <Input size="large" placeholder="Enter your email" allowClear onChange={(event) => { this.setState({ forget_email: event.target.value }) }} />
                    </div>
                </Modal>
            </>
        );
    }
}
export default Form.create()(Email_Login);
