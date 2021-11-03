import React from 'react';
import * as bizUtil from 'bizcharts/lib/core';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
   
} from "bizcharts";
import {  EARNINGS_CHART } from '../../../graphql/Admin/dashboard';
import { client } from "../../../apollo";
import { Card } from 'antd';
import moment from 'moment';

bizUtil.setTheme('default');

class EarningChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: 1,
            dataSource: [],
            load: 0,
            cols: {
                value: {
                    min: 0
                },
                year: {
                    range: [0, 1]
                }
            },
        }
    }
    componentDidMount = async () => {
        this.fetch_data();
    }

    fetch_data = () => {
        this.setState({ load: 1 });
        client.query({
            query: EARNINGS_CHART,
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            var dataSource = [];
            if (result.data.get_earnings_chart.length > 0) {
                for (let i = 0; i < result.data.get_earnings_chart.length; i++) {
                    let option = { year: moment.months(result.data.get_earnings_chart[i]._id - 1), value: result.data.get_earnings_chart[i].total };
                    dataSource.push(option);
                }
            }
            this.setState({ dataSource, load: 0 })
        });
    }
    render() {
        const { dataSource, cols } = this.state;
        return (
            <div>
                <Card style={{ boxShadow: 'rgb(154, 176, 167) 0px 1px 6px 0px' }} title="Earnings Chart" bordered={false} className="earn">
                    <Chart height={400} data={dataSource} scale={cols} forceFit>
                        <Axis name="year" />
                        <Axis name="value" />
                        <Tooltip
                            crosshairs={{
                                type: "y"
                            }}
                        />
                        <Geom type="line" position="year*value" size={2} />
                        <Geom
                            type="point"
                            position="year*value"
                            size={4}
                            shape={"circle"}
                            style={{
                                stroke: "#fff",
                                lineWidth: 1
                            }}
                        />
                    </Chart>
                </Card>
            </div>
        );
    }
}
export default EarningChart;


