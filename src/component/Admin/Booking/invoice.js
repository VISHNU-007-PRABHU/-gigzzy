
import React, { Suspense } from "react";
import { Icon, Tooltip, Tag } from "antd"
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import { client } from "../../../apollo";
import gql from 'graphql-tag';
import '../../../scss/template.scss';
import { GET_PARTICULAR_BOOKING } from '../../../graphql/User/booking';
import main from '../../../image/main.png';

const C2B_CONTENT = React.lazy(() => import('./C2B_CONTENT')); // Lazy-loaded

const payment_status = {
    0: "welcome Gizzy",
    50: "waiting for payment confirmation",
    10: "Base price paid",
    11: "Booking canceled",
    4: "Job started",
    13: "Ongoing",
    14: "Completed"
}


const SEND_ACCEPT_MSG = gql`
subscription SENDACCEPTMSG($_id:ID,$booking_id:ID){
    send_accept_msg (_id:$_id,booking_id:$booking_id){
      _id
      status
      booking_status
      payment_type
      mpeas_payment_callback
      base_price
      extra_price
      ctob_shotcode
      ctob_billRef
    }
}`
class Invoice extends React.Component {
    state = {
        currency_symbol: 'Ksh',
        collapsed: false,
        booking: [],
        booking_user: [],
        booking_provider: [],
        booking_category: [],
        booking_status: 0,
        payment_type: "",
        mpeas_payment_callback: false,
        base_price: "0.00",
        extra_price: "0.00",
        ctob_shotcode: "",
        ctob_billRef: "",

    };
    onToggle = (val) => {
        console.log(val);
        this.setState({
            collapsed: val,
        });
    };
    isMobile = () => {
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor || window.opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor || window.opera).substr(0, 4)))
    }
    componentDidMount() {
        console.log(this.isMobile());
        this.fetch_booking(this.props.match.params.id);
    }

    fetch_booking = (_id) => {
        client.query({
            query: GET_PARTICULAR_BOOKING,
            variables: { _id },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.current_booking_status(this.props.match.params.id)
            this.setState({
                booking: result.data.booking,
                booking_category: result.data.booking[0].booking_category,
                booking_user: result.data.booking[0].booking_user,
                booking_provider: result.data.booking[0].booking_provider,
                message: result.data.booking[0].get_booking_message,
                booking_status: result.data.booking[0].booking_status,
                payment_type: result.data.booking[0]?.payment_type || "",
                base_price: result.data.booking[0]?.base_price || "",
                extra_price: result.data.booking[0]?.extra_price || "",
                ctob_shotcode: result.data.booking[0]?.ctob_shotcode || "",
                ctob_billRef: result.data.booking[0]?.ctob_billRef || "",
                mpeas_payment_callback: result.data.booking[0]?.mpeas_payment_callback,
            })
        });
    }

    current_booking_status = async (b_id) => {
        console.log("Invoice -> current_booking_status -> b_id", b_id)
        var that = this;
        await client.subscribe({
            query: SEND_ACCEPT_MSG,
            variables: { _id: JSON.parse(localStorage.getItem('user'))._id, booking_id: b_id },
        }).subscribe({
            next(data, loading, error) {
                console.log("Invoice -> next -> error", error)
                if (loading) {
                    console.log('load');
                }
                if (data) {
                    console.log(data.data.send_accept_msg);
                    that.setState({
                        booking_status: data.data.send_accept_msg.booking_status,
                        payment_type: data.data.send_accept_msg?.payment_type || "",
                    });
                }

            }
        });
    };

    render() {
        const { ctob_billRef,ctob_shotcode,mpeas_payment_callback,base_price,extra_price,booking, booking_category, booking_provider, booking_user, payment_type, booking_status } = this.state;
        console.log("Invoice -> render -> booking_status", booking_status)
        console.log("Invoice -> render -> mpeas_payment_callback", mpeas_payment_callback)
        console.log("Invoice -> render -> payment_option", payment_type)

        return (
            <div className=" col-xs-12 col-md-12 col-sm-12 invoice_body_color  " >
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-6 main_content mx-lg-auto">
                    <div className="invoice_header mt-1">
                        <div className={this.isMobile() ? "d-none" : ""}>
                            <a href="/bookings">
                                <Tooltip placement="left" title="Back to Booking">
                                    <Icon className="ml-2 cursor_point" type="arrow-left" style={{ fontSize: "26px" }} />
                                </Tooltip>
                            </a>
                        </div>
                        <div>
                            <img src={main} alt={'gigzzy'} className='w-50x object_fit cursor_point' />
                        </div>
                        <div className="invoice_info">
                            <div>INVOICE NO <b>{booking[0] ? booking[0].booking_ref : ""}</b></div>
                            <div> <small>{booking[0] ? booking[0].booking_date : ""}</small></div>
                            <div className="py-2">
                                <Tag color="green">
                                    {payment_status[this.state.booking_status]}
                                </Tag>
                            </div>
                        </div>
                    </div>
                    <div className={ (booking_status == 50 || mpeas_payment_callback == true)  && payment_type == "c2b" ? "jumbotron p-1 mb-3 mx-3" : "d-none"}>
                        <Suspense fallback={
                            <div class="spinner-border text-success" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        }>
                            <C2B_CONTENT BusinessNumber={ctob_shotcode} AmountNumber={ctob_billRef} Amount={mpeas_payment_callback ? extra_price : base_price} />
                        </Suspense>
                    </div>
                    <div className="user_batch mx-3">
                        <p><b>{booking_user[0] ? booking_user[0].name : ""}</b></p>
                        <p>Thanks for using gigzzy</p>
                    </div>
                    <div className="total_fare">
                        <h5>TOTAL COST</h5>
                        <h1><small></small>{booking[0] ? booking[0].total : ""}</h1>
                        {/* <h6>TOTAL HOURS : asd</h6> */}
                    </div>
                    <div className="fare_estimation col-xs-12 col-md-12 col-sm-12 nopad d-print-block d-md-flex">
                        <div className="fare_breakup mr-sm-3">
                            <p className="title">Fare Breakup</p>
                            <ul>
                                <li>
                                    <label>Base Price</label>
                                    <span>{booking[0] ? booking[0].base_price : ""}</span>
                                </li>
                                {/* <li>
                                            <label>Hour Fare</label>
                                            <span>ad</span>
                                        </li> */}
                                <li>
                                    <label>Extra Price </label>
                                    <span>{booking[0] ? booking[0].extra_price : ""}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="tax_breakup ">
                            <p className="title">Service Breakup</p>
                            <ul>
                                <li>
                                    <label className="d-flex align-items-center">
                                        Service Fee
                                        <Tooltip placement="right" title={`${booking[0]?.service_fee} %`}>
                                            <Icon className="ml-2 cursor_point" type="info-circle" />
                                        </Tooltip>

                                        <span className="ml-auto">
                                            {booking[0] ? booking[0].admin_fee : ""}
                                        </span>
                                    </label>
                                </li>
                                {/* <li>
                                    <label>( added to your total fare)</label>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                    <div className="booking_details col-xs-12 col-md-12 col-sm-12">
                        <p className="title">Booking Details</p>
                        <ul>
                            <li>
                                <label>Service Type</label>
                                <span>{booking_category[0] ? booking_category[0].category_type === 1 ? booking_category[0].category_name : booking_category[0].subCategory_name : ''}</span>
                            </li>
                            <li>
                                <label>Booking Date</label>
                                <span>{booking[0] ? booking[0].booking_date : ""}</span>
                            </li>
                            <li>
                                <label>Scheduled Date</label>
                                <span>{booking[0] ? booking[0].booking_date : ""}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="member_section col-xs-12 col-md-12 col-sm-12 nopad d-print-block d-md-flex">
                        <div className="user_details mr-sm-3">
                            <p className="title">User Details</p>
                            <ul>
                                <li>
                                    <label>Name</label>
                                    <span>{booking_user[0] ? booking_user[0].name : ""}</span>
                                </li>
                                <li>
                                    <label>Email</label>
                                    <span>{booking_user[0] ? booking_user[0].email : ""}</span>
                                </li>
                                <li>
                                    <label>Phone</label>
                                    <span>{booking_user[0] ? booking_user[0].phone_number : ""}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="provider_details">
                            <p className="title">Provider Details</p>
                            <ul>
                                <li>
                                    <label>Name</label>
                                    <span>{booking_provider[0] ? booking_provider[0].name : ""}</span>
                                </li>
                                <li>
                                    <label>Email</label>
                                    <span>{booking_provider[0] ? booking_provider[0].email : ""}</span>
                                </li>
                                <li>
                                    <label>Phone</label>
                                    <span>{booking_provider[0] ? booking_provider[0].phone_number : ""}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="invoice_footer col-xs-12 m-3">
                        <hr />
                        <p>	Thanks,</p>
                        gigzzy Team
                    </div>
                </div>
            </div>
        );
    }
}

export default Invoice;
