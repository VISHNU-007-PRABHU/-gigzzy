import React,{Suspense} from "react";
import 'antd/dist/antd.css';
import { Layout, Form, Row, Col,Skeleton } from 'antd';

const { Content } = Layout;
const UserHeader = React.lazy(() => import('../Layout/UserHeader'));
const UserFooter = React.lazy(() => import('../Layout/UserFooter'));

class Faq extends React.Component {
    render() {
        return (
            <Layout className="white" style={{ minHeight: '100vh' }}>
                <span className=" d-none d-md-block">
                    <Suspense fallback={<Skeleton active />}>
                        <UserHeader />
                    </Suspense>
                </span>
                <Content className="px-1">
                    <Row>
                        <Col lg={{ span: 20, offset: 2 }}>
                            <div id="section-1" className="why_jiffy position-relative pt-1 container ">
                            <h2 className="bold mb-5 text-center">Frequently Asked Questions</h2>
                                  <p>&nbsp;</p><p><strong>What is Gigzzy?</strong></p><p>Giggzy is an online platform giving you instant access to reliable and affordable home services. These services include but not limited to Home Cleaning, Office Cleaning, Plumping, Gardening, Electrical repair and Home Appliances repair.</p><p><strong>What are the main Benefits of using Gigzzy?</strong></p><p><strong>a)&nbsp;&nbsp;&nbsp;User</strong></p><p>There is flexibility, lower liability and lower costs as compared to conventional model of doing business. A user will get the advantage of being on boarded to the most comprehensive Internet tool available to consumers in Kenya looking for home services, plus a growing portfolio of local services.</p><p><strong></strong></p><p><strong>b)&nbsp;&nbsp;&nbsp;Provider</strong></p><p>Our providers benefit from increased flexibility, the ability to choose projects that best align with their goals and interests, and the ability to earn income from multiple sources.</p><p><strong></strong></p><p><strong>Is Gigzzy Free?</strong></p><p>Gigzzy is absolutely free. As a user you are not charged for this service because Gigzzy provides new customer leads to its pool of service professional that pay a fee for each lead they receive. These fees do not affect your estimate.</p><p><strong>Where does Gigzzy service?</strong></p><p>Our providers cover all major towns in Kenya. </p><p><strong>How long has Gigzzy been doing this?</strong></p><p>Gigzzy was founded in 2019. We've grown by teaming with local professionals to give us a base of experience stretching back as far as 2010, and a proven track record you can count on.</p><p><strong>How does Gigzzy get me the right service professional?</strong></p><p>To find the right service professional, you first submit a brief description of your service needs by answering a series of questions in a Gigzzy interview. This interview not only helps us understand your expectations, but it lets you carefully consider all the aspects of your project. Gigzzy then matches your specific need with the defined skills of a select group of service professionals. The result is a match between the right consumer and the right service professional.</p><p><strong>How do I know I'm getting the right service professional?</strong></p><p>Gigzzy service professionals are thoroughly screened before being included in our network, so you can be confident in your selection. You can also use profile information and ratings and reviews from past customers to help decide who's best for you. Our mission is to create a better connection between the right consumer and the right service professional. We want you to get your job done right!</p><p><strong>What if I change my mind and want to cancel a project or contract?</strong></p><p>The decision to cancel a project contract will have to be worked out between you and the service professional. Expect to pay for work and materials performed up to that point. </p><p><strong>Will Gigzzy cancel a service professional's member status upon receiving a customer complaint?</strong></p><p>The feedback we get from you is vital to the quality of service our member professionals provide. As with any credible grievance process, we first evaluate both sides of the story before making a final decision. Often, an unpleasant experience is the result of a simple misunderstanding between the two parties. However, if there is a negative trend against the service professional, we reserve the right to remove a service professional from our network.</p><p><strong>What are Ratings &amp; Reviews?</strong></p><p>Ratings &amp; Reviews are perhaps the most important service we offer to our users. They help us keep track of the quality of service provided by our member service professionals. For all requests you place with Gigzzy, you will be asked to submit Ratings &amp; Reviews for the service professionals you are presented. When you do, you not only help other consumers make the right choice, you also contribute to the overall quality of service we offer.</p><p><strong>How do we Vet our Providers?</strong></p><p>We have criteria that a service professional is required to meet before becoming a&nbsp;Gigzzy provider. View our <em>Contractor Screening Process</em></p><p>We are making millions of matches between consumers and service professionals and we give you the advantage of highly competent and motivated tech support with years of experience.&nbsp;We are now the most comprehensive Internet tool available to consumers in Kenya looking for home services, plus a growing portfolio of local services.</p><p>You are not charged for this service because service professionals pay advertising fees to participate in HomeAdvisor's network. Service professionals specify the type of work they do and the geography they serve. HomeAdvisor provides new customer leads that match these requests and service professionals pay a fee for each lead they receive. These fees do not affect your estimate.</p><p>&nbsp;</p>
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
        );
    }
}
export default Form.create()(Faq);