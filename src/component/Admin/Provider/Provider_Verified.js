
import React from "react";
import { withRouter } from "react-router-dom";
import 'antd/dist/antd.css';
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import AdminSider from '../Layout/AdminSider';
import AdminHeader from '../Layout/AdminHeader';
import { Layout, Row, Col, Switch, Card, Carousel } from 'antd';
import { FIND_USER, PROVIDER_DOCUMENT_VERIFIED } from '../../../graphql/Admin/user';
import { Alert_msg } from '../../Comman/alert_msg';
import { client } from "../../../apollo";
import ProviderImg from './ProviderImg'
const { Content } = Layout;
class Provider_Verified extends React.Component {
    state = {
        collapsed: false,
        key: 'Document',
        loading: false,
        tabList: [
            {
                key: 'Document',
                tab: 'Document',
            },
        ],
        proof_status: 0,
        data: [],
    };

    componentDidMount() {
        if (this.props.match.params.id !== undefined) {
            this.fetch_find_user();
        }
    }

    fetch_find_user = async () => {
        this.setState({ loading: true });
        await client.query({
            query: FIND_USER,
            variables: { _id: this.props.match.params.id },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.setState({ loading: false, update: 1, proof_status: result.data.user[0].proof_status, data: result.data.user });
        })
    }

    onToggle = (val) => {
        console.log(val);
        this.setState({
            collapsed: val,
        });
    };


    provider_status = async (checked) => {

        var status = checked ? 1 : 0;
        checked ? this.setState({ proof_status: 1 }) : this.setState({ proof_status: 0 });
        await client.mutate({
            mutation: PROVIDER_DOCUMENT_VERIFIED,
            variables: {
                _id: this.props.match.params.id, proof_status: String(status)
            },
        }).then((result, loading, error) => {
            console.log(result);
            Alert_msg(result.data.provider_document_verified.info);
            if (result.data.provider_document_verified.info.status === "success") {
                this.props.history.push('/admin-provider');
            }
        });
    }

    render() {
        console.log(this.state.data);
        return (
            <Layout style={{ height: '100vh' }}>
                <AdminSider update_collapsed={this.state.collapsed} />
                <Layout>
                    <AdminHeader />
                    <Content className="main_frame">
                        <Row>
                            <Col span={24}>
                                <Card
                                    style={{ width: '100%' }}
                                    title="Provider Documents"
                                    extra={<Switch checkedChildren="verified" unCheckedChildren="pending" checked={this.state.proof_status === 0 ? 0 : 1} onChange={(checked) => { this.provider_status(checked) }} />}
                                >
                                    <Row gutter={12}>
                                        <Col lg={12} md={24}>
                                            <Card loading={this.state.loading} title="Identification Documents" bordered={false} style={{ borderRadius: "1em", boxShadow: "1px 1px 8px 0px" }}>
                                                {this.state.data[0] ?
                                                    <ProviderImg img={this.state.data[0]?.personal_document_url} />
                                                    : ''}
                                            </Card>
                                        </Col>
                                        <Col lg={12} md={24}>
                                            <Card loading={this.state.loading} title="Professional Document" bordered={false} style={{ borderRadius: "1em", boxShadow: "1px 1px 8px 0px" }}>
                                                {this.state.data[0] ?
                                                    <ProviderImg img={this.state.data[0]?.professional_document_url} />
                                                    : ''}
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}


export default withRouter(Provider_Verified);


