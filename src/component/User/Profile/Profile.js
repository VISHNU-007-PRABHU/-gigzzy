import React, { Suspense } from "react";
import 'antd/dist/antd.css';
import PhoneInput from 'react-phone-input-2';
import { Tooltip, Modal, Layout, Icon, Form, Input, Row, Col, Upload, message, Skeleton } from 'antd';
import '../../../scss/user.scss';

import { ADD_USER, USERS, UPDATE_IMG } from '../../../graphql/User/login';
import { client } from "../../../apollo";
import { Alert_msg } from "../../Comman/alert_msg";
import Address from "../Book/Address";
import { GoChevronRight } from "react-icons/go";
const { Content } = Layout;

const UserHeader = React.lazy(() => import('../Layout/UserHeader'));
const UserFooter = React.lazy(() => import('../Layout/UserFooter'));

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_profile_modal: false,
            change_password_modal: false,
            location_modal: false,
            user_data: {},
            detail: 0,
            pwd: 0,
            country_code: '',
            file: {},
            imageUrl: ''
        }
    }
    componentDidMount = async () => {
        // console.log(JSON.parse(localStorage.getItem('user')));
        this.fetch_user();
    }
    fetch_user = async () => {
        await client.query({
            query: USERS,
            variables: { _id: JSON.parse(localStorage.getItem('user'))._id },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.setState({ user_data: result.data.user[0] ? result.data.user[0] : [], country_code: result.data.user[0] ? result.data.user[0].country_code : "" });
        });
    }

    logout = () => {
        if (localStorage.getItem('userLogin') === 'success') {
            localStorage.removeItem('userLogin');
            localStorage.removeItem('user');
            this.props.history.push('/login');
        }
    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    handleChange = async info => {
        console.log(info);
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }

        if (info.file.status) {
            console.log(info.file.originFileObj);
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
            var user = localStorage.getItem('user');
            await client.mutate({
                mutation: UPDATE_IMG,
                variables: { _id: JSON.parse(user)._id, file: info.file.originFileObj },
            }).then(result => {
                Alert_msg(result.data.update_profile);
                if (result.data.update_profile.status === "success") {
                    var users = { ...JSON.parse(user), ...{ 'img_url': result.data.update_profile.img_url } }
                    localStorage.setItem('user', JSON.stringify(users));
                    this.setState({ imageUrl: result.data.update_profile.img_url, user_data: result.data.update_profile });
                }
            });
        }
    };


    update_user_detail = async () => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            var user = localStorage.getItem('user');
            var datas = {};
            if (!err) {
                var final_no = ''
                if (values.phone.length > 10) {
                    var phone = values.phone.split('+91');
                    if (phone[1].length === 11) {
                        final_no = phone[1].trim();
                    } else {
                        var phone_number = phone[1].split('-');
                        final_no = phone_number[0].trim() + phone_number[1].trim();
                    }

                    datas = { option: 'add', _id: JSON.parse(user)._id, name: values.name, email: values.email, phone_no: final_no, country_code: this.state.country_code };
                } else {
                    datas = {
                        option: 'add',
                        _id: JSON.parse(user)._id,
                        name: values.name,
                        email: values.email,
                        phone_no: this.state.user_data?.phone_no,
                        country_code: this.state.user_data?.country_code
                    };
                }

                await client.mutate({
                    mutation: ADD_USER,
                    variables: datas,
                }).then(result => {
                    console.log(result.data);
                    Alert_msg(result.data.addUser);
                    if (result.data.addUser.status === "success") {
                        var users = { ...JSON.parse(user), ...{ 'name': result.data.addUser.name, 'email': result.data.addUser.name, 'country_code': result.data.addUser.country_code, "phone_no": result.data.addUser.phone_no } }
                        localStorage.setItem('user', JSON.stringify(users));
                        this.setState({ edit_profile_modal: 0, detail: 0 });
                    }
                });

            }
        });
    }

    update_user_password = async () => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            var user = localStorage.getItem('user');
            console.log(values);
            if (values.new_password === values.old_password) {
                if (!err) {
                    await client.mutate({
                        mutation: ADD_USER,
                        variables: { option: 'add', _id: JSON.parse(user)._id, password: values.new_password },
                    }).then(result => {
                        console.log(result.data);
                        Alert_msg(result.data.addUser);
                        if (result.data.addUser.status === "success") {
                            var users = { ...JSON.parse(user), ...{ 'password': result.data.addUser.password } }
                            localStorage.setItem('user', JSON.stringify(users));
                            this.setState({ change_password_modal: 0, pwd: 0 });
                        }
                    });

                }
            } else {
                Alert_msg({ msg: "Please check the password", status: "failed" });
            }
        });
    }
    render() {
        const { user_data } = this.state;
        const { form } = this.props;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <Layout className="white" style={{ minHeight: '100vh' }}>
                <Suspense fallback={<Skeleton active />}>
                    <UserHeader />
                </Suspense>
                <Content className="px-1">
                    <Row>
                        <Col lg={{ span: 20, offset: 2 }}>
                            <div id="section-1" className="why_jiffy position-relative pt-1">
                                <h2 className="bold mb-5 text-center">Profile</h2>
                                <Row className="profile_section jiffy_border p-4 d-flex align-items-center mb-4">
                                    <Col span={23} >
                                        <img className="profile_pic circle float-left mr-4 avatar_shadow" alt="" src={user_data ? user_data.img_url : ''} />
                                        <p className="larger_font_size m-0 pt-3 mb-2 ml-3">{user_data ? user_data.name : ''}</p>
                                        <p className="normal_font_size m-0 ml-3">{user_data ? user_data.email : ''}</p>
                                        <Modal okButtonProps={{ className: 'ok_btn' }} okText="Update" cancelButtonProps={{ className: 'd-none' }} title="Edit Profile" className="new_modal" centered visible={this.state.edit_profile_modal} onOk={this.update_user_detail} onCancel={() => this.setState({ edit_profile_modal: false, detail: 0 })}>
                                            <div className="edit_profile p-5">
                                                <div className="profile_img text-center col-12">
                                                    <Form.Item label="">
                                                        {form.getFieldDecorator('file', {
                                                            rules: [],
                                                            valuePropName: 'fileList',
                                                            getValueFromEvent: this.normFile,
                                                        })(
                                                            <Upload
                                                                name="avatar"
                                                                listType="picture-card"
                                                                className="avatar-uploader d-flex justify-content-center"
                                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                                showUploadList={false}
                                                                beforeUpload={this.beforeUpload}
                                                                onChange={this.handleChange}
                                                            >
                                                                {user_data ? <img src={user_data.img_url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                                            </Upload>

                                                        )}
                                                    </Form.Item>
                                                </div>
                                                <div className="edit_inputs">
                                                    <Row>
                                                        <Col className="" lg={24}>
                                                            <Form.Item label="Full Name">
                                                                {form.getFieldDecorator("name", {
                                                                    rules: this.state.detail ? [{ required: true,message:"Enter Full Name" }] : [],
                                                                    initialValue: user_data ? user_data.name : ""
                                                                })(<Input className="input_border text-indent-zero" />)}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col className="" lg={24}>
                                                            <Form.Item label="Email">
                                                                {form.getFieldDecorator("email", {
                                                                    rules: this.state.detail ? [{ required: true,message:"Enter Email" }] : [],
                                                                    initialValue: user_data ? user_data.email : ""
                                                                })(<Input value={user_data ? user_data.email : ""} className="input_border text-indent-zero" />)}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={24}>
                                                            <Form.Item label="Mobile Number">
                                                                {form.getFieldDecorator("phone", {
                                                                    rules: this.state.detail ? [{ required: true, message: 'Enter Phone Number' }] : [],
                                                                    initialValue: user_data ? `+${user_data.country_code} ${user_data.phone_no}` : ""
                                                                })(<PhoneInput
                                                                    disabled
                                                                    searchStyle={{ backgroundColor: 'white' }}
                                                                    inputClass="input_border"
                                                                    buttonClass="input_border"
                                                                    inputStyle={{ height: '46px' }}
                                                                    defaultCountry={'in'}
                                                                    mask={{ in: '+ ..........' }}
                                                                    onChange={(value, data, event) => {
                                                                        this.setState({ country_code: data.dialCode });
                                                                    }} />
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Modal>
                                    </Col>
                                    <Col orientation="left" justify="end" span={1}>
                                        <div className="text-center cursor_point">
                                            <Tooltip title="Edit Your Profile">
                                                <Icon theme="filled" type="edit" onClick={() => { this.setState({location_modal:false,  edit_profile_modal: true, detail: 1 }) }} className="normal_font_size" />
                                            </Tooltip>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="jiffy_border mb-4 d-flex flex-wrap">
                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} className="settings_section p-4">
                                        <h4>Settings</h4>
                                        <p className="normal_font_size">Change your login password under this section.</p>
                                        <ul className="list-style-none p-0">
                                            <li onClick={() => { this.setState({ change_password_modal: true,location_modal:false, pwd: 1 }) }} className="d-flex align-items-center justify-content-between mb-2 normal_font_size cursor_point">
                                                Change Password
                                                <GoChevronRight />
                                            </li>
                                            <li onClick={() => { this.setState({ location_modal: true }) }} className="d-flex align-items-center justify-content-between mb-2 normal_font_size cursor_point">
                                                Manage Address
                                                <GoChevronRight />
                                            </li>
                                        </ul>
                                        <Modal okButtonProps={{ className: 'ok_btn' }} okText="Change Password" cancelButtonProps={{ className: 'd-none' }} title="Change Password" className="new_modal" centered visible={this.state.change_password_modal} onCancel={() => this.setState({ change_password_modal: 0, pwd: 0 })} onOk={this.update_user_password}>
                                            <div className="edit_profile p-5">
                                                <div className="edit_inputs">
                                                    <Row>
                                                        <Col className="" lg={24}>
                                                            <Form.Item label="New Password">
                                                                {form.getFieldDecorator("new_password", {
                                                                    rules: this.state.pwd ? [{ required: true,message:"Enter New Password" }] : []
                                                                })(<Input.Password className="input_border text-indent-zero" />)}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col className="" lg={24}>
                                                            <Form.Item label="Confirm Password">
                                                                {form.getFieldDecorator("old_password", {
                                                                    rules: this.state.pwd ? [{ required: true ,message:"Enter Confirm Password"}] : []
                                                                })(<Input.Password className="input_border text-indent-zero" />)}
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Modal>
                                    </Col>
                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} className="privacy_section p-4">
                                        <h4>Privacy Policy</h4>
                                        <p className="normal_font_size mb-4">it is a short explanation of what you are doing to observe visitors to your website.</p>
                                        <ul className="list-style-none p-0">
                                            <li className="d-flex align-items-center justify-content-between mb-2 normal_font_size cursor_point" onClick={() => { this.props.history.push('/static_page/about_us') }}>Help & Support <GoChevronRight /> </li>
                                            <li className="d-flex align-items-center justify-content-between mb-2 normal_font_size cursor_point" onClick={() => { this.props.history.push('/static_page/terms') }}>Terms & Conditions <GoChevronRight /> </li>
                                        </ul>
                                    </Col>
                                </Row>
                                <Row className="jiffy_border p-4 d-flex align-items-center mb-4">
                                    <Col span={23} className="logout_section">
                                        <h4>Logout</h4>
                                        <p className="normal_font_size m-0">You will be returned to the login screen.</p>
                                    </Col>
                                    <Col span={1} >
                                        <div className="text-center cursor_point" onClick={this.logout}>
                                            <Tooltip title="Logout">
                                                <Icon type="logout" className="normal_font_size" />
                                            </Tooltip>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Content>
                <Address visible={this.state.location_modal} />
                <Suspense fallback={<Skeleton active />}>
                    <UserFooter />
                </Suspense>
            </Layout>
        );
    }
}
export default Form.create()(Profile);