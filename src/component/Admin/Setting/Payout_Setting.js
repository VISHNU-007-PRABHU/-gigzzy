import React from "react";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import { Button, Card, Row, Col, Input, Form, Switch } from 'antd';
import { ADD_PAYOUT, GET_PAYOUT_SETTING } from '../../../graphql/Admin/static';
import { client } from "../../../apollo";
import { Alert_msg } from '../../Comman/alert_msg';

class PayoutSettings extends React.Component {
    state = {
        collapsed: false,
        user_name: '',
        password: '',
        secret_key: '',
        client_key: '',
        signature: '',
        payout_status: 0,
        msg: "",
        status: '',
        file: {},
        imageUrl: ''
    };
    onToggle = (val) => {
        console.log(val);
        this.setState({
            collapsed: val,
        });
    };
    componentDidMount = async () => {
        this.get_payout_data();
    }
    get_payout_data = async () => {
        await client.query({
            query: GET_PAYOUT_SETTING,
            fetchPolicy: 'no-cache',
        }).then(result => {
            // console.log(result);
            this.setState({
                user_name: result.data.payout_setting_detail ? result.data.payout_setting_detail.user_name : "",
                password: result.data.payout_setting_detail ? result.data.payout_setting_detail.password : "",
                secret_key: result.data.payout_setting_detail ? result.data.payout_setting_detail.secret_key : "",
                client_key: result.data.payout_setting_detail ? result.data.payout_setting_detail.client_key : "",
                signature: result.data.payout_setting_detail ? result.data.payout_setting_detail.signature : "",
                payout_status: result.data.payout_setting_detail ? result.data.payout_setting_detail.payout_status : "",
            });
        });
    }
    add_data = async () => {
        const { form } = this.props;
        var data = {}
        form.validateFields(async (err, values) => {
            console.log(values);
            if (values.user_name !== undefined) {
                data.user_name = values.user_name;
            }
            if (values.password !== undefined) {
                data.password = values.password;
            }
            if (values.secret_key !== undefined) {
                data.secret_key = values.secret_key;
            }
            if (values.client_key !== undefined) {
                data.client_key = values.client_key;
            }
            if (values.signature !== undefined) {
                data.signature = values.signature;
            }
            if (values.payout_status !== undefined) {
                data.payout_status = values.payout_status;
            }

            await client.mutate({
                mutation: ADD_PAYOUT,
                variables: { ...data },
            }).then((result, loading, error) => {
                if (loading) {
                    // Alert("loading");
                }
                console.log(result);
                Alert_msg(result.data.add_payout_detail);
            });
        });
    }


    render() {
        const { form } = this.props;
        return (
            <>
                <Row>
                    <Col md={12} sm={24}>
                        <Card  bordered={false} style={{ boxShadow: "0px 2px 6px 0px #7fd3af" }} title="Stripe" extra={<Switch checkedChildren="active" unCheckedChildren="in-active" onChange={(checked) => { this.setState({ payout_status: checked }) }} checked={this.state.payout_status} />} >
                            <Row>
                                <Col span={24} >
                                    <Form.Item label="User Name">
                                        {form.getFieldDecorator("user_name", {
                                            rules: [],
                                            initialValue: this.state.user_name,
                                        })(<Input placeholder="user name" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item label="Password">
                                        {form.getFieldDecorator("password", {
                                            rules: [],
                                            initialValue: this.state.password,
                                        })(<Input placeholder="Password" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item label="Secret Key">
                                        {form.getFieldDecorator("secret_key", {
                                            rules: [],
                                            initialValue: this.state.secret_key,
                                        })(<Input placeholder="Secret Key" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Client ID">
                                        {form.getFieldDecorator("client_key", {
                                            rules: [],
                                            initialValue: this.state.client_key,
                                        })(<Input placeholder="Client ID" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Signature">
                                        {form.getFieldDecorator("signature", {
                                            rules: [],
                                            initialValue: this.state.signature,
                                        })(<Input placeholder="Signature" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Button type="primary" block onClick={this.add_data}>
                                    Update
                        </Button>
                            </Row>
                        </Card>
                </Col>
                </Row>

            </>
        );
    }
}


export default Form.create()(PayoutSettings);
