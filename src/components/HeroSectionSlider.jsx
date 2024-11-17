import React from "react";
import Slider from "react-slick";

export default function HeroSectionSlider({width="full",hight="72"}) {

    const settings = {
        arrow: false,
        dots: false,
        fade: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false
    };
    return (
        <div className={`slider-container   animate-fade w-auto h-auto`}>
            <Slider {...settings}>
                <div  >
                    <img className={`w-${width} h-${hight}`} src="https://img.freepik.com/premium-photo/3d-rendering-offline-text-with-screen-effects-technological-glitches_232104-15720.jpg" alt="" />
                </div>
                <div>
                    <img className={`w-${width} h-${hight}`} src="https://thumbs.dreamstime.com/b/offline-twitch-hud-screen-banner-stream-background-wit-gradient-shapes-screensaver-streamer-broadca-broadcast-streaming-204599531.jpg" alt="" />

                </div>
                <div>
                    <img className={`w-${width} h-${hight}`} src="https://img.freepik.com/premium-photo/3d-rendering-offline-text-with-screen-effects-technological-glitches_232104-15755.jpg?semt=ais_hybrid" alt="" />

                </div>
            </Slider>
        </div>
    );
}
