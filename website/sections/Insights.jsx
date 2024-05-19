'use client';

import { motion } from 'framer-motion';

import styles from '../styles';
import { insights } from '../constants';
import { staggerContainer } from '../utils/motion';
import { InsightCard, TitleText, TypingText } from '../components';


export function Insights(title) {

    return (
        <section className={`${styles.paddings} relative z-10`}>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{once: false, amount: 0.25}}
                className={`${styles.innerWidth} mx-auto flex flex-col`}
            >
                <TitleText title={<>asd</>} textStyles="text-center"/>
                <TypingText title="| The Hungry Scholars Survival Handbook" textStyles="text-center"/>
                <div className="mt-[50px] flex flex-col gap-[30px]">
                    {insights.map((item, index) => (
                        <InsightCard key={`insight-${index}`} {...item} index={index + 1}/>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}

export default Insights;
