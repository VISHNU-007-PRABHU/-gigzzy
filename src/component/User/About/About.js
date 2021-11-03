import React,{Suspense} from "react";
import 'antd/dist/antd.css';
import { Collapse, Affix, Modal, Carousel, Layout, Icon, Form, Input, AutoComplete, List, Avatar, Button, Typography, Row, Col,Skeleton } from 'antd';
import '../../../scss/user.scss';
import { SEARCH_CATEGORY, FIND_CATEGORY } from '../../../graphql/User/home_page';
import { client } from "../../../apollo";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Scrollspy from 'react-scrollspy';
import PlacesAutocomplete, {
    geocodeByAddress,
} from 'react-places-autocomplete';
const { Content } = Layout;

const UserHeader = React.lazy(() => import('../Layout/UserHeader'));
const UserFooter = React.lazy(() => import('../Layout/UserFooter'));
const AboutQuestion = React.lazy(() => import('./AboutQuestion'));

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location_modal: false,
            service_modal: false,
            item: null,
            responsive: {
                0: {
                    items: 1,
                },
                450: {
                    items: 2,
                },
                600: {
                    items: 3,
                },
                1000: {
                    items: 5,
                }
            },
            responsive_first_category: {
                0: {
                    items: 1,
                },
                450: {
                    items: 2,
                },
                600: {
                    items: 3,
                },
                1000: {
                    items: 4,
                }
            },
            responsive_second_category: {
                0: {
                    items: 1,
                },
                450: {
                    items: 2,
                },
                600: {
                    items: 2,
                },
                1000: {
                    items: 2,
                }
            },
            responsive_third_category: {
                0: {
                    items: 1,
                },
                450: {
                    items: 2,
                },
                600: {
                    items: 3,
                },
                1000: {
                    items: 4,
                }
            },
            nav_text: ['', ''],
            address: '',
            home_page_city: 'Kenya',
            category_data: [],
            child_data: [],
            future_data: [],
            child_data_loading: 0,
            auto_complete_data: [],
            trending_booking: [],
            my_booking: [],
            category_values: '',
            center: [9.9252, 78.1198],
        };
    }
    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        this.setState({ address: address });
        geocodeByAddress(address)
            .then(results => {
                results[0].address_components.map((value, index) => {
                    if (value.types[0] === "locality") {
                        this.setState({ home_page_city: value.long_name });
                    }
                });
            })
            .catch(error => console.error('Error', error));
    };

    setLocationModal(location_modal) {
        this.setState({ location_modal });
    }

    setServiceModal(service_modal) {
        this.setState({ service_modal });
    }

    category_search = async value => {
        console.log(value)
        this.setState({ category_values: value });
        if (value === undefined) {
            value = "a"
        }
        if (value.length >= 1) {
            const { data } = await client.query({
                query: SEARCH_CATEGORY,
                variables: { data: { value: value } },
            });
            this.setState({ auto_complete_data: data ? data.search_category : [] })
        }
    };

    _subcategory_book = async (item) => {
        if (localStorage.getItem('userLogin') === 'success') {
            let data = { type: 2, location: this.state.center, location_detail: this.state.home_page_city };
            this.props.history.push({ pathname: `/description/${item._id}`, state: data });
        } else {
            this.props.history.push('/login');
        }
    }

    on_book = async () => {
        console.log(this.state.home_page_city);
        console.log(this.state.category_values);
        console.log(this.state.center);
        if (this.state.category_values !== undefined && this.state.center.length > 0) {
            var data = this.state.category_values.split("_");
            if (data[2] === "false") {
                if (localStorage.getItem('userLogin') === 'success') {
                    this.props.history.push({ pathname: `/description/${data[0]}`, state: { type: Number(data[1]), location: this.state.center, location_detail: this.state.home_page_city } });
                } else {
                    this.props.history.push('/login');
                }
            } else {
                await client.query({
                    query: FIND_CATEGORY,
                    variables: { _id: data[0] },
                    fetchPolicy: 'no-cache',
                }).then(result => {
                    this.setState({ child_data: result.data.category[0] ? result.data.category[0].child_category : [], service_modal: 1 });
                });
            }
        }
    }

    render() {
        return (
            <Layout className="white">
                <span className=" d-none d-md-block">
                    <Suspense fallback={<Skeleton active />}>
                        <UserHeader />
                    </Suspense>
                </span>
                <Row className="d-none visible-md">
                    <Col span={24}>
                        <div className="spy_section ant-col ant-col-24 mb-5">
                            <Affix className="ant-col ant-col-24 text-center">
                                <Scrollspy className="ant-col ant-col-24" items={['section-1', 'section-2', 'section-3', 'section-4']} currentClassName="is-current">
                                    <li><a href="#section-1">Why Gigzzy</a></li>
                                    <li><a href="#section-2">How it Works</a></li>
                                    <li><a href="#section-3">FAQ's</a></li>
                                    <li><a href="#section-4">Hiring Guide</a></li>
                                </Scrollspy>
                            </Affix>
                        </div>
                    </Col>
                </Row>
                <Content className="px-1">
                    <Modal footer={<></>} title="List subcategory based on category" className="new_modal" centered visible={this.state.service_modal} onOk={() => { this.setState({ service_modal: 0 }) }} onCancel={() => { this.setState({ service_modal: 0 }) }}>
                        <List
                            className="mt-4 mx-5"
                            bordered
                            itemLayout="horizontal"
                            dataSource={this.state.child_data}
                            renderItem={item => (
                                <List.Item style={{ cursor: 'pointer' }} onClick={() => { this._subcategory_book(item) }}>
                                    <Typography.Text ><Avatar src={item.img_url} /></Typography.Text>
                                    <Typography.Text className="px-4">{item.subCategory_name}</Typography.Text>
                                </List.Item>
                            )}
                        />

                    </Modal>
                    <Row>
                        <Col lg={{ span: 20, offset: 2 }}>
                            <div className="banner_section d-none d-md-block">
                                <Carousel autoplay effect="fade">
                                    <div>
                                        <img alt='' src={require("../../../image/handyman.jpg")} />
                                    </div>
                                    <div>
                                        <img alt='' src={require("../../../image/handyman2.jpg")} />
                                    </div>
                                    <div>
                                        <img alt='' src={require("../../../image/handyman3.jpg")} />
                                    </div>
                                </Carousel>
                                <div className="banner_inner">
                                    <Col span={24} className="h-100">
                                        <div className="d-flex h-100 align-items-center">
                                            <div className="banner_center w-100 text-center">
                                                <h3 className="white-text bold px-2">Your Service Expert in {this.state.home_page_city} </h3>
                                                <p className="white-text normal_font_size mb-5 px-2">Get instant access to reliable and affordable Gigzzy service providers.</p>
                                                <Col sm={{ span: 4, offset: 3 }} xs={{ span: 22, offset: 1 }} className="mr-4 mb-4">
                                                    <Button icon="environment" className="px-1 jiffy_btn h-50x normal_font_size w-100 text-left" onClick={() => this.setLocationModal(true)}>
                                                        {this.state.home_page_city}
                                                    </Button>
                                                </Col>
                                                <Col sm={{ span: 8 }} xs={{ span: 22, offset: 1 }} className="mr-4 mb-4">
                                                    <AutoComplete
                                                        className="w-100 h-50x service_autocomplete certain-category-search"
                                                        dropdownClassName="certain-category-search-dropdown"
                                                        onSelect={(value) => { this.setState({ category_values: value }) }}
                                                        onSearch={this.category_search}
                                                        onFocus={this.category_search}
                                                        placeholder="Search for Services"
                                                        value={this.state.category_values}
                                                        dataSource={this.state.auto_complete_data.map((data, index) => {
                                                            console.log(data);
                                                            return (
                                                                <AutoComplete.Option key={`${data._id}_${data.category_type}_${data.is_parent}`}>
                                                                    {data.category_type === 1 ? data.category_name : data.subCategory_name}
                                                                </AutoComplete.Option>
                                                            );
                                                        })}
                                                    >
                                                        <Input prefix={<Icon type="search" className="certain-category-icon" />} />


                                                    </AutoComplete>
                                                </Col>
                                                <Col sm={{ span: 3 }} xs={{ span: 22, offset: 1 }}>
                                                    <Button className="px-1 jiffy_btn h-50x normal_font_size w-100 text-center primary-bg white-text" onClick={() => { this.on_book() }}>
                                                        Book
                                                    </Button>
                                                </Col>
                                                <Modal title="Choose Your Location" centered visible={this.state.location_modal} onOk={() => this.setLocationModal(false)} onCancel={() => this.setLocationModal(false)}>
                                                    <PlacesAutocomplete
                                                        value={this.state.address}
                                                        onChange={this.handleChange}
                                                        onSelect={this.handleSelect}
                                                    >
                                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                            <div className="position-relative">
                                                                <input
                                                                    {...getInputProps({
                                                                        placeholder: 'Location',
                                                                        className: 'location-search-input jiffy_input place_input',
                                                                    })}
                                                                />
                                                                <div className="autocomplete-dropdown-container">
                                                                    {loading && <div className="suggest_load">Loading...</div>}
                                                                    {suggestions.map(suggestion => {
                                                                        const className = suggestion.active
                                                                            ? 'suggestion-item--active'
                                                                            : 'suggestion-item';
                                                                        // inline style for demonstration purpose
                                                                        const style = suggestion.active
                                                                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                                        return (
                                                                            <div
                                                                                {...getSuggestionItemProps(suggestion, {
                                                                                    className,
                                                                                    style,
                                                                                })}
                                                                            >
                                                                                <span>{suggestion.description}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </PlacesAutocomplete>
                                                </Modal>
                                            </div>
                                        </div>
                                    </Col>
                                </div>
                            </div>
                            <div id="section-1" className="why_jiffy position-relative pt-5 container text-center">
                                <h2 className="bold mb-5 text-center">Why Gigzzy</h2>
                                <p className="normal_font_size">
                                Availability of on demand specialized and credentialed  skill sets at an affordable rate.
                                Large workforce pool to choose from<br/>
                                Background checks on regulatory compliance on all partners   <br/>                                 
                                </p>
                            </div>
                            <div id="section-2" className="feature_section pt-5 container mb-5">
                                <h2 className="bold mb-5 text-center">How it Works</h2>
                               
                                <p><strong>SELECT WHAT YOU NEED </strong></p><ul><li>Select a task category that best matches your home repair ,personal need e.g. Barber /Massage or improvement need</li><li>Gigzzy has a simple and easy to follow questionnaire ,please describe your need as much as possible for us to connect you with the best Gigzzy pro.</li><li>Gigzzy has over 5000 service professionals specializing in over 100 category tasks .</li></ul><p><strong>Get Matched to Your Needs</strong></p><ul><li>You'll receive information for up to four pre-screened, local home improvement ,office repair and personal care pros.</li><li>Your matched pros provide the specific service you need and are available&nbsp;<strong>right now or at a later date .</strong></li></ul><p><strong>Connect to a Gigzzy Professional</strong></p><ul><li>As soon as your request is processed, we send your information to your matched pros</li><li>Shortly after receiving your service request, they'll contact you to discuss your project, you can also contact them via gigzzy app chat.</li><li>If you prefer, you can contact them at your convenience.</li><li>Pay via Gigzzy app and confirm your order.</li></ul><p></p><p><strong>How does Gigzzy work for contractors?</strong></p><ol><li><span style={{color: "rgb(92, 111, 121)"}}>Gigzzy &nbsp;connects professionals and contractors with office and home owners &nbsp;who are ready to hire gurus for their home and office projects &nbsp;projects — giving you access to targeted leads for your business. Simply choose the services you offer and the locations you serve, and Gigzzy will match you with home and office owners &nbsp;looking for pros in those areas . Gigzzy will &nbsp;give you the tools you need to connect with homeowners and win the contract.</span></li></ol>
                                <Row>
                                    <Col sm={{ span: 8 }} className="px-1">
                                        <div className="image_head"><img alt='' src={require("../../../image/quality.png")} /></div>
                                        <p className="normal_font_size my-3 bold">High Quality & Trusted Professionals</p>
                                        <label>We Provide only verified, background checked and high quality Professionals</label>
                                    </Col>
                                    <Col sm={{ span: 8 }} className="px-1">
                                        <div className="image_head"><img alt='' src={require("../../../image/budget-management.png")} /></div>
                                        <p className="normal_font_size my-3 bold">Matched to Your Needs</p>
                                        <label>We match you with the right professional within your budget.</label>
                                    </Col>
                                    <Col sm={{ span: 8 }} className="px-1">
                                        <div className="image_head"><img alt='' src={require("../../../image/like.png")} /></div>
                                        <p className="normal_font_size my-3 bold">Hustle Free Services</p>
                                        <label>Super convenient, guaranteed service from booking to delivery</label>
                                    </Col>
                                </Row>
                            </div>
                            <div id="section-3" className="faq_section position-relative pt-5 container">
                                <h2 className="bold mb-5 text-center">Frequently Asked Questions</h2>
                                  "<p>&nbsp;</p><p><strong>What is Gigzzy?</strong></p><p>Giggzy is an online platform giving you instant access to reliable and affordable home services. These services include but not limited to Home Cleaning, Office Cleaning, Plumping, Gardening, Electrical repair and Home Appliances repair.</p><p><strong>What are the main Benefits of using Gigzzy?</strong></p><p><strong>a)&nbsp;&nbsp;&nbsp;User</strong></p><p>There is flexibility, lower liability and lower costs as compared to conventional model of doing business. A user will get the advantage of being on boarded to the most comprehensive Internet tool available to consumers in Kenya looking for home services, plus a growing portfolio of local services.</p><p><strong>&nbsp;</strong></p><p><strong>b)&nbsp;&nbsp;&nbsp;Provider</strong></p><p>Our providers benefit from increased flexibility, the ability to choose projects that best align with their goals and interests, and the ability to earn income from multiple sources.</p><p><strong>&nbsp;</strong></p><p><strong>Is Gigzzy Free?</strong></p><p>Gigzzy is absolutely free. As a user you are not charged for this service because Gigzzy provides new customer leads to its pool of service professional that pay a fee for each lead they receive. These fees do not affect your estimate.</p><p><strong>Where does Gigzzy service?</strong></p><p>Our providers cover all major towns in Kenya. </p><p><strong>How long has Gigzzy been doing this?</strong></p><p>Gigzzy was founded in 2019. We've grown by teaming with local professionals to give us a base of experience stretching back as far as 2010, and a proven track record you can count on.</p><p><strong>How does Gigzzy get me the right service professional?</strong></p><p>To find the right service professional, you first submit a brief description of your service needs by answering a series of questions in a Gigzzy interview. This interview not only helps us understand your expectations, but it lets you carefully consider all the aspects of your project. Gigzzy then matches your specific need with the defined skills of a select group of service professionals. The result is a match between the right consumer and the right service professional.</p><p><strong>How do I know I'm getting the right service professional?</strong></p><p>Gigzzy service professionals are thoroughly screened before being included in our network, so you can be confident in your selection. You can also use profile information and ratings and reviews from past customers to help decide who's best for you. Our mission is to create a better connection between the right consumer and the right service professional. We want you to get your job done right!</p><p><strong>What if I change my mind and want to cancel a project or contract?</strong></p><p>The decision to cancel a project contract will have to be worked out between you and the service professional. Expect to pay for work and materials performed up to that point. </p><p><strong>Will Gigzzy cancel a service professional's member status upon receiving a customer complaint?</strong></p><p>The feedback we get from you is vital to the quality of service our member professionals provide. As with any credible grievance process, we first evaluate both sides of the story before making a final decision. Often, an unpleasant experience is the result of a simple misunderstanding between the two parties. However, if there is a negative trend against the service professional, we reserve the right to remove a service professional from our network.</p><p><strong>What are Ratings &amp; Reviews?</strong></p><p>Ratings &amp; Reviews are perhaps the most important service we offer to our users. They help us keep track of the quality of service provided by our member service professionals. For all requests you place with Gigzzy, you will be asked to submit Ratings &amp; Reviews for the service professionals you are presented. When you do, you not only help other consumers make the right choice, you also contribute to the overall quality of service we offer.</p><p><strong>How do we Vet our Providers?</strong></p><p>We have criteria that a service professional is required to meet before becoming a&nbsp;Gigzzy provider. View our <em>Contractor Screening Process</em></p><p>We are making millions of matches between consumers and service professionals and we give you the advantage of highly competent and motivated tech support with years of experience.&nbsp;We are now the most comprehensive Internet tool available to consumers in Kenya looking for home services, plus a growing portfolio of local services.</p><p>&nbsp;</p><p>&nbsp;</p><p>You are not charged for this service because service professionals pay advertising fees to participate in HomeAdvisor's network. Service professionals specify the type of work they do and the geography they serve. HomeAdvisor provides new customer leads that match these requests and service professionals pay a fee for each lead they receive. These fees do not affect your estimate.</p><p>&nbsp;</p>"                                  
                                <Suspense fallback={<Skeleton active />}>
                                    <AboutQuestion />
                                </Suspense> 
                            </div>
                            <div id="section-4" className="hiring_section position-relative pt-5 container">
                                <h2 className="bold mb-5 text-center">Hiring Guide</h2>
                                <p className="normal_font_size">Verified Companies and Professionals: We use only the top-rated, government-licensed and ISO-certified movers. Every Packer and Mover Professional from UrbanClap goes through 4 Levels of Verification: Background Verification, Consumer Court Case Check, Physical Verification and ID Proof Verification </p>
                                <p className="normal_font_size">Quality of Packing: We use a 3-layered Packing system - using Fabric Sheet covered by a Bubble Wrap further covered by a Corrugated sheet base. Most Local companies just use Fabric sheet. </p>
                                <p className="normal_font_size">Quality of Packing: We use a 3-layered Packing system - using Fabric Sheet covered by a Bubble Wrap further covered by a Corrugated sheet base. Most Local companies just use Fabric sheet. </p>
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
export default Form.create()(About);