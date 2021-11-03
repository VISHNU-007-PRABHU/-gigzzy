import React, { Suspense } from "react";
import { LocationContext } from '../../context/Location'
import 'antd/dist/antd.css';
import { Rate, Statistic, Spin, Skeleton, DatePicker, Collapse, Modal, Layout, Icon, Form, Button, Row, Col, Upload } from 'antd';
import { FIND_CATEGORY, FIND_SUBCATEGORY } from '../../../graphql/User/home_page';
import htmlToText from 'html-to-text';
import { ADD_BOOKING, ACCEPT_JOB_MSG } from '../../../graphql/User/booking';
import gql from 'graphql-tag';
import { client } from "../../../apollo";
import '../../../scss/user.scss';
import { Alert_msg } from '../../Comman/alert_msg';
import GoogleMapReact from 'google-map-react';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { IoIosAlbums } from "react-icons/io";
import Geocode from "react-geocode";
import moment from "moment";
import Payment from "./Payment";
import Address from "./Address";
import MinImage from "./MinImage";
import DescriptionValue from "./DescriptionValue";
const { Content } = Layout;
const { Panel } = Collapse;
const { Countdown } = Statistic;
const UserHeader = React.lazy(() => import('../Layout/UserHeader'));

const SEND_ACCEPT_MSG = gql`
subscription SENDACCEPTMSG($_id:ID,$booking_id:ID){
    send_accept_msg (_id:$_id,booking_id:$booking_id){
      _id
      status
      description
      booking_ref
      booking_date
      base_price
      extra_price
      payment_type
      mpeas_payment_callback
      ctob_shotcode
      ctob_billRef
      booking_category {
        category_name
        category_type
        subCategory_name
        booking_parent_category {
          category_name
        }
      }
      booking_provider {
          _id
          name
          lat
          lng
          img_url
          rating
          provider_rate{
                rating
            }
      }
    }
}`

function createMapOptions(maps) {
    // next props are exposed at maps
    // "Animation", "ControlPosition", "MapTypeControlStyle", "MapTypeId",
    // "NavigationControlStyle", "ScaleControlStyle", "StrokePosition", "SymbolPath", "ZoomControlStyle",
    // "DirectionsStatus", "DirectionsTravelMode", "DirectionsUnitSystem", "DistanceMatrixStatus",
    // "DistanceMatrixElementStatus", "ElevationStatus", "GeocoderLocationType", "GeocoderStatus", "KmlLayerStatus",
    // "MaxZoomStatus", "StreetViewStatus", "TransitMode", "TransitRoutePreference", "TravelMode", "UnitSystem"
    return {
        zoomControlOptions: {
            position: maps.ControlPosition.RIGHT_CENTER,
            style: maps.ZoomControlStyle.SMALL
        },
        mapTypeControlOptions: {
            position: maps.ControlPosition.TOP_RIGHT
        },
        mapTypeControl: false,
        zoomControl: false,
        MaxZoomStatus: false
    };
}

class Description extends React.Component {
    static defaultProps = {
        center: {
            lat: 9.9619289, lng: 78.1288218
        },
        zoom: 11
    };

    setLocationModal(location_modal) {
        this.setState({ location_modal });
    }
    setLaterModal(book_later_modal) {
        this.setState({ location_modal: 0, book_later_modal });
    }
    setRequestingModal = async (book_requesting_modal) => {
        if (book_requesting_modal === false) {
            await client.mutate({
                mutation: ACCEPT_JOB_MSG,
                variables: { booking_status: 11, booking_id: this.state.add_booking[0].id, role: 1, },
                fetchPolicy: 'no-cache',
            }).then(result => {
                console.log(result);
                if (result.data?.manage_booking[0]?.status === "success") {
                    Alert_msg({ msg: "Job Booking Cancel Success", status: "success" });
                } else {
                    Alert_msg({ msg: "Job Booking Cancel Failed", status: "failed" });
                }
            });
        }
        this.setState({ book_requesting_modal });
    }
    setConfirmJobModal = async (confirm_job_modal) => {
        if (confirm_job_modal === false) {
            await client.mutate({
                mutation: ACCEPT_JOB_MSG,
                variables: { booking_status: 11, booking_id: this.state.accept_data._id, role: 1, },
                fetchPolicy: 'no-cache',
            }).then(result => {
                console.log(result);
                if (result.data.manage_booking[0].status === "success") {
                    Alert_msg({ msg: "Job Booking Cancel Success", status: "success" });
                } else {
                    Alert_msg({ msg: "Job Booking Cancel Failed", status: "failed" });
                }
            });
        }
        this.setState({ confirm_job_modal });
    }
    setPayModal(accept_pay_modal) {
        this.setState({ accept_pay_modal });
    }

    short_description;
    constructor(props) {
        super(props);
        this.state = {
            location_modal: false,
            file_upload_modal: 0,
            book_later_modal: false,
            book_requesting_modal: false,
            confirm_job_modal: false,
            accept_pay_modal: false,
            accept_pay_stripe: false,
            address: '',
            center: [9.9619289, 78.1288218],
            zoom: 15,
            draggable: true,
            lat: 9.9619289,
            lng: 78.1288218,
            i: 0,
            label: [],
            fileList: [],
            user_file: [],
            add_booking: [],
            location: 'Location',
            deadline: 0,
            booking_status: 12,
            accept_data: {},
            booking_category: [],
            accept_provider: [],
            user: {},
            errorMessage: '',
            date: "",
            time: "0",
            hour: "0",
            loading: 0,
            showIcon: {
                showRemoveIcon: true,
                showPreviewIcon: true,
                showDownloadIcon: false,
            },
            description_loading: 0,
            short_description: [],
            str: '#@image@#',
            description: "I need a handyman for #@half a day ( up to 4 hours ),a full day ( up to 8 hours )@# to #@assemble furniture,fix things,do odd jobs@# #@description@# here are some photos #@image@# at #@location@#"
        }
    }


    componentDidMount = async () => {

        console.log(this.props.location);
        this.setState({ user: JSON.parse(localStorage.getItem('user')).name });
        Geocode.setApiKey("AIzaSyDYRYnxipjEBUNazDUwUa_8BDvm8ON7TIk");
        await Geocode.fromLatLng(this.props.location.state.location[0], this.props.location.state.location[1]).then(
            response => {
                const address = response.results[0].formatted_address;
                this.setState({ address });
                // console.log(address);
            },
            error => { console.error(error); })
        this.setState({
            lat: this.props.location.state.location[0],
            lng: this.props.location.state.location[1],
            location: this.props.location.state.location_detail,
            center: [this.props.location.state.location[0], this.props.location.state.location[1]]
        })
        if (this.props.location.state.type === 1) {
            this.find_category(this.props.match.params.id, this.props.location.state.type);
        } else {
            this.find_sub_category(this.props.match.params.id, this.props.location.state.type);
        }
    }
    onChange = (date, dateString) => {
        console.log(dateString);
        if (dateString !== undefined && dateString !== null && dateString !== '') {
            var data = dateString.split(' ');
            var hour = data[1].split(':');
            this.setState({ date: data[0], time: data[1], hour: hour[0] });
        } else {
            this.setState({ data: "", time: "", hour: "" });
        }

    }
    onOk(value) {
        console.log(moment(value));
    }
    DontReadTheComments = async (b_id) => {
        console.log(b_id);
        var that = this;
        await client.subscribe({
            query: SEND_ACCEPT_MSG,
            variables: { _id: JSON.parse(localStorage.getItem('user'))._id, booking_id: b_id },
        }).subscribe({
            next(data, loading, error) {

                if (loading) {
                    console.log('load');
                }
                if (data) {
                    console.log(data.data.send_accept_msg.booking_provider);
                    that.setState({ book_requesting_modal: 0, booking_status: 9, confirm_job_modal: 1, booking_category: data.data.send_accept_msg.booking_category, accept_data: data.data.send_accept_msg, accept_provider: data.data.send_accept_msg.booking_provider });
                }

            }
        });
    };
    handleChange_error = ({ error }) => {
        if (error) {
            this.setState({ errorMessage: error.message });
        }
    };

    handleSubmit = (evt) => {
        evt.preventDefault();
        if (this.props.stripe) {
            this.props.stripe.createToken({ name: 'vishnu' }).then(({ token }) => {
                console.log('Received Stripe token:', token);
            });
        } else {
            console.log("Stripe.js hasn't loaded yet.");
        }
    };
    find_category = async (_id, type) => {
        this.setState({ description_loading: 1 });
        await client.query({
            query: FIND_CATEGORY,
            variables: { _id },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result.data.category[0].description);
            this.setState({ description: result.data.category[0].description, short_description: result.data.category[0].description.split("#"), description_loading: 0 });
        });
    }

    find_sub_category = async (_id, type) => {
        this.setState({ description_loading: 1 });
        await client.query({
            query: FIND_SUBCATEGORY,
            variables: { _id },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.setState({ description: result.data.sub_category[0].description, short_description: result.data.sub_category[0].description.split("#"), description_loading: 0 });
        });
    }

    onCircleInteraction = async (childKey, childProps, mouse) => {
        // function is just a stub to test callbacks
        this.setState({
            draggable: false,
            lat: mouse.lat,
            lng: mouse.lng
        });
        Geocode.setApiKey("AIzaSyDYRYnxipjEBUNazDUwUa_8BDvm8ON7TIk");
        // Get address from latidude & longitude.
        await Geocode.fromLatLng(mouse.lat, mouse.lng).then(
            response => {
                const address = response.results[0].formatted_address;
                this.setState({ address, location: address });
                // console.log(address);
            },
            error => {
                console.error(error);
            })

        // console.log('onCircleInteraction called with', childKey, childProps, mouse);
    }
    onCircleInteraction3 = (childKey, childProps, mouse) => {
        this.setState({ draggable: true });
        // function is just a stub to test callbacks  
        console.log('onCircleInteraction called with', childKey, childProps, mouse);
    }
    map_onChange = ({ center, zoom }) => {
        this.setState({
            center: center,
            zoom: zoom,
        });
    }


    handleChange1 = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        console.log(address);
        this.setState({ address, location: address });
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.setState({ lat: latLng.lat, lng: latLng.lng, center: [latLng.lat, latLng.lng] }))
            .catch(error => console.error('Error', error));
    };

    value_change = async (e) => {
        console.log(e);
    }
    change_label = async (fill_first, index) => {
        this.setState({ location_modal: 0 });
        var current_index = fill_first.indexOf(this.state.label[index]);
        var new_index = current_index + 1;
        const { label } = this.state;
        label[index] = fill_first[new_index];
        this.setState({ label });
    }
    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => { this.setState({ fileList }) };

    book_now = async () => {
        this.setState({ location_modal: 0 });
        var file_data = [];
        for (let i = 0; i < this.state.fileList.length; i++) {
            file_data.push(this.state.fileList[i].originFileObj);
        }
        let tag_change = document.getElementById('tag_change').outerHTML;
        let tag = document.getElementById('ee').outerHTML;
        tag = tag.replace(tag_change, this.state.str);
        const description = htmlToText.fromString(tag.toString(), { wordwrap: 130 });
        if (localStorage.getItem("userLogin") === "success") {
            this.setState({ loading: 1 });
            await client.mutate({
                mutation: ADD_BOOKING,
                variables: {
                    booking_status: 12,
                    booking_type: 1,
                    lat: parseFloat(this.state.center[0]),
                    lng: parseFloat(this.state.center[1]),
                    description: description,
                    category_id: this.props.match.params.id,
                    category_type: this.props.location.state.type,
                    user_id: JSON.parse(localStorage.getItem('user'))._id,
                    file: file_data
                },
            }).then((result, loading, error) => {
                this.setState({ loading: 0 });
                console.log(result);
                // Alert_msg(result.data.add_booking);
                if (result.data.add_booking[0].id !== undefined && result.data.add_booking[0].id !== null) {
                    this.setState({ description, book_requesting_modal: 1, add_booking: result.data.add_booking, deadline: moment().add(2, 'minutes') });
                    this.DontReadTheComments(result.data.add_booking[0].id);
                }
            });

        } else {
            Alert_msg({ msg: "Sorry Login User Only Book The Job !", status: "success" })
            this.props.history.push({ pathname: `/login` });
        }
    }

    book_later = async () => {
        var file_data = [];
        for (let i = 0; i < this.state.fileList.length; i++) {
            file_data.push(this.state.fileList[i].originFileObj);
        }
        let tag_change = document.getElementById('tag_change').outerHTML;
        let tag = document.getElementById('ee').outerHTML;
        tag = tag.replace(tag_change, this.state.str);
        const description = htmlToText.fromString(tag.toString(), { wordwrap: 130 });
        if (this.state.date === '' || this.state.time === '' || this.state.hour === '') {
            Alert_msg({ msg: "Choose select date & time", status: "failed" });
            return 0;
        }
        if (localStorage.getItem("userLogin") === "success") {
            this.setState({ loading: 1 });
            await client.mutate({
                mutation: ADD_BOOKING,
                variables: {
                    booking_status: 12,
                    booking_type: 2,
                    lat: parseFloat(this.state.center[0]),
                    lng: parseFloat(this.state.center[1]),
                    description: description,
                    category_id: this.props.match.params.id,
                    category_type: this.props.location.state.type,
                    user_id: JSON.parse(localStorage.getItem('user'))._id,
                    booking_date: this.state.date,
                    booking_time: this.state.time,
                    booking_hour: this.state.hour
                },
            }).then(result => {
                this.setState({ loading: 0 });
                // console.log(result); 
                // Alert_msg(result.data.add_booking);
                if (result.data.add_booking[0].id !== undefined && result.data.add_booking[0].id !== null) {
                    this.setState({ book_later_modal: 0, book_requesting_modal: 1, add_booking: result.data.add_booking, deadline: moment().add(2, 'minutes') });
                    this.DontReadTheComments(result.data.add_booking[0].id);
                }
            });


        } else {
            Alert_msg({ msg: "Sorry Login User Only Book The Job !", status: "success" })
            this.props.history.push({ pathname: `/login` });
        }
    }
    onFinish_job = async () => {
        if (this.state.booking_status === 12) {
            this.setState({ book_requesting_modal: 0 });
            Alert_msg({ msg: "Provider is Not available now", status: "failed" });
        }

    };

    disabledDate = (current) => {
        let customDate = moment().subtract(1, 'day');
        return current && current < moment(customDate, "YYYY-MM-DD");
    }

    on_location_change = (item) => {
        // console.log(item);
        this.setState({ location: item.address, center: [item.lat, item.lng], location_modal: 0 });
    }


    render() {
        // console.log(this.state.accept_provider[0]?.provider_rate[0]?.rating);
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                Upload
            </div>
        );


        return (
            <LocationContext.Provider value={{
                state: this.state,
                location_change: this.on_location_change,
            }}>
                <Layout className="white">
                    <Suspense fallback={<Skeleton active />}>
                        <UserHeader />
                    </Suspense>

                    <h2 className="bold mb-5 text-center">What do you need?</h2>

                    <Content className="px-1 description_page container user_select">
                        <Row>
                            <Col lg={{ span: 20, offset: 2 }}>
                                <div id="section-1" className="need position-relative pt-1">
                                    <Row>
                                        <Skeleton loading={this.state.description_loading} active >
                                            <Col span={24} className="dynamic_description" id="ee">
                                                {this.state.short_description.map((value, index) => {

                                                    if (value.substr(0, 1) === "@") {
                                                        if (value === "@description@") {
                                                            return <div key={index} placeholder=" + description " className="description description_font_size mr-1" contentEditable="true"></div>
                                                        }
                                                        else if (value === "@image@") {
                                                            return <div id="tag_change" className="tag_change d-inline-flex mb-3 mr-3">
                                                                <Button key={index} type="primary" onClick={() => { this.setState({ location_modal: 0, file_upload_modal: 1 }) }} className="mr-0 img_btn a_hover" icon={this.state.fileList.length > 0 ? 'check-circle' : 'camera'}></Button>
                                                                <MinImage img={this.state.fileList} />
                                                            </div>
                                                        }
                                                        else if (value === "@location@") {
                                                            return <Button key={index} type="primary" onClick={() => { this.setState({ location_modal: 1 }) }} className="location_btn a_hover w-auto" icon="environment">{this.state.location}</Button>
                                                        }
                                                        else {
                                                            var fill_data = value.slice(1, -1);
                                                            var fill_first = fill_data.split(',');
                                                            if (typeof this.state.label[index] === "undefined") {
                                                                this.state.label[index] = fill_first[0];
                                                            }
                                                            return <label key={index} className="filler a_hover" onClick={() => { this.change_label(fill_first, index) }} data-current={fill_first[0]} data={fill_first}>{this.state.label[index]}</label>
                                                        }
                                                    }
                                                    else {
                                                        return <label key={index} className="description_font_size">{value}<span>&nbsp;</span></label>
                                                    }

                                                })}
                                            </Col>
                                        </Skeleton>

                                        <Address
                                            visible={this.state.location_modal}
                                        />

                                        <Modal title="Upload Your Image" footer={<></>} className="new_modal upload_img" centered visible={this.state.file_upload_modal} onOk={() => this.setState({ file_upload_modal: false })} onCancel={() => this.setState({ file_upload_modal: false })}>
                                            <div className={fileList.length === 0 ? "clearfix upload_content" : "clearfix"} >
                                                <Upload
                                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                    listType="picture-card"
                                                    fileList={fileList}
                                                    multiple={true}
                                                    onPreview={this.handlePreview}
                                                    onChange={this.handleChange}
                                                    showUploadList={this.state.showIcon}
                                                >
                                                    {uploadButton}
                                                </Upload>
                                                <Button onClick={() => this.setState({ file_upload_modal: false })} className={fileList.length > 0 ? 'btnn' : 'd-none'}>Done</Button>
                                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                    <img alt="example" className='object_fit' style={{ width: '100%', height: "500px" }} src={previewImage} />
                                                </Modal>

                                            </div>
                                        </Modal>

                                        <Modal okButtonProps={{ disabled: true, className: 'd-none' }} cancelButtonProps={{ className: 'cancel_btn' }} title="Requesting Job" className="new_modal" centered visible={this.state.book_requesting_modal} onOk={() => this.setRequestingModal(false)} onCancel={() => { this.setRequestingModal(false) }}>

                                            <div className="job_description">
                                                <DescriptionValue data={this.state.add_booking[0]?.description} img={this.state.add_booking[0]?.user_image_url} />
                                            </div>
                                            <div className={this.state.book_requesting_modal === 1 ? "loader" : ""} >
                                                <div className="loaderBar"></div>
                                            </div>
                                            <div className="price_section text-center">
                                                <p className="price">{this.state.add_booking[0] ? this.state.add_booking[0].category[0] ? this.state.add_booking[0].category[0].base_price : 'price is not fixed' : "error"}</p>
                                                <label className="normal_font_size">Base Price</label>
                                            </div>
                                            <div style={{ height: '200px', width: '100%' }}>
                                                <GoogleMapReact
                                                    bootstrapURLKeys={{ key: 'AIzaSyDYRYnxipjEBUNazDUwUa_8BDvm8ON7TIk' }}
                                                    center={{
                                                        lat: this.state.add_booking[0]?.location.coordinates[1],
                                                        lng: this.state.add_booking[0]?.location.coordinates[0]
                                                    }}
                                                    defaultZoom={18}
                                                    options={createMapOptions}
                                                >
                                                    <div
                                                        className="place"
                                                        lat={this.state.add_booking[0]?.location.coordinates[1]}
                                                        lng={this.state.add_booking[0]?.location.coordinates[0]}>
                                                        <img src={require("../../../image/pin_location.png")} alt="your Place" />
                                                    </div>
                                                </GoogleMapReact>
                                            </div>
                                            {this.state.booking_status === 12 ?
                                                <Countdown className="coutdown mt-n4" value={this.state.deadline} format="mm:ss" onFinish={this.onFinish_job} /> : ''
                                            }
                                        </Modal>
                                        <Modal okButtonProps={{ className: 'jiffy_btn white-text' }} okText="Confirm Job" cancelButtonProps={{ className: 'jiffy_btn' }} title="Requesting Job" visible={this.state.confirm_job_modal} className="new_modal" centered onOk={() => this.setPayModal(true)} onCancel={() => this.setConfirmJobModal(false)}>

                                            <div className="job_description">
                                                <DescriptionValue data={this.state.add_booking[0]?.description} img={this.state.add_booking[0]?.user_image_url} />
                                            </div>
                                            <div className="price_section text-center">
                                                <p className="price">
                                                    {this.state.add_booking[0] ? this.state.add_booking[0].category[0] ? this.state.add_booking[0].category[0].base_price : 'price is not fixed' : "error"}
                                                </p>
                                                <label className="normal_font_size">Base Price</label>
                                            </div>
                                            <div style={{ height: '200px', width: '100%' }}>
                                                <GoogleMapReact
                                                    bootstrapURLKeys={{ key: 'AIzaSyDYRYnxipjEBUNazDUwUa_8BDvm8ON7TIk' }}
                                                    defaultCenter={this.props.center}
                                                    defaultZoom={this.props.zoom}
                                                    options={createMapOptions}
                                                >
                                                    <div
                                                        className="place"
                                                        lat={this.state.accept_provider[0] ? this.state.accept_provider[0].lat : ""}
                                                        lng={this.state.accept_provider[0] ? this.state.accept_provider[0].lng : ""}>
                                                        <img src={require("../../../image/pin_location.png")} alt="your Place" />
                                                    </div>
                                                </GoogleMapReact>
                                            </div>
                                            <div className="profile text-center liftup">
                                                <img alt="" src={this.state.accept_provider[0] ? this.state.accept_provider[0].img_url : 'asd'} />
                                                <p className="normal_font_size mt-3 bold">{this.state.accept_provider[0] ? this.state.accept_provider[0].name : 'as'}</p>
                                                <Rate allowHalf disabled value={this.state.accept_provider[0] ? Number(this.state.accept_provider[0].provider_rate[0].rating) : 0} />

                                            </div>
                                        </Modal>
                                        <Modal okButtonProps={{ className: '' }} okText="Accept and Pay" cancelButtonProps={{ className: 'd-none' }} title="Accept and Pay" className="new_modal" centered visible={this.state.accept_pay_modal} footer={<></>} onOk={() => this.setPayModal(false)} onCancel={() => { this.setState({ accept_pay_modal: 0 }) }}>
                                            <div className="price_section px-3 pt-4 pb-3 d-flex">
                                                <div className="">
                                                    <p className="m-0 normal_font_size bold">{JSON.parse(localStorage.getItem('user')).name}</p>
                                                    <label className="normal_font_size">{this.state.booking_category[0] ?
                                                        this.state.booking_category[0].category_type === 1 ?
                                                            this.state.booking_category[0].category_name : this.state.booking_category[0].subCategory_name : ""}</label>
                                                </div>
                                                <p class="ml-auto price">{this.state.accept_data ? this.state.accept_data.base_price : ''}</p>
                                            </div>
                                            <div className="price_section px-3 d-flex pt-4 btc">
                                                <p className="m-0 normal_font_size ">Booking Ref</p>
                                                <label class="ml-auto">{this.state.accept_data ? this.state.accept_data.booking_ref : ''}</label>
                                            </div>
                                            <div className="price_section px-3 d-flex  pb-4 bbc">
                                                <p className="m-0 normal_font_size ">Date</p>
                                                <label class="ml-auto">{this.state.accept_data ? this.state.accept_data.booking_date : ''}</label>
                                            </div>
                                            <div className="px-3 pt-3 normal_font_size bold d-flex justify-content-between my-2">
                                                <div>Task</div>
                                                <div>{this.state.booking_category[0] ?
                                                    this.state.booking_category[0].category_type === 1 ?
                                                        this.state.booking_category[0].category_name : this.state.booking_category[0].subCategory_name : ""}</div>
                                            </div>
                                            <div className="price_section px-3 d-flex">
                                                <p className="m-0 normal_font_size ">Base Price</p>
                                                <label class="ml-auto">{this.state.accept_data ? this.state.accept_data.base_price : ''}</label>
                                            </div>
                                            {/* <div className="price_section px-3 d-flex">
                                                <p className="m-0 normal_font_size ">Others</p>
                                                <label class="ml-auto">{this.state.accept_data ? this.state.accept_data.extra_price : ''}</label>
                                            </div> */}

                                            <div className="profile text-center">
                                                <img alt="" src={this.state.accept_provider[0] ? this.state.accept_provider[0].img_url : ''} />
                                                <p className="normal_font_size mt-3 bold">{this.state.accept_provider[0] ? this.state.accept_provider[0].name : ''}</p>
                                                <Rate allowHalf disabled value={this.state.accept_provider[0] ? Number(this.state.accept_provider[0].provider_rate[0].rating) : 0} />
                                            </div>
                                            <div className="price_section px-3 d-flex justify-content-center">
                                                <Payment data={this.state.accept_data} />
                                            </div>
                                        </Modal>
                                        <Modal okButtonProps={{ className: 'ok_btn' }} okText="Book" cancelButtonProps={{ className: 'd-none' }} title="Date and Time" className="new_modal" centered visible={this.state.book_later_modal} onOk={() => { this.book_later() }} onCancel={() => this.setLaterModal(false)}>
                                            <div className="price_section text-center">
                                                <DatePicker className='w-50' size='large' showTime use12Hours format='YYYY-MM-DD HH:mm:ss' placeholder="Select Date" disabledDate={this.disabledDate} onChange={this.onChange} onOk={this.onOk} />
                                            </div>
                                        </Modal>

                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center">
                            <Spin tip="Loading..." spinning={this.state.loading} size="large" />
                        </div>
                        <Row className="fixed_book_btn">
                            <Col sm={{ span: 4, offset: 7 }} xs={{ span: 9, offset: 2 }} className="">
                                <Button className="w-100 h-50x normal_font_size jiffy_btn" onClick={() => this.setLaterModal(true)}>
                                    Book Later
                                </Button>
                            </Col>
                            <Col sm={{ span: 4, offset: 1 }} xs={{ span: 9, offset: 2 }} className="">
                                <Button className="w-100 h-50x normal_font_size jiffy_btn primary-bg" onClick={() => this.book_now()}>
                                    Book Now
                                </Button>
                            </Col>
                        </Row>
                    </Content>
                </Layout >
            </LocationContext.Provider>
        );
    }
}
export default Form.create()(Description);


