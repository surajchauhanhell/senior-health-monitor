import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import ProblemStatement from '../../components/ProblemStatement';
import SolutionOverview from '../../components/SolutionOverview';
import SystemArchitecture from '../../components/SystemArchitecture';
import Workflow from '../../components/Workflow';
import HardwareDetails from '../../components/HardwareDetails';
import SoftwareDetails from '../../components/SoftwareDetails';
import AIModels from '../../components/AIModels';
import UniqueFeatures from '../../components/UniqueFeatures';
import UserInterfaces from '../../components/UserInterfaces';
import EmergencyFlow from '../../components/EmergencyFlow';
import ValueProposition from '../../components/ValueProposition';
import Testimonials from '../../components/Testimonials';
import Pricing from '../../components/Pricing';
import Footer from '../../components/Footer';

const LandingPage = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <ProblemStatement />
            <SolutionOverview />
            <SystemArchitecture />
            <Workflow />
            <HardwareDetails />
            <SoftwareDetails />
            <AIModels />
            <UniqueFeatures />
            <UserInterfaces />
            <EmergencyFlow />
            <ValueProposition />
            <Testimonials />
            <Pricing />
            <Footer />
        </>
    );
};

export default LandingPage;
