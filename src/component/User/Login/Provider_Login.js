import React from "react";
import 'antd/dist/antd.css';
import { Button, Row, Col, Typography, Form, Input } from 'antd';
import jiffy from '../../../image/gigzzypro.png';
import main from '../../../image/main.png';
import ReactPhoneInput from "react-phone-input-2";
import OtpInput from 'react-otp-input';
import 'react-phone-input-2/lib/style.css'
import '../../../scss/user.scss';
import { ADD_USER, CHECK_OPT, EMAIL_LOGIN } from '../../../graphql/User/login';
import { client } from "../../../apollo";
import { Alert_msg } from "../../Comman/alert_msg";
import { TiRefresh } from "react-icons/ti";
const { Text, Title } = Typography;
class Provider_Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            register: 0,
            otp_login: 1,
            email_login: 0,
            country_code: '',
            m_no:'',
            login: 1,
        };
    }
    get_otp = async () => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            if (!err) {
                await client.query({
                    query: ADD_USER,
                    variables: { option: "otp", phone_no: this.state.m_no, role: 2, country_code: this.state.country_code },
                    fetchPolicy: 'no-cache',
                }).then(result => {
                    console.log(result.data.addUser.status);
                    localStorage.setItem('provider', JSON.stringify(result.data.addUser));
                    Alert_msg({ msg: result.data.addUser.otp, status: "success" });
                    this.setState({ login: 0 });
                });

            }
        });
    }

    resend_otp = async () => {
        var data = JSON.parse(localStorage.getItem('provider'));
        console.log(data);
        await client.query({
            query: ADD_USER,
            variables: { option: "otp", phone_no: data.phone_no, role: 2, country_code: data.phone_no },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result.data.addUser.status);
            localStorage.setItem('provider', JSON.stringify(result.data.addUser));
            Alert_msg({ msg: result.data.addUser.otp, status: "success" });
            this.setState({ login: 0 });
        });
    }

    check_otp = async () => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            console.log(values);
            var user = localStorage.getItem('provider');
            console.log(user);
            if (!err) {
                await client.query({
                    query: CHECK_OPT,
                    variables: { _id: JSON.parse(user)._id, otp: values.otp },
                    fetchPolicy: 'no-cache',
                }).then(result => {
                    console.log(result.data);
                    if (result.data.checkOtp.msg === "new user") {
                        this.setState({ register: 1, otp_login: 0 });
                    } else if (result.data.checkOtp.msg === "Wrong OTP") {
                        Alert_msg(result.data.checkOtp);
                    } else {
                        console.log(this.props);
                        localStorage.setItem('providerLogin', "success");
                        this.props.history.push('/provider_detail');
                    }
                });

            }
        });
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
                    console.log(result.data.sing_up.status);
                    localStorage.setItem('provider', JSON.stringify(result.data.addUser));
                    Alert_msg({ msg: result.data.addUser.otp, status: "success" });
                    this.setState({ login: 0 });
                });

            }
        });
    }

    add_user = async () => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            console.log(values);
            var user = localStorage.getItem('provider');
            console.log(user);
            if (!err) {
                await client.mutate({
                    mutation: ADD_USER,
                    variables: { option: 'add', _id: JSON.parse(user)._id, name: values.name, email: values.email, password: values.password },
                }).then(result => {
                    console.log(result.data);
                    Alert_msg(result.data.addUser);
                    if (result.data.addUser.status === "success") {
                        localStorage.setItem('providerLogin', "success");
                        this.props.history.push('/provider_detail');
                    } else {
                        this.setState({ register: 1, otp_login: 0 });
                    }
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
                        <img src={jiffy} alt="jiffy" style={{width:500}} />
                    </div>
                </Col>
                <Col lg={12} md={24} sm={24} className="froms" style={{ overflow: 'auto', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className={this.state.otp_login ? "w-75 mw-450" : " d-none"}>
                        <Row>
                            <Col span={24} className="d-flex d-sm-flex d-lg-none justify-content-around py-3 my-2">
                                <img src={main} alt="jiffy" width='12' style={{ width: '7em', height: '3em' }} height='10' />
                            </Col>
                            <Col span={24} className="d-flex justify-content-around py-3">
                                <Title level={2}> <Text className="primary_color" strong={true} >LOGIN</Text></Title>
                            </Col>
                            <Row>
                                <Col span={24} className={this.state.login ? 'py-3' : 'd-none'}>
                                    <Form.Item label="Mobile Number">
                                        {form.getFieldDecorator("phone", {
                                            rules: this.state.login ? [{ required: true, message: 'Enter Mobile Number' }] : []
                                        })(<ReactPhoneInput
                                            searchStyle={{ backgroundColor: 'white' }}
                                            placeholder="phone no"
                                            inputClass="input_border"
                                            buttonClass="input_border"
                                            inputExtraProps={{
                                                name: "phone",
                                                required: true,
                                                autoFocus: true
                                            }}
                                            value={this.state.phone}
                                            country={'ke'}
                                            // defaultCountry={I}
                                            onKeyDown={(event)=>{
                                                if(event.keyCode == 13){
                                                    this.get_otp();
                                                }
                                            }}
                                            onChange={(value, data, event) => {
                                                this.setState({
                                                    m_no: value.replace(/[^0-9]+/g, '').slice(data.dialCode.length),
                                                    country_code: data.dialCode
                                                });
                                            }} />
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col span={24} className={this.state.login ? 'd-none' : 'py-3'}>
                                    <Form.Item label="OTP">
                                        {form.getFieldDecorator("otp", {
                                            rules: this.state.login ? [] : [{ required: true, message: 'Enter OTP' }]
                                        })(<OtpInput
                                            onChange={otp => { this.setState({ otp }) }}
                                            numInputs={4}
                                            inputStyle={{ width: '5em', margin: "0px 5px" }}
                                            separator={<span className="px-3">    </span>}
                                        />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Col span={24}>
                                <Button type="primary" size="large" block className={this.state.login ? '' : 'd-none'} htmlType="submit" onClick={this.get_otp}>
                                    Next
                                </Button>
                                <Button type="primary" size="large" block className={this.state.login ? 'd-none' : ''} htmlType="submit" onClick={this.check_otp}>
                                    Submit
                                </Button>
                                <Button type="link" size="large" block className={this.state.login ? 'd-none' : ''} onClick={this.resend_otp}>
                                    <TiRefresh className="primary_color"/> <span className="primary_color">resend otp</span>
                                </Button>
                            </Col>
                            <Col span={24} className="d-flex justify-content-center py-3">
                                <Text>or</Text>
                            </Col>
                            <Col span={24} className="d-flex justify-content-center">
                                <Button type="link" onClick={() => { this.props.history.push('/provider_signup') }}><Text>Login via <span className="primary_color">Email Address</span></Text></Button>
                            </Col>
                        </Row>
                    </div>

                    <div className={this.state.email_login ? "w-75 mw-450" : " d-none"}>
                        <Row>
                            <Col span={24} className="d-flex d-sm-flex d-lg-none justify-content-around py-3 my-2">
                                <img src={main} alt="jiffy" width='12' style={{ width: '7em', height: '3em' }} height='10' />
                            </Col>
                            <Col span={24} className="d-flex justify-content-around py-3">
                                <Title level={2}> <Text className="primary_color" strong={true} >LOGIN</Text></Title>
                            </Col>
                            <Row>
                                <Col className="" lg={24}>
                                    <Form.Item label="Email">
                                        {form.getFieldDecorator("email", {
                                            rules: this.state.email_login ? [{ required: true }] : []
                                        })(<Input placeholder="Email" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col className="" lg={24}>
                                    <Form.Item label="Password">
                                        {form.getFieldDecorator("password", {
                                            rules: this.state.email_login ? [{ required: true }] : []
                                        })(<Input.Password placeholder="Password" className="input_border border_less" onPressEnter={this.check_otp} />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Col span={24}>
                                <Button type="primary" size="large" block className={this.state.email_login ? '' : 'd-none'} htmlType="submit" onClick={this.check_otp}>
                                    Submit
                                </Button>
                            </Col>
                            <Col span={24} className="d-flex justify-content-center py-3">
                                <Text>or</Text>
                            </Col>
                            <Col span={24} className="d-flex justify-content-center">
                                <Button type="link" onClick={() => { this.setState({ email_login: 0, otp_login: 1 }) }}><Text>Are you new here ? <span className="primary_color">Register</span></Text></Button>
                            </Col>
                        </Row>
                    </div>

                    <div className={this.state.register ? "w-75 mw-450" : " d-none"}>
                        <Row>
                            <Col span={24} className="d-flex d-sm-flex d-lg-none justify-content-around py-3 my-2">
                                <img src={main} alt="jiffy" width='12' style={{ width: '7em', height: '3em' }} height='10' />
                            </Col>
                            <Col span={24} className="d-flex justify-content-around py-3">
                                <Title level={2}> <Text className="primary_color" strong={true} >REGISTER</Text></Title>
                            </Col>
                            <Row>
                                <Col className="" lg={24}>
                                    <Form.Item label="Full Name">
                                        {form.getFieldDecorator("name", {
                                            rules: this.state.register ? [{ required: true }] : []
                                        })(<Input  className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col className="" lg={24}>
                                    <Form.Item label="Email">
                                        {form.getFieldDecorator("email", {
                                            rules: this.state.register ? [{ required: true }] : []
                                        })(<Input  className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col className="" lg={24}>
                                    <Form.Item label="Password">
                                        {form.getFieldDecorator("password", {
                                            rules: this.state.register ? [{ required: true }] : []
                                        })(<Input.Password  className="input_border"  />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Col span={24}>
                                <Button type="primary" size="large" block className={this.state.register ? '' : 'd-none'} htmlType="submit" onClick={this.add_user}>
                                    Register
                                </Button>
                            </Col>
                            <Col span={24} className="d-flex justify-content-center py-3">
                                <Text>or</Text>
                            </Col>
                            <Col span={24} className="d-flex justify-content-center">
                                <Button type="link" onClick={() => { this.setState({ register: 0, otp_login: 1, login: 1 }) }}><Text>Are you new here ? <span className="primary_color">Register</span></Text></Button>
                            </Col>
                        </Row>
                    </div>

                </Col>
            </Row>
        );
    }
}
export default Form.create()(Provider_Login);
