import React,{useEffect, useState} from "react";

const useMobile = () => {    
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
    };
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return isMobile;
}

export default useMobile;