import React from 'react'
import { Collapse, Icon, Skeleton } from 'antd'
import { useQuery } from '@apollo/react-hooks';
import { USER_STATIC } from '../../../graphql/Admin/static';
const { Panel } = Collapse;

function AboutQuestion() {
    const { loading, error, data } = useQuery(USER_STATIC,{variables:{page_code:"frequently_question"}});
    if (loading) return <Skeleton active />;
    if (error) return `Error! ${error.message}`;
    return (
        <div>
            <Collapse defaultActiveKey={[0]} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                {data.static.map((values,i) => (
                    <Panel header={values?.title} key={i}>
                        <p dangerouslySetInnerHTML={{__html: values?.description}} />
                    </Panel>
                ))}
            </Collapse>
        </div>
    )
}

export default AboutQuestion
