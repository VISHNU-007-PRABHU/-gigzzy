import React, { Suspense } from "react";
import { Layout, Row, Col, Skeleton } from "antd";
import { useQuery } from '@apollo/react-hooks';
import { USER_STATIC } from '../../graphql/Admin/static';
import { useLocation } from "react-router-dom";
import ReactQuill from 'react-quill';
const { Content } = Layout;

const UserHeader = React.lazy(() => import("../User/Layout/UserHeader"));
const UserFooter = React.lazy(() => import("../User/Layout/UserFooter"));

function StaticPage() {
    const location = useLocation();
    let url_path = location.pathname.split('/').pop() || ""
    const { loading, error, data } = useQuery(USER_STATIC, { variables: { page_code: url_path } });
    if (loading) return <Skeleton active />;
    if (error) return `Error! ${error.message}`;
    return (
        <Layout className="white" style={{ minHeight: "100vh" }}>
            <span className=" d-none d-md-block">
                <Suspense fallback={<Skeleton active />}>
                    <UserHeader />
                </Suspense>
            </span>
            <Content className="px-1">
                <Row>
                    <Col lg={{ span: 20, offset: 2 }}>
                        <div id="section-1" className="why_jiffy position-relative pt-1">
                            {data.static.map((values, i) => (<>
                                <h2 className="bold text-center">{values?.title}</h2>
                                <ReactQuill theme={"bubble"} className="cursor_point" readOnly={true} value={values?.description} ></ReactQuill>
                            </>))}
                        </div>
                    </Col>
                </Row>
            </Content>
            <span className=" d-none d-md-block">
                <Suspense fallback={<Skeleton active />}>
                    <UserFooter />
                </Suspense>
            </span>
        </Layout>
    )
}

export default StaticPage
