import React from 'react';
import { OTHERS_CHART } from '../../../graphql/Admin/dashboard';
import { client } from "../../../apollo";
import {  Card } from 'antd';
import { FaUsers, FaUsersCog } from "react-icons/fa";
import { GiTakeMyMoney,GiMoneyStack } from "react-icons/gi";


class Others extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: 1,
            data: [],
            load: 0,
            cols: {
                sold: { alias: 'count' },
                genre: { alias: 'Bookings' }
            },
        }
    }
    componentDidMount = async () => {
        this.fetch_data(this.state.option);
    }

    handleChange = (value) => {
        this.fetch_data(Number(value));
    }

    fetch_data = (option) => {
        this.setState({ load: 1 });
        client.query({
            query: OTHERS_CHART,
            variables: { option },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.setState({ data:result.data.get_others_chart })
        });
    }

    render() {
        const { data } = this.state;
        return (
            <div>

                <Card
                    className=""
                    hoverable
                    bordered={0}
                    style={{ boxShadow: 'rgb(154, 176, 167) 0px 1px 6px 0px' }}
                >
                    <div className="d-flex justify-content-between">
                        <FaUsers style={{ fontSize: '3em', marginTop: '5px', color: "#ff293dcc" }} />
                        <div className="d-block">
                            <div className="bold">
                                User
                            </div>
                            <div className="d-flex justify-content-end">
                                {data[0] ? data[0].user : 0}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card
                    className="mt-3"
                    hoverable
                    bordered={0}
                    style={{ boxShadow: 'rgb(154, 176, 167) 0px 1px 6px 0px' }}
                >
                    <div className="d-flex justify-content-between">
                        <FaUsersCog style={{ fontSize: '3em', marginTop: '5px', color: "#e47af0" }} />
                        <div className="d-block">
                            <div className="bold">
                               Provider
                            </div>
                            <div className="d-flex justify-content-end">
                                {data[0] ? data[0].provider : 0}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card
                    className="mt-3"
                    hoverable
                    bordered={0}
                    style={{ boxShadow: 'rgb(154, 176, 167) 0px 1px 6px 0px' }}
                >
                    <div className="d-flex justify-content-between">
                        <GiMoneyStack style={{ fontSize: '3em', marginTop: '5px', color: "#579afd" }} />
                        <div className="d-block">
                            <div className="bold">
                                Total Earns
                            </div>
                            <div className="d-flex justify-content-end">
                                {data[0] ? data[0].earning : 0}  
                            </div>
                        </div>
                    </div>
                     
                </Card>
                <Card
                    className="mt-3"
                    hoverable
                    bordered={0}
                    style={{ boxShadow: 'rgb(154, 176, 167) 0px 1px 6px 0px' }}
                >
                    <div className="d-flex justify-content-between">
                        <GiTakeMyMoney style={{ fontSize: '3em', marginTop: '5px', color: "#5dcb79" }} />
                        <div className="d-block">
                            <div className="bold">
                               Revenue
                            </div>
                            <div className="d-flex justify-content-end">
                                {data[0] ? data[0].revenue : 0}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}
export default Others;


