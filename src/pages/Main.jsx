import React from 'react'
import Products from './Products'
import HeroSection from '../components/HeroSection'
import HeroSectionSlider from '../components/HeroSectionSlider'

export default function Main() {
    return (
        <>
            <HeroSection></HeroSection>
            <HeroSectionSlider></HeroSectionSlider>
            <Products id={"section1"}></Products>
        </>
    )
}
