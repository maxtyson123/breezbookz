import styles from "@/styles/main.module.css";
import {useEffect, useState} from "react";

interface SectionProps {
    children: React.ReactNode;
    id: number;
    color: string;
}

export default function Section({children, id, color}: SectionProps) {

    const [isNext, setIsNext] = useState(false);

    useEffect(() => {

        // Check if there is a next section
        const nextSection = document.getElementById(`section-${id + 1}`);

        if(nextSection) {
            setIsNext(true);
        }

    }, []);
    const scrollToNext = () => {
        const nextSection = document.getElementById(`section-${id + 1}`);
        if(nextSection) {
            nextSection.scrollIntoView({behavior: "smooth"});
        }
    }

    return (
        <>
            <div className={styles.section} style={{background: color, zIndex: `calc(999 - ${id})`}} id={`section-${id}`}>
                {children}
                {isNext &&  <button className={styles.next} onClick={scrollToNext}>{">"}</button>}
            </div>
        </>
    );
}