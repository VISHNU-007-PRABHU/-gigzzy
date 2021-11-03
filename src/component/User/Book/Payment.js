import React, { Suspense, Component } from 'react';
import { withRouter } from "react-router-dom";
import { ACCEPT_JOB_MSG } from '../../../graphql/User/booking';
import { client } from '../../../apollo';
import { Form, Input, Button, Spin, Collapse, Icon } from 'antd';
import { Alert_msg } from '../../Comman/alert_msg';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import mpesa_logo from '../../../image/mpesa_logo.png';

const { Panel } = Collapse;

const C2B_CONTENT = React.lazy(() => import('../../Admin/Booking/C2B_CONTENT')); // Lazy-loaded
class _CardForm extends Component {
    state = {
        errorMessage: '',
        loading: false,
        phone_number: '',
        country_code: '',
        m_no: '',
    };

    handleChange = ({ error }) => {
        if (error) {
            this.setState({ errorMessage: error.message });
        } else {
            this.setState({ errorMessage: '', loading: false, hide: false });
        }
    };

    handleSubmit = async (evt) => {
        evt.preventDefault();
        let phone_number = `${this.state.country_code}${this.state.m_no}`
        if (!phone_number) {
            this.setState({
                errorMessage: "Please enter correct phone number"
            });
            return false
        }
        this.setState({ loading: true });

        await client.mutate({
            mutation: ACCEPT_JOB_MSG,
            variables: { booking_status: 10, booking_id: this.props.data._id, role: 1, phone_number: phone_number },
            fetchPolicy: 'no-cache',
        }).then(result => {
            this.setState({ loading: false });
            if (result.data.manage_booking[0].status === "success") {
                Alert_msg({ msg: "Waiting for your payment confirmation", status: "success" });
                this.props.history.push(`/admin-booking-invoice/${this.props.data._id}`)
            } else {
                Alert_msg({ msg: "Job Booking Cancel Failed", status: "failed" });
            }
        });
        this.setState({ loading: false });
    }
    handleSubmit_C2B = async () => {
        this.setState({ loading: true });

        await client.mutate({
            mutation: ACCEPT_JOB_MSG,
            variables: { booking_status: 10, booking_id: this.props.data._id, role: 1, payment_type: "c2b" },
            fetchPolicy: 'no-cache',
        }).then(result => {
            this.setState({ loading: false });
            if (result.data.manage_booking[0].status === "success") {
                Alert_msg({ msg: "Waiting for your payment confirmation", status: "success" });
                this.props.history.push(`/admin-booking-invoice/${this.props.data._id}`)
            } else {
                Alert_msg({ msg: "Job Booking Cancel Failed", status: "failed" });
            }
        });
        this.setState({ loading: false });
    }
    //     });
    // } else {
    //     Alert_msg({ msg: "Stripe is not working now ...", status: "failed" });
    // }

    render() {
        const { ctob_billRef, ctob_shotcode, mpeas_payment_callback, base_price, extra_price } = this.props.data
        return (
            <div className="CardDemo w-100">
                <label className="w-100">
                    Payment Instructions
                </label>
                <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                    className="site-collapse-custom-collapse"
                >
                    <Panel header=" Mpesa phone number" key="1" className="site-collapse-custom-panel">
                        <Spin spinning={this.state.loading} className="d-flex justify-content-center mt-4" size="large" >
                            <div>
                                <img src={mpesa_logo} className="w-25" alt="gigzzy mpesa" />
                                <span className="pl-3">Pay Via Mpesa</span>
                            </div>
                            <div className="pt-3">Enter the amount to pay</div>
                            <Input value={base_price} disabled />
                            <div className="pt-3">Enter M-PESA phone number to pay from</div>
                            <PhoneInput
                                searchStyle={{ backgroundColor: 'white' }}
                                placeholder="phone no"
                                inputClass="input_border"
                                buttonClass="input_border"
                                inputStyle={{ height: '46px' }}
                                country={'ke'}
                                mask={{ in: '..........' }}
                                onKeyDown={(event) => {
                                    if (event.keyCode == 13) {
                                        this.handleSubmit();
                                    }
                                }}
                                value={this.state.m_no}
                                onChange={(value, data, event) => {
                                    console.log("render -> value", value)
                                    console.log("render -> m_no: value.replace(/[^0-9]+/g, '').slice(data.dialCode.length)", value.replace(/[^0-9]+/g, '').slice(data.dialCode.length))
                                    console.log("render -> data.dialCode", data.dialCode)
                                    this.setState({
                                        m_no: value.replace(/[^0-9]+/g, '').slice(data.dialCode.length),
                                        country_code: data.dialCode
                                    });
                                }} />
                            <div className="error" role="alert">
                                {this.state.errorMessage}
                            </div>
                            <div className="pt-3">After pressing pay button and respond to M-Pesa promt on your phone. After transacting press the button below to proceed.</div>
                            <div className="d-flex justify-content-center">
                                <Button onClick={this.handleSubmit} className="mt-3 mx-auto" type="primary" htmlType="submit">
                                    Accept and Pay
                                </Button>
                            </div>
                        </Spin>
                    </Panel>
                    <Panel header="Mpesa Customer To Business (C2B)" key="2" className="site-collapse-custom-panel">
                        <Suspense fallback={
                            <div class="spinner-border text-success" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        }>
                            <C2B_CONTENT BusinessNumber={ctob_shotcode} AmountNumber={ctob_billRef} Amount={base_price} />
                            <div className="d-flex justify-content-center">
                                <Button onClick={this.handleSubmit_C2B} className="mt-3 mx-auto" type="primary" htmlType="submit">
                                    Accept and GO
                                </Button>
                            </div>
                        </Suspense>
                    </Panel>
                </Collapse>
            </div>
        );
    }

}

export default Form.create()(withRouter(_CardForm));
