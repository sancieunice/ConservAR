import { useEffect, RefObject } from "react";
import { useLocation } from "wouter";

/**
 * This component automatically scrolls the window to the top whenever the route changes.
 */
const ScrollToTop = ({
    scrollableElementRef,
}: {
    scrollableElementRef: RefObject<HTMLElement>;
}) => {
    const [pathname] = useLocation();

    useEffect(() => {
        scrollableElementRef.current?.scrollTo(0, 0);
    }, [pathname]);

    return null; // This component does not render anything to the DOM.
};

export default ScrollToTop;