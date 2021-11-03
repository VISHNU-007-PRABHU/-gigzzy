import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Skeleton } from "antd";
import { FooterData } from "./FooterData";
const ShareButton = React.lazy(() => import('../../Comman/ShareButton'));

const { Footer } = Layout;



const UserFooter = () => {
  return (
    <div>
      <Footer className="footer_bg">
        <Row gutter={[16, 16]}>
          {FooterData.map(parentdata => {
            return (
              <>
                <Col className="gutter-row justify-content-around d-flex" xs={12} md={6}>
                  <div>
                    <ul>
                      <li>
                        <h6 style={{ color: "green" }}>{parentdata.title}</h6>
                      </li>
                      {parentdata.data.map(innerdata => {
                        if (innerdata.title === "SHAREBUTTON") {
                          return (
                            <>
                              <Suspense fallback={<Skeleton active />}>
                                <ShareButton />
                              </Suspense>
                            </>
                          )
                        } else {
                          return (<>
                            <li>
                              <Link to={innerdata.link} target="_blank" className="mr-1">{innerdata.title}</Link>
                            </li>
                          </>)
                        }
                      })}
                    </ul>
                  </div>
                </Col>
              </>
            )
          })}
        </Row>
      </Footer>
    </div >
  );
};
export default UserFooter;
