import React, { Suspense } from "react";
import { Table, Form, Icon, Row, Col, Modal, Collapse, Button, Tag } from 'antd';
import { GET_PAYOUT_DETAIL, GET_ALL_PAYOUT, ADMIN_TO_PROVIDER } from '../../../graphql/Admin/booking';
import { client } from "../../../apollo";
import { Alert_msg } from '../../Comman/alert_msg';
const { Panel } = Collapse;

const EmailSearch = React.lazy(() => import('../User/EmailSearch'));
class PayoutsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            openPanel: 2,
            dataSource: [],
            provider_total: '',
            provider_data: [],
            update_data: {},
            update: 0,
            loading: false,
            loading_img: false,
            imageUrl: '',
            file: {},
            input_data: {},
            previewVisible: false,
            previewImage: '',
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
                simple: true,
            },
            _id_provider: ''
        };
    }

    componentDidMount() {
        this.fetch_payouts();
    }
    handleTableChange = async pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
        this.setState({ loading: true });

        await client.query({
            query: GET_ALL_PAYOUT,
            variables: { limit: pager.pageSize, page: pager.current },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_all_payout.totaldata;
            pagination.current = result.data.get_all_payout.page;
            this.setState({ pagination, loading: false, dataSource: result.data.get_all_payout.data });
        });
    };


    fetch_payouts = async (data) => {
        this.setState({ loading: true });
        let input = {};
        if (data?.provider_id) {
            input = { ...data, limit: this.state.pagination.pageSize, page: this.state.pagination.current };
        } else {
            input = { limit: this.state.pagination.pageSize, page: this.state.pagination.current };
        }
        await client.query({
            query: GET_ALL_PAYOUT,
            variables: input,
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_all_payout.totaldata;
            this.setState({ loading: false, pagination, dataSource: result.data.get_all_payout.data, modalVisible: false });
        });
    }

    delete_booking = (_id) => {
    }

    date_filter = (date, dateString) => {
    }
    payout_detail = async (id, total_amount) => {

        client.query({
            query: GET_PAYOUT_DETAIL,
            variables: { data: { provider_id: id, status: 1, booking_status: 14 } },
            fetchPolicy: 'no-cache',
        }).then(result => {
            this.setState({ _id_provider: id, provider_total: total_amount, provider_data: result.data.get_payout_detail, modalVisible: true })
        });
    }

    payout_to_provider = async (id) => {
        await client.mutate({
            mutation: ADMIN_TO_PROVIDER,
            variables: { booking_status: 14, status: 1, provider_id: this.state._id_provider },
        }).then((result, loading, error) => {
            Alert_msg(result.data.pay_admin_to_provider);
            if (result.data.pay_admin_to_provider.status === "success") {
                this.payout_detail(this.state._id_provider, 0);
                this.fetch_payouts();
            }
        });
    }

    onFilter = async (data) => {
        console.log(Object.keys(data)[0]);
        if (data[Object.keys(data)[0]] == '') {
            delete this.state.input_data[Object.keys(data)[0]];
            var data_pass = this.state.input_data;
            this.setState({ input_data: data_pass })
            this.fetch_payouts(data_pass);
        } else {
            this.setState({ input_data: { ...this.state.input_data, ...data } });
            var input_data = { ...this.state.input_data, ...data };
            this.fetch_payouts(input_data);
        }
    }

    render() {
        const columns = [
            {
                title: () => {
                    return <div>
                        <div className="d-block">
                            <>
                                <Suspense fallback={<div>.......</div>}>
                                    <EmailSearch role={2} value='name' placeholder='Enter Provider' passedFunction={this.onFilter} />
                                </Suspense>
                            </>
                        </div>
                    </div>
                },
                width: '40%',
                editable: true,
                key: "provider_name",
                render: (text, record) => {
                    return <span title="Provider"> {record?.find_payout_provider[0]?.name || " Admin Delete this Provider"}</span>;
                },
            },
            {
                title: 'Amount',
                width: '40%',
                editable: true,
                key: "provider_amount",
                render: (text, record) => {
                    return <span title="Amount">{record?.total_amount}</span>;
                },
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                key: "provider_opertaion",
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <span title="...." className="d-flex d-sm-inline justify-content-around">
                            <span className='cursor_point' onClick={() => { this.payout_detail(record._id, record?.total_amount) }}><Icon type="eye" theme="twoTone" twoToneColor="#52c41a" className='f_25' /></span>
                            {/* <span href="#" onClick={() => this.find_booking(record._id)}><Icon type="edit" theme="twoTone" twoToneColor="#52c41a" className='mx-3 f_25' /></span> */}
                            {/* <Popconfirm title="Sure to delete because may be under some more sub_category ?" onConfirm={() => this.delete_booking(record.key)}>
                                <Icon type="delete" theme="twoTone" twoToneColor="#52c41a" className='f_25' />
                            </Popconfirm> */}
                        </span>

                    ) : null,
            },
        ];
        const { dataSource } = this.state;
        return (
            <React.Fragment>
                <>
                    {/* <Row className="py-3">
                        <Col span={24}>
                            <RangePicker onChange={this.date_filter} />
                        </Col>
                    </Row> */}
                </>
                <>
                    <Modal
                        title="basic Payout details (all)"
                        visible={this.state.modalVisible}
                        onOk={this.handleOk}
                        onCancel={() => { this.setState({ modalVisible: false }) }}
                        footer={[]}
                    >
                        <Collapse accordion>
                            <Panel header={
                                <>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="align-items-center d-flex">
                                            <Icon className="px-3" type="bank" />
                                            Bank Details
                                        </div>
                                        <Tag visible={this.state.provider_data[0]?.booking_provider[0]?.payout_option == "mpesa" ? true : false} color="green">Provider Preferred</Tag>
                                    </div>
                                </>
                            } key="1">
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={12}>Name</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].name : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>Bank Name</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].bank_name : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>Branch Name</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].branch_name : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>Routing Name</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].routing_name : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>Account Name</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].account_name : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>Account Number</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].account_no : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>Ifsc Code</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].ifsc_code : '' : ""}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Panel>
                            <Panel header={
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="align-items-center d-flex">
                                        <Icon className="px-3" type="bank" />
                                        Mpesa Details
                                    </div>
                                    <Tag visible={this.state.provider_data[0]?.booking_provider[0]?.payout_option == "bank" ? true : false} color="green">Provider Preferred</Tag>
                                </div>} key="2">
                                <Row>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={12}>Frist Name</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].payout_frist_name : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>Second Name</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].payout_second_name : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>Kra Pin</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].kra_pin : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>M-PESA Phone Number</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].payout_phone : '' : ""}</Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>Payout ID</Col>
                                            <Col span={12}>:{this.state.provider_data[0] ? this.state.provider_data[0].booking_provider[0] ? this.state.provider_data[0].booking_provider[0].payout_id : '' : ""}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Panel>
                            <Panel header={<div className='d-flex align-items-center'><Icon className="px-3" type="wallet" />Payout Details</div>} key="3">
                                <Row>
                                    <Col span={16} style={{
                                        overflowY: 'scroll',
                                        height: '10em'
                                    }}>
                                        {this.state.provider_data.map(data => (
                                            <div className="d-flex justify-content-between px-1">
                                                <div className="bold">
                                                    {data.find_payout_booking[0] ?
                                                        data.find_payout_booking[0].booking_category[0] ?
                                                            data.find_payout_booking[0].booking_category[0].category_type === 1 ? data.find_payout_booking[0].booking_category[0].category_name
                                                                : data.find_payout_booking[0].booking_category[0].subCategory_name : '' : ''}
                                                </div>
                                                <div>
                                                    {data.amount}
                                                </div>
                                            </div>
                                        ))

                                        }
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <div className="d-flex justify-content-center">Total</div>
                                            <div className="d-flex justify-content-center m-4 bold">{this.state.provider_total}</div>
                                            <Button className="d-flex mx-auto" type="primary" onClick={this.payout_to_provider}>Done Payment</Button>

                                            {/* <Button className="d-flex mx-auto" type="primary" onClick={this.payout_to_provider(this.state.provider_data[0]?this.state.provider_data[0]._id:"")}>Done Payment</Button> */}
                                        </div>
                                    </Col>
                                </Row>
                            </Panel>
                        </Collapse>
                    </Modal>
                </>
                <div id="no-more-tables">
                    <Table
                        rowClassName={() => 'editable-row'}
                        rowKey={record => record._id}
                        className='table_shadow'
                        dataSource={dataSource}
                        columns={columns}
                        size="middle"
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange}
                        loading={this.state.loading}
                    />
                </div>
            </React.Fragment >
        );
    }
}

export default Form.create()(PayoutsTable);