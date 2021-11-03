import * as React from "react";
import { withRouter } from "react-router-dom";
import { Table, Form, Switch, Rate } from "antd";
import { GET_REVIEW, UPDATE_BOOKING_DETAIL } from '../../../graphql/Admin/review';
import { client } from "../../../apollo";
import '../../../scss/template.scss';
import { Alert_msg } from '../../Comman/alert_msg';
import Search from "antd/lib/input/Search";

class ReviewTable extends React.Component {
    state = {
        modalVisible: false,
        dataSource: [],
        update_data: {},
        update: 0,
        loading: false,
        loading_img: false,
        imageUrl: '',
        file: {},
        previewVisible: false,
        previewImage: '',
        pagination: {
            pageSize: 10,
            total: 0,
            current: 1,
            simple: true,
        }
    }
    componentDidMount() {
        this.fetch_category({
            first: this.state.pagination.pageSize,
            after: this.state.pagination.cursor,
            data: { user_comments_status: 1, booking_status: [13, 14] }
        });
    }
    handleTableChange = async pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
        this.setState({ loading: true });

        await client.query({
            query: GET_REVIEW,
            variables: { limit: pager.pageSize, page: pager.current, data: { user_comments_status: 1, booking_status: [13, 14] } },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_review.pageInfo.totalDocs;
            pagination.current = result.data.get_review.pageInfo.page;
            console.log(pagination);
            this.setState({ pagination, loading: false, dataSource: result.data.get_review.data });
        });
    };

    showModal = () => {
        this.setState({ modalVisible: true });
    };

    closeModal = () => {
        this.setState({ modalVisible: false, update_data: {}, imageUrl: '' });
    };

    update_comments_status = async (id, value) => {
        var data = '';
        if (value) {
            data = 1;
        } else {
            data = 0;
        }
        await client.mutate({
            mutation: UPDATE_BOOKING_DETAIL,
            variables: { booking_id: id, user_comments_status: Number(data) },
        }).then((result, loading, error) => {
            Alert_msg(result.data.update_booking_details);
            if (result.data.update_booking_details.status === "success") {
                this.handleTableChange(this.state.pagination);
            }
        });
    };

    fetch_category = async (data) => {
        console.log("1");
        this.setState({ loading: true });
        await client.query({
            query: GET_REVIEW,
            variables: data,
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_review.pageInfo.totalDocs;
            this.setState({ loading: false, pagination, dataSource: result.data.get_review.data });
        });
    }

    onFilter_Ref = async (data) => {
        if (data.target.value) {
            this.fetch_category({
                first: this.state.pagination.pageSize,
                after: this.state.pagination.cursor,
                data: {
                    user_comments_status: 1, booking_status: [13, 14],
                    booking_ref:{$regex:'.*' +data.target.value+'.*' ,$options:'i'}
                }
            });
        } else {
            this.fetch_category({
                first: this.state.pagination.pageSize,
                after: this.state.pagination.cursor,
                data: { user_comments_status: 1, booking_status: [13, 14] }
            });
        }
    }

    render() {
        const columns = [
            {
                title: <span>Booking Ref</span>,
                dataIndex: 'category_name',
                width: '15%',
                render: (text, record) => {
                    return <span title="Booking Ref">{record.booking_ref}</span>;
                }
            },
            {
                title: <span>User</span>,
                dataIndex: 'description',
                render: (text, record) => {
                    return <span title="User">{record.booking_user[0] ? record.booking_user[0].name : ""}</span>;
                },
            },
            {
                title: <span>Rating</span>,
                dataIndex: 'is_parent',
                render: (text, record) => {
                    console.log(Number(record.user_rating));
                    return <span title="Rating">{<Rate disabled allowHalf="true" value={parseInt(record ? record.user_rating : 2)} />}</span>;
                },
            },
            {
                title: <span>Review</span>,
                render: (text, record) => {
                    return <span title="Review">{record.user_comments}</span>;
                }
            },
            {
                title: 'Status',
                width: '10%',
                dataIndex: 'operation',
                render: (text, record) => {
                    return <span title="...." className="d-flex d-sm-inline justify-content-around"> <Switch checkedChildren="View" unCheckedChildren="Hide" checked={record.user_comments_status} onChange={(value) => { this.update_comments_status(record._id, value) }} /> </span>
                }
            },
        ];

        return (
            <React.Fragment>
                <Search prefix={'#'} className='mb-3' size="large" placeholder="Search Booking Ref" onKeyUp={(event) => { this.onFilter_Ref(event) }} loading={false} />

                <div id="no-more-tables">
                    <Table
                        className='table_shadow'
                        pagination={this.state.pagination}
                        rowKey={record => record.id}
                        loading={this.state.loading}
                        dataSource={this.state.dataSource}
                        columns={columns}
                        onChange={this.handleTableChange}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default Form.create()(withRouter(ReviewTable));