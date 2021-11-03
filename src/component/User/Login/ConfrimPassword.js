import React, { useCallback } from 'react'
import { Form, Input, Button, Card, Icon,  Spin } from 'antd';
import { useHistory } from "react-router-dom";
import { useMutation } from '@apollo/react-hooks';
import main from '../../../image/main.png';
import { RESET_PwD } from '../../../graphql/User/login';
import { Alert_msg } from '../../Comman/alert_msg';

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}

const card_style = {
  boxShadow: "0px 0px 6px 0px",
  borderRadius: "1em",
  width: "350px"
}

const header = {
  position: "absolute",
  top: 0,
  width: '100vw',
  padding: '1em',
  boxShadow: '0px 0px 11px 0px',
}
export const ConfrimPassword = () => {
  let history = useHistory();
  const [password, setpassword] = React.useState('');
  const [spin, setspin] = React.useState(false);
  const [c_password, setc_password] = React.useState('');
  const [resetPassword] = useMutation(RESET_PwD);
  const onFinish = useCallback(() => {
    let pwd_id = history.location.pathname.split('/')
    if (password != '' && c_password != '') {
      if (password === c_password) {
        setspin(true);
        resetPassword({
          variables: {
            id: pwd_id[2],
            password: password
          },
        }).then(result => {
          setspin(false);
          Alert_msg(result.data.reset_password);
          if (result.data.reset_password.status === "success") {
            history.push("/signup");
          } else {

          }
        });
      } else {
        Alert_msg({ msg: "Please enter same password !", status: "failed" })
      }
    } else {
      Alert_msg({ msg: "Please enter mandatory !", status: "failed" })
    }
  }, [resetPassword]);

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <img src={main} alt="" height="25"/>
        </div>
      </div>
      <div>
        <Card title="Reset Password" extra={<Icon type="exclamation-circle" />} style={card_style}>
          <Spin className="d-flex justify-content-center" spinning={spin} >
            <Form
              name="basic"
              initialValues={{
                remember: true,
              }}
            >
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your password!',
                  },
                ]}
              >
                <Input placeholder="Enter your Password" onChange={(event) => { setpassword(event.target.value) }} />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your password!',
                  },
                ]}
              >
                <Input.Password placeholder="Enter your Password" onChange={(event) => { setc_password(event.target.value) }} />
              </Form.Item>



              <Form.Item >
                <Button type="primary" block htmlType="submit" onClick={onFinish}>
                  Submit
              </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </div>
    </div>

  );
};

