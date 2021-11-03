import React from "react";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import { Button, Row, Col, Card, Form, Input,message, Switch, Upload, Icon, Alert } from 'antd';
import { ADD_SETTING,GET_SETTING ,UPDATE_SITE_IMG} from '../../../graphql/Admin/static';
import { client } from "../../../apollo";
import { Alert_msg } from '../../Comman/alert_msg';

class SiteSettings extends React.Component {
    state = {
        collapsed: false,
        imageUrl: '',
        site_name: "",
        site_email: "",
        copyrights_content: "",
        playstore_link: "",
        appstore_link: "",
        contact_number: "",
        contact_email: "",
        site_currency: "",
        file: {},
        icon_loading:0,
        logo_loading:0,
    };
    onToggle = (val) => {
        console.log(val);
        this.setState({
            collapsed: val,
        });
    };

    componentDidMount=()=>{
        this.get_static_data();
    }

    get_static_data=async()=>{
        await client.query({
            query: GET_SETTING,
            fetchPolicy: 'no-cache',
        }).then(result => {
            // console.log(result);
            this.setState({
                site_name: result.data.site_setting_detail ? result.data.site_setting_detail.site_name:"",
                site_email: result.data.site_setting_detail ? result.data.site_setting_detail.site_email : "",
                copyrights_content: result.data.site_setting_detail ? result.data.site_setting_detail.copyrights_content : "",
                playstore_link: result.data.site_setting_detail ? result.data.site_setting_detail.playstore_link : "",
                appstore_link: result.data.site_setting_detail ? result.data.site_setting_detail.appstore_link : "",
                contact_number: result.data.site_setting_detail ? result.data.site_setting_detail.contact_number : "",
                contact_email: result.data.site_setting_detail ? result.data.site_setting_detail.contact_email : "",
                site_currency: result.data.site_setting_detail ? result.data.site_setting_detail.site_currency : "",
                img_logo: result.data.site_setting_detail ? result.data.site_setting_detail.site_logo : "",
                img_icon: result.data.site_setting_detail ? result.data.site_setting_detail.site_icon : "",
            });
        });
    }
    add_data = async () => {
        const { form } = this.props;
        var data = {}
        form.validateFields(async (err, values) => {
            console.log(values);
            if (values.site_name !== undefined) {
                data.site_name = values.site_name;
            }
            if (values.site_email !== undefined) {
                data.site_email = values.site_email;
            }
            if (values.copyrights_content !== undefined) {
                data.copyrights_content = values.copyrights_content;
            }
            if (values.playstore_link !== undefined) {
                data.playstore_link = values.playstore_link;
            }
            if (values.appstore_link !== undefined) {
                data.appstore_link = values.appstore_link;
            }
            if (values.contact_number !== undefined) {
                data.contact_number = values.contact_number;
            }
            if (values.contact_email !== undefined) {
                data.contact_email = values.contact_email;
            }
            if (values.site_currency !== undefined) {
                data.site_currency = values.site_currency;
            }

            await client.mutate({
                mutation: ADD_SETTING,
                variables: { ...data },
            }).then((result, loading, error) => {
                if(loading){
                    Alert("loading");
                }
                console.log(result);
                Alert_msg(result.data.add_site_detail);
            });
        });
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

    handleChange_logo = async info => {
        console.log(info);
        if (info.file.status === 'uploading') {
            this.setState({ logo_loading: true });
            return;
        }

        if (info.file.status) {
            console.log(info.file.originFileObj);
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    logo_loading: false,
                }),
            );
            await client.mutate({
                mutation: UPDATE_SITE_IMG,
                variables: { file: info.file.originFileObj,option:2 },
            }).then(result => {
                console.log("dsd");
                Alert_msg(result.data.update_site_img);
                if (result.data.update_site_img.status === "success") {
                    this.setState({img_logo:result.data.update_site_img.site_logo});
                }
            });
        }
    };

    handleChange_icon = async info => {
        // console.log(info);
        if (info.file.status === 'uploading') {
            this.setState({ icon_loading: true });
            return;
        }

        if (info.file.status) {
            // console.log(info.file.originFileObj);
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    icon_loading: false,
                }),
            );
            await client.mutate({
                mutation: UPDATE_SITE_IMG,
                variables: { file: info.file.originFileObj,option:1 },
            }).then(result => {
                Alert_msg(result.data.update_site_img);
                if (result.data.update_site_img.status === "success") {
                    this.setState({img_icon:result.data.update_site_img.site_icon });
                }
            });
        }
    };



    render() {
        const { form } = this.props;
        const logo_uploadButton = (
            <div>
                <Icon type={this.state.logo_loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const icon_uploadButton = (
            <div>
                <Icon type={this.state.icon_loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <>
                <Row gutter={[24,]}>
                    <Col lg={18} md={24}>
                        <Card title="General" bordered={false} extra={<Switch checkedChildren="Site is on Live.." unCheckedChildren="Site is on Maintanence.." defaultChecked />} style={{ boxShadow: "0px 2px 6px 0px #7fd3af" }}>
                            <Row>
                                <Col span={24}>
                                    <Form.Item label="Site Name">
                                        {form.getFieldDecorator("site_name", {
                                            rules: [],
                                            initialValue: this.state.site_name,
                                        })(<Input placeholder="Site Name" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Site Email">
                                        {form.getFieldDecorator("site_email", {
                                            rules: [],
                                            initialValue: this.state.site_email,
                                        })(<Input placeholder="Site Email" className="input_border" />)}
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item label="Copyright content">
                                        {form.getFieldDecorator("Copyright_content", {
                                            rules: [],
                                            initialValue: this.state.copyrights_content,
                                        })(<Input placeholder="Copyright content" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Playstore Link">
                                        {form.getFieldDecorator("Playstore_Link", {
                                            rules: [],
                                            initialValue: this.state.playstore_link,
                                        })(<Input placeholder="Playstore Link" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Appstore Link">
                                        {form.getFieldDecorator("Appstore_Link", {
                                            rules: [],
                                            initialValue: this.state.appstore_link,
                                        })(<Input placeholder="Appstore Link" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Contact Number">
                                        {form.getFieldDecorator("Contact_Number", {
                                            rules: [],
                                            initialValue: this.state.contact_number,
                                        })(<Input placeholder="Contact Number" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Contact Email">
                                        {form.getFieldDecorator("Contact_Email", {
                                            rules: [],
                                            initialValue: this.state.contact_email,
                                        })(<Input placeholder="Contact Email" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Site currency">
                                        {form.getFieldDecorator("Site_currency", {
                                            rules: [],
                                            initialValue: this.state.site_currency,
                                        })(<Input placeholder="Site currency" className="input_border" />)}
                                    </Form.Item>
                                </Col>
                                <Button type="primary" block onClick={this.add_data}>
                                    Update Setting
                                </Button>
                            </Row>
                        </Card>
                    </Col>
                    <Col lg={6} md={24}>
                        <Row gutter={[0, 12]}>
                            <Col span={24}>
                                <Card title="Site Logo" bordered={false} style={{ boxShadow: "0px 2px 6px 0px #7fd3af" }}>
                                    <Form.Item label="">
                                        {form.getFieldDecorator('file1', {
                                            rules: [{ required: false }],
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile,
                                        })(
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader img_upload_lg"
                                                showUploadList={false}
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                beforeUpload={this.beforeUpload}
                                                onChange={this.handleChange_logo}
                                            >
                                                {this.state.img_logo ? <img src={this.state.img_logo} alt="avatar" style={{ width: '100%' }} /> : logo_uploadButton}
                                            </Upload>

                                        )}
                                    </Form.Item>
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card title="Site Icon" bordered={false} style={{ boxShadow: "0px 2px 6px 0px #7fd3af" }}>
                                    <Form.Item label="">
                                        {form.getFieldDecorator('file2', {
                                            rules: [{ required: false }],
                                            valuePropName: 'fileList',
                                            getValueFromEvent: this.normFile,
                                        })(
                                            <Upload
                                                name="avatar"
                                                listType="picture-card"
                                                className="avatar-uploader img_upload_lg"
                                                showUploadList={false}
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                beforeUpload={this.beforeUpload}
                                                onChange={this.handleChange_icon}
                                            >
                                                {this.state.img_icon ? <img src={this.state.img_icon} alt="avatar" style={{ width: '100%' }} /> : icon_uploadButton}
                                            </Upload>

                                        )}
                                    </Form.Item>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </>
        );
    }
}


export default Form.create()(SiteSettings);
