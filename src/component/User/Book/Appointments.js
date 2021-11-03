import React, { Suspense, useMemo } from 'react'
import { Query } from "react-apollo";
import { My_APPOINTMENTS } from '../../../graphql/User/booking';
import { Badge, Tooltip, Row, Col, Card, Skeleton, Pagination,Icon } from 'antd';
import timer_icon from '../../../image/bookLater.png';

const AppiontmentsEmpty = React.lazy(() => import('./AppiontmentsEmpty'));

// export default  Appointments = (props) => {
function Appointments(props) {

    return (
        <Query
            query={My_APPOINTMENTS}
            variables={{
                limit: 10,
                page: props.page,
                _id: JSON.parse(localStorage.getItem('user'))._id,
                role: 1,
                booking_status: Number(props.status)
            }}
            fetchPolicy='no-cache'
            pollInterval={25000}
        >
            {({ loading, error, data, startPolling, stopPolling }) => {
                if (loading) return <Skeleton />;
                if (error) return `Error! ${error}`;
                console.log(data);
                const handleInfiniteOnLoad = (page, pagesize) => {
                    props.handleInfiniteOnLoad(page);
                }
                return (
                    <>
                        <Card
                            className="row m-0 booking_view booking_view_showdow"
                            extra={
                                <Pagination
                                    simple={true}
                                    current={props.page}
                                    onChange={(page) => { handleInfiniteOnLoad(page) }}
                                    total={data.get_my_appointments.pageInfo.totalDocs} />
                            }
                            title={props.heading}
                            loading={loading}>
                            {data.get_my_appointments.data.length > 0 ?
                                <>
                                    {data.get_my_appointments.data.map(data => (
                                        <Card.Grid className='p-1 w-100 col-12 col-sm-6 cursor_point'>
                                            <div className="" onClick={() => { props.view_booking(true, data._id) }}>
                                                <Row>
                                                    <Col xs={24} sm={24} className="d-flex justify-content-between">
                                                        <div className="d-block">
                                                            <div>{data.booking_ref}
                                                                {data?.booking_type === 2 && data?.booking_status === 10 ?
                                                                    <Tooltip placement="right" title='Booking Later'>
                                                                        <span className="primary_color mx-2">
                                                                            <img src={timer_icon} alt="" height='18' />
                                                                        </span>
                                                                    </Tooltip>
                                                                    : ""}
                                                                <Badge className="px-1" count={data?.user_msg_count} />
                                                            </div>
                                                            <div className="bold" style={{ fontSize: '16px' }}>
                                                                {data.booking_category[0]?.category_type === 1 ? data.booking_category[0]?.category_name : data.booking_category[0]?.subCategory_name}
                                                            </div>
                                                            <div className="m-0">
                                                                {data.booking_date}
                                                            </div>
                                                            <div className="primary_color">
                                                                {data.base_price}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <img style={{ borderRadius: '1em', boxShadow: '1px 1px 9px grey' }} height="90" width="100" alt='' src={data.booking_category[0]?.category_type === 1 ? data.booking_category[0]?.img_url : data.booking_category[0]?.booking_parent_category[0]?.img_url} />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card.Grid>
                                    ))
                                    }</> :
                                <>
                                    <Suspense fallback={<Skeleton />}>
                                        <AppiontmentsEmpty />
                                    </Suspense>
                                </>
                            }
                        </Card>
                    </>
                );
            }}
        </Query >
    )
};


export default React.memo(Appointments);