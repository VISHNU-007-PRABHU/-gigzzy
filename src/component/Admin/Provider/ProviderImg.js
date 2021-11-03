import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProviderImg(props) {
    var settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <>
            <Slider {...settings}>
                {props.img.map((data, i) =>
                    <div className='img_div'>
                        <img src={data} alt='no document'  className='w-100 object_fit' style={{ height: "20em" }} />
                    </div>
                )}
            </Slider>
        </>
    )
}

export default ProviderImg
