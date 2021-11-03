import React from "react";
import {
    FacebookShareButton,
    TwitterIcon,
    FacebookIcon,
    WhatsappIcon,
    LinkedinIcon,
    LinkedinShareButton,
    TwitterShareButton,
    WhatsappShareButton,
} from "react-share";
class ShareButton extends React.Component {

    render() {
        return (
            <div className="d-flex justify-content-around my-2">

                <FacebookShareButton
                    url="https://web.facebook.com/gigzzy"
                    hashtag="#programing joke"
                >
                    <FacebookIcon
                        logoFillColor="white"
                        size={32}
                        round={true}
                    />
                </FacebookShareButton>
                <TwitterShareButton
                    url="https://twitter.com/Gigzzyafrica"
                    hashtag="#programing joke"
                >
                    <TwitterIcon logoFillColor="white" size={32} round={true} />
                </TwitterShareButton>
                <LinkedinShareButton
                    url="https://www.linkedin.com/company/gigzzy-africa/about/?viewAsMember=true"
                    hashtag="#programing joke"
                >
                    <LinkedinIcon
                        logoFillColor="white"
                        size={32}
                        round={true}
                    />
                </LinkedinShareButton>
                <WhatsappShareButton
                    url="https://www.whatsapp.com/"
                    hashtag="#programing joke"
                >
                    <WhatsappIcon
                        logoFillColor="white"
                        size={32}
                        round={true}
                    />
                </WhatsappShareButton>
            </div>
        );
    }
}
export default ShareButton;