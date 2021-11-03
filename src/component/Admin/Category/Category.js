
import React from "react";
import 'antd/dist/antd.css';
import '../../../scss/template.scss';
import AdminSider from '../Layout/AdminSider';
import AdminHeader from '../Layout/AdminHeader';
import CategoryTable from './Category_Tabels';
import { Layout, Tabs,Button } from 'antd';
import ParentCategory_Table from "./ParentCategory_Table";
const { Content } = Layout;
const { TabPane } = Tabs;
class Category extends React.Component {
    state = {
        collapsed: false,
    };

    onToggle = (val) => {
        console.log(val);
        this.setState({
            collapsed: val,
        });
    };

    render() {

        return (
            <Layout style={{ height: '100vh' }}>
                <AdminSider update_collapsed={this.state.collapsed} />
                <Layout>
                    <AdminHeader />
                    <Content className="main_frame">
                        <Tabs tabBarExtraContent={
                            <Button type="primary" onClick={() => { this.props.history.push('/admin-category/add'); }}>
                                Add Category
                          </Button>
                        }>
                            <TabPane tab="Category" key="1">
                                <CategoryTable />
                            </TabPane>
                            <TabPane tab="Parent Category" key="2">
                                <ParentCategory_Table />
                            </TabPane>
                        </Tabs>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}


export default Category;
