import {AnimatePresence, motion} from "framer-motion";


export const remove = (arr, item) => {
    const newArr = [...arr];
    newArr.splice(
        newArr.findIndex((i) => i === item),
        1
    );
    return newArr;
};

const notificationVariants = {
    initial: {
        opacity: 0,
        y: 50,
        scale: 0.2,
        transition: { duration: 0.1 },
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    exit: {
        opacity: 0,
        scale: 0.2,
        transition: { ease: "easeOut", duration: 0.15 },
    },
    hover: { scale: 1.05, transition: { duration: 0.1 } },
};

export const Notification = ({ notifications, setNotifications, notification }) => {
    const { text, style } = notification;

    const handleClose = () => setNotifications(remove(notifications, notification));


//   const closeOnDrag = (event, info) => {
//     console.log(info)
//     if (info.velocity.x > 0) {
//       handleClose();
//     }
//   }

    return (
        <motion.li
            positionTransition
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            // dragElastic={0.9}
            // dragTransition={{ bounceStiffness: 300, bounceDamping: 10 }}
            // onDragEnd={closeOnDrag}
            variants={notificationVariants} // Defined animation states
            whileHover="hover" // Animation on hover gesture
            initial="initial" // Starting animation
            animate="animate" // Values to animate to
            exit="exit" // Target to animate to when removed from the tree
        >
            <h3 style={{ color: style ? "white" : "white" }} className="notification-text">
                {text}
            </h3>
            <CloseButton color={style ? "white" : "white"} handleClose={handleClose} />
        </motion.li>
    );
};

const Path = (props) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke={props.color}
        strokeLinecap="square"
        {...props}
    />
);

const CloseButton = ({ handleClose, color }) => (
    <motion.div whileHover={{ scale: 1.2 }} onClick={handleClose} className="close">
        <svg width="18" height="18" viewBox="0 0 23 23">
            <Path color={color} d="M 3 16.5 L 17 2.5" />
            <Path color={color} d="M 3 2.5 L 17 16.346" />
        </svg>
    </motion.div>
);

export const NotificationContainer = ({ children, position }) => {
    return (
        <div className="container">
            <ul className={position}>
                <AnimatePresence
                    initial={false}
                >
                    {children}
                </AnimatePresence>
            </ul>
        </div>
    );
};